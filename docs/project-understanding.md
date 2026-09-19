
# SkillBridge Project Understanding

This document is a learning guide to the code that actually exists in SkillBridge.
It starts with a beginner-friendly mental model, then adds the implementation detail
needed to explain the design in a technical interview.

## Repository layout

- `backend/` contains the complete Express, TypeScript, Prisma, and PostgreSQL
  backend. Run npm and Prisma commands from this directory.
- `frontend/` is reserved for the upcoming Next.js frontend; it contains no
  application code yet.
- `docs/` contains repository-level architecture, API, setup, decision, and learning
  documentation.

Backend source paths in this guide therefore begin with `backend/src/`, and the
database schema lives at `backend/prisma/schema.prisma`.

## Authentication and Role-Based Authorization

### Beginner mental model

Authentication answers **“Who is making this request?”** Authorization answers
**“Is that user allowed to do this?”**

In SkillBridge:

1. Registration creates an account and the matching student or recruiter profile.
2. Login checks the password and returns an access token.
3. A protected request sends that token in the `Authorization` header.
4. The server verifies the token, reads the User ID, and reloads the User from
   PostgreSQL.
5. Role middleware can then decide whether the current STUDENT, RECRUITER, or ADMIN
   may access a route.

The access token proves that the server issued a valid, unexpired credential for a
User ID. It does not replace the database, and it does not make an embedded role
authoritative.

### Authentication code map

| Responsibility | Actual code |
| --- | --- |
| Mount `/api/auth` | `backend/src/routes/index.ts` — `createApiRouter` |
| Define register, login, and current-user routes | `backend/src/routes/auth.routes.ts` — `createAuthRouter` |
| Parse body/query/params with Zod | `backend/src/middleware/validate-request.ts` — `validateRequest` |
| Define registration and login schemas | `backend/src/validators/auth.validator.ts` |
| Translate HTTP input/output | `backend/src/controllers/auth.controller.ts` — `register`, `createLogin`, `currentUser` |
| Register, log in, and load the current user | `backend/src/services/auth.service.ts` — `registerUser`, `login`, `getCurrentUser` |
| Hash and compare passwords | `backend/src/utils/password.ts` — `hashPassword`, `verifyPassword` |
| Create and verify JWTs | `backend/src/utils/token.ts` — `createAccessToken`, `verifyAccessToken` |
| Authenticate a protected request | `backend/src/middleware/authenticate.ts` — `createAuthenticate` |
| Enforce allowed roles | `backend/src/middleware/require-role.ts` — `requireRole` |
| Type the authenticated context | `backend/src/types/auth.ts` — `AuthenticatedUser`, `AuthLocals`, `OptionalAuthLocals` |
| Produce consistent errors | `backend/src/utils/app-error.ts` and `backend/src/middleware/error-handler.ts` |

### Registration flow: `POST /api/auth/register`

The route is declared in `createAuthRouter`:

```text
POST /api/auth/register
  -> validateRequest(registerRequestSchema, register)
  -> register controller
  -> registerUser service
  -> hashPassword
  -> Prisma transaction
  -> User + StudentProfile or RecruiterProfile
```

Step by step:

1. `backend/src/app.ts` mounts the root API router at `/api`.
2. `createApiRouter` in `backend/src/routes/index.ts` mounts `createAuthRouter(config)` at
   `/auth`.
3. `createAuthRouter` passes the request through
   `validateRequest(registerRequestSchema, register)`.
4. `registerRequestSchema` in `backend/src/validators/auth.validator.ts` parses a
   discriminated union based on `role`:
   - STUDENT requires `university`, `degree`, and `graduationYear`.
   - RECRUITER requires `company` and `designation`.
   - ADMIN is not a valid public registration variant.
5. The validator trims names/profile strings and trims plus lowercases email. It
   leaves the password text unchanged, requires at least eight characters, and
   rejects passwords above 72 UTF-8 bytes.
6. `validateRequest` gives the controller the parsed `validated.body`; it does not
   overwrite `req.body`.
7. The `register` controller calls `registerUser(validated.body)`.
8. `registerUser` calls `hashPassword(input.password)` before opening a transaction.
9. Inside `prisma.$transaction`, it uses the callback's `transaction` client to
   create the `User`, followed by either `transaction.studentProfile.create` or
   `transaction.recruiterProfile.create`.
10. Explicit Prisma selections (`safeUserSelect`, `studentProfileSelect`, and
    `recruiterProfileSelect`) control the returned fields. `passwordHash` is not in
    the response.
11. The controller returns HTTP 201 with `{ user, profile }`. It does not return an
    access token.

A Prisma `P2002` unique-constraint failure is translated to
`409 EMAIL_ALREADY_EXISTS` by `registerUser`.

#### Why registration does not return a JWT

Registration and login are intentionally separate operations. Registration proves
that valid account data could be stored; login is the operation that verifies stored
credentials and issues an access token. The client therefore registers first and
then calls `POST /api/auth/login`.

This gives the API a clear contract: only `login` calls `createAccessToken`. It also
keeps token issuance outside the registration transaction and prevents account
creation from silently becoming an authenticated session.

### Password storage and bcrypt

#### Hashing is not encryption

Encryption is designed to be reversible when someone has the decryption key.
Password hashing is designed to be one-way: the application stores a derived hash,
not the original password, and checks a future password against that hash.

`hashPassword` in `backend/src/utils/password.ts` calls:

```ts
bcrypt.hash(password, 12)
```

The database stores the result in `User.passwordHash`. The plaintext password is
never placed in Prisma data and is never returned by an API response. During login,
`verifyPassword` calls `bcrypt.compare(password, passwordHash)`.

#### Why cost factor 12?

Bcrypt's cost factor controls how much work hashing requires. Cost 12 means bcrypt
uses `2^12` internal work rounds. Deliberately expensive password checks make
large-scale password guessing more costly, while remaining usable for normal login
traffic. Increasing the cost improves resistance to guessing but also increases CPU
time, so it is an operational tradeoff rather than a value to raise without testing.

#### Why the 72-byte limit matters

Bcrypt processes only its first 72 input bytes. Bytes are not the same as JavaScript
characters: an emoji can require several UTF-8 bytes. `withinBcryptLimit` therefore
uses `Buffer.byteLength(password, "utf8") <= 72` for both registration and login.
This prevents two visually different overlong passwords from being treated as the
same truncated bcrypt input.

### Login flow: `POST /api/auth/login`

```text
POST /api/auth/login
  -> validateRequest(loginRequestSchema, createLogin(config))
  -> loginController
  -> login service
  -> User lookup by normalized email
  -> bcrypt.compare
  -> createAccessToken with jose
  -> access-token response
```

Step by step:

1. `loginRequestSchema` trims and lowercases the email through
   `normalizedEmailSchema`. The service can therefore assume its email input is
   normalized.
2. The supplied password is not trimmed. It is treated as exact credential input
   and is limited to 72 UTF-8 bytes.
3. `createLogin(config)` creates `loginController`, which calls
   `login(validated.body, config)`.
4. `login` queries `getPrisma().user.findUnique({ where: { email } })` using
   `loginUserSelect`. This selection temporarily includes `passwordHash` because it
   is needed for comparison.
5. `verifyPassword` calls `bcrypt.compare` with the supplied password and stored
   hash.
6. A missing user and an incorrect password both produce the same
   `401 INVALID_CREDENTIALS` response. This avoids using the login response to tell
   clients whether a particular email exists.
7. On success, the service removes `passwordHash` from the returned user object and
   calls `createAccessToken(user.id, config)`.
8. The response contains `accessToken`, `tokenType: "Bearer"`, the configured
   `expiresIn`, and safe User fields.

### JWT from first principles

A JSON Web Token is a compact string with three Base64URL-encoded parts separated
by dots:

```text
header.payload.signature
```

Base64URL encoding is not encryption. Anyone holding a JWT can decode its header and
payload. Security comes from the signature, so secrets must never be placed in the
payload.

#### 1. Header

The header describes how the token is signed. `createAccessToken` uses
`{ "alg": "HS256" }`. HS256 uses the same server secret to create and verify the
signature.

#### 2. Payload

The payload contains claims—statements about the token:

| Claim | Meaning in SkillBridge |
| --- | --- |
| `sub` | Subject: the User UUID. `verifyAccessToken` also validates that it is a UUID. |
| `iat` | Issued at: when the server created the token. |
| `exp` | Expiration: after this time the token is rejected. |
| `iss` | Issuer: fixed to `skillbridge-api`. |
| `aud` | Audience: fixed to `skillbridge-api`. |

`JWT_EXPIRES_IN` controls `exp`, while `JWT_SECRET` supplies the HS256 signing key.
`backend/src/config/env.ts` requires the secret to contain at least 32 UTF-8 bytes and limits
duration syntax to positive minute, hour, or day values such as `15m`, `1h`, or
`1d`.

#### 3. Signature

The signature lets the server detect changes to the header or payload and verify
that the token was signed with the configured secret. `verifyAccessToken` uses
`jose.jwtVerify` and requires HS256 plus the expected issuer and audience. An altered,
expired, incorrectly signed, or otherwise invalid token becomes
`401 INVALID_TOKEN`.

#### Why role is not authoritative token state

`createAccessToken` deliberately puts the User ID in `sub` but does not add role.
Roles can change, and users can be deleted, while a token is still unexpired. If
authorization trusted a role copied into the token, a demoted user could keep old
permissions until token expiry.

SkillBridge instead reloads the User from PostgreSQL for every protected request.
The role returned by that lookup is the role used by RBAC. Even if a token somehow
contains a stale `role` claim, `createAuthenticate` ignores it.

### Trace of an authenticated request

The implemented protected example is `GET /api/auth/me`:

```text
Authorization: Bearer <token>
  -> createAuthenticate(config)
  -> parse Bearer header
  -> verifyAccessToken(token, config)
  -> verify signature, expiry, issuer, audience, and UUID sub
  -> extract userId from sub
  -> PostgreSQL User lookup by primary key
  -> read current id and role
  -> response.locals.auth = { userId, role }
  -> currentUser controller
  -> getCurrentUser service
```

`createAuthenticate` in `backend/src/middleware/authenticate.ts` accepts exactly one Bearer
token, calls `verifyAccessToken`, and then performs:

```ts
getPrisma().user.findUnique({
  where: { id: userId },
  select: { id: true, role: true },
})
```

If the User exists, downstream code receives the current database identity through
`res.locals.auth`. If a valid token refers to a deleted User, the current explicit
API choice is `401 USER_NOT_FOUND`.

`GET /api/auth/me` then calls `getCurrentUser`. STUDENT must have a StudentProfile,
RECRUITER must have a RecruiterProfile, and ADMIN receives `profile: null`. A missing
required role profile is treated as an internal data-integrity failure and is hidden
behind the generic `500 INTERNAL_SERVER_ERROR` response.

### Why PostgreSQL is queried on every protected request

The token establishes a signed User ID, but PostgreSQL is the source of truth for
whether that User still exists and which role the User currently has.

Benefits:

- deleting a User invalidates their access on the next request;
- changing a role changes authorization on the next request;
- RBAC never depends on stale token role data.

Cost:

- every authenticated request performs one indexed lookup on the User primary key;
- database availability and latency are therefore part of authenticated-request
  availability and latency.

This is a deliberate consistency-over-throughput choice for the current stage. No
Redis or authentication cache is implemented.

### Authentication versus authorization

Authentication identifies the caller. In SkillBridge, `createAuthenticate(config)`
verifies the Bearer token, reloads the User, and creates the authenticated context.

Authorization decides what that authenticated caller may do. In SkillBridge,
`requireRole(...roles)` checks the current database role in `res.locals.auth`.

Example route composition for a future recruiter-only endpoint would be:

```ts
router.post(
  "/opportunities",
  createAuthenticate(config),
  requireRole(UserRole.RECRUITER),
  createOpportunity,
);
```

The first middleware answers “which current user is this?” The second answers “is
the current role RECRUITER?” The example is explanatory only; opportunity routes are
not implemented yet.

### How `requireRole(...roles)` works

`requireRole` is defined in `backend/src/middleware/require-role.ts`. It accepts one or more
allowed `UserRole` values and returns `authorizeRole` middleware.

1. It reads `response.locals.auth`.
2. If authentication context is absent, it throws
   `401 AUTHENTICATION_REQUIRED`.
3. If `auth.role` is not in `allowedRoles`, it throws `403 FORBIDDEN`.
4. Otherwise it calls `next()`.

It does not parse JWTs, query the database, or trust a role claim. Those are the
authentication middleware's responsibilities. No current business-feature route
uses `requireRole` yet; it is implemented and tested as reusable infrastructure.

### Understanding the main 401 and 403 responses

| Response | Meaning | Example |
| --- | --- | --- |
| `401 AUTHENTICATION_REQUIRED` | The request did not present usable Bearer credentials. | Missing header, `Basic ...`, or malformed `Bearer` header. |
| `401 INVALID_TOKEN` | A token was presented, but token verification failed. | Bad signature, expired token, wrong issuer/audience, or invalid/missing UUID `sub`. |
| `403 FORBIDDEN` | Authentication succeeded, but the current role is not allowed. | A STUDENT calls a recruiter-only route. |

The key distinction is that 401 means the server cannot accept the caller's
authentication, while 403 means the caller is authenticated but lacks permission.
SkillBridge also uses `401 USER_NOT_FOUND` when a valid token's User has since been
deleted.

### Typed `res.locals.auth`

`backend/src/types/auth.ts` defines:

```ts
interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

interface AuthLocals {
  auth: AuthenticatedUser;
}
```

`OptionalAuthLocals` represents middleware stages where `auth` may not yet exist.
After authentication, protected controllers such as `currentUser` declare
`Response<unknown, AuthLocals>`, so TypeScript knows that `response.locals.auth`
contains a User ID and role.

`res.locals` was chosen because Express already provides it as request-scoped data
for middleware and handlers. It avoids mutating `req`, globally augmenting Express's
`Request` interface, adding an application-specific `req.user`, or repeatedly using
unsafe casts. Each request receives its own response-local object.

### Registration transaction and failure behavior

Conceptually, `registerUser` performs:

```text
hash password before transaction

BEGIN
  INSERT User
  INSERT StudentProfile or RecruiterProfile
COMMIT
```

Both inserts use the transaction client passed into the interactive
`prisma.$transaction` callback. If profile creation throws, the callback rejects and
Prisma does not commit the transaction; PostgreSQL transaction semantics are
expected to roll back the User insert as well. The error propagates to centralized
error handling.

Hashing happens before `BEGIN` because bcrypt is CPU work, not database work. Keeping
it outside avoids holding a database transaction open while the password is hashed.
JWT creation is not part of registration at all.

### What the tests prove—and what they do not

The mocked persistence tests in `backend/src/services/auth.service.test.ts` prove that:

- `registerUser` calls `prisma.$transaction`;
- User and profile writes use the callback transaction client;
- Prisma receives a bcrypt hash rather than a plaintext password;
- a profile-write rejection propagates out of the service;
- a `P2002` failure maps to `EMAIL_ALREADY_EXISTS`.

They do **not** prove physical PostgreSQL rollback: specifically, they do not show
that a real server executes `ROLLBACK` or that no row remains after an actual
database failure. The mock runs a JavaScript callback with fake methods; it is not a
database transaction engine.

A real rollback test would need a disposable PostgreSQL database, run the real Prisma
transaction, deliberately fail after the User insert, and then query the database to
confirm that the User row does not exist. That integration test is not currently in
the repository.

Other auth tests use real bcrypt and `jose` behavior while mocking Prisma at the
persistence boundary:

- `backend/src/auth.test.ts` tests register/login/me HTTP contracts.
- `backend/src/middleware/authenticate.test.ts` tests Bearer parsing, token failures, deleted
  users, and database-role freshness.
- `backend/src/middleware/require-role.test.ts` tests single-role and multi-role access.
- `backend/src/utils/password.test.ts` tests real bcrypt hashing and comparison.
- `backend/src/utils/token.test.ts` tests real JWT creation and verification.

## Interview-Level Questions and Concise Answers

### How does authentication work?

Login normalizes the email, loads the User, checks the supplied password with
`bcrypt.compare`, and issues an HS256 JWT whose `sub` is the User UUID. On every
protected request, `createAuthenticate` verifies the token and reloads the current
User ID and role from PostgreSQL into `res.locals.auth`.

### Why JWT?

JWT gives the API a compact, signed Bearer credential with standard expiry, issuer,
audience, and subject claims. It fits the current stateless access-token requirement
without server sessions. SkillBridge still performs a database lookup because role
freshness and deleted-user enforcement are more important here than eliminating that
lookup.

### Why not store role in the JWT?

Roles can change before a token expires. Trusting a token role would delay demotions
or promotions until token expiry. SkillBridge omits authoritative role state and
uses the role read from PostgreSQL on each authenticated request.

### Why bcrypt?

Bcrypt is a purpose-built, salted password hashing algorithm with an adjustable work
factor. SkillBridge uses cost 12, stores only the hash, compares with
`bcrypt.compare`, and enforces the algorithm's 72-byte input limit using UTF-8 byte
length.

### Authentication versus authorization?

Authentication establishes identity; authorization checks permission. In this code,
`createAuthenticate` establishes `{ userId, role }`, and `requireRole(...roles)`
decides whether that current role may continue.

### Where did you use transactions?

`registerUser` in `backend/src/services/auth.service.ts` uses an interactive Prisma
transaction to create the User and the matching StudentProfile or RecruiterProfile as
one unit. Password hashing happens before the transaction.

### Why does every authenticated request query PostgreSQL?

It makes deletion and role changes effective on the next request. The tradeoff is
one indexed User lookup per protected request and a dependency on database latency
and availability.

### Why can't users register as ADMIN?

The public Zod registration union contains only STUDENT and RECRUITER. Allowing
clients to choose ADMIN would let them self-assign privileged access. Admin accounts
must come from a seed or a future privileged provisioning process.

### Why `res.locals` instead of `req.user`?

`res.locals` is already request-scoped in Express and can be typed per protected
controller. It avoids mutating the request object, global Express type augmentation,
and unsafe casts while keeping authentication context available to downstream
middleware and controllers.

## Things I Should Be Able to Explain Without Notes

- [ ] Trace `POST /api/auth/register` from route and Zod validation through
  `register`, `registerUser`, bcrypt, and the Prisma transaction.
- [ ] Explain why registration returns safe User/profile data but no JWT.
- [ ] Trace `POST /api/auth/login` through email normalization, User lookup,
  `bcrypt.compare`, `createAccessToken`, and the response.
- [ ] Explain hashing versus encryption and why plaintext passwords are never stored.
- [ ] Explain bcrypt cost 12 and why the 72-byte limit uses UTF-8 byte length.
- [ ] Describe a JWT's header, payload, and signature, and explain `sub`, `iat`,
  `exp`, `iss`, and `aud`.
- [ ] Explain why JWT payloads are readable and must not contain secrets.
- [ ] Explain why role is not authoritative token state in SkillBridge.
- [ ] Trace `Authorization: Bearer <token>` through `createAuthenticate`,
  `verifyAccessToken`, the User lookup, and `res.locals.auth`.
- [ ] Explain the benefit and cost of querying PostgreSQL on every protected request.
- [ ] Distinguish authentication from authorization with a SkillBridge example.
- [ ] Explain how `requireRole(...roles)` handles allowed, forbidden, and missing-auth
  cases.
- [ ] Distinguish `AUTHENTICATION_REQUIRED`, `INVALID_TOKEN`, and `FORBIDDEN`.
- [ ] Explain the explicit `USER_NOT_FOUND` behavior for a deleted token subject.
- [ ] Explain why typed `res.locals.auth` was chosen instead of `req.user`.
- [ ] Draw the registration `BEGIN -> User -> Profile -> COMMIT` transaction and
  explain the failure path.
- [ ] Explain what the mocked transaction tests prove and why a real PostgreSQL test
  is still required to prove physical rollback.
- [ ] Explain why public registration cannot create ADMIN users.
