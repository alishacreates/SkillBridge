# Authentication and Authorization Design

## Status and scope

This approved Task 4 design is now implemented. Its scope is public registration,
login, Bearer-token authentication, current-user lookup, and reusable role
authorization. It excludes refresh tokens, sessions,
Redis, Passport, OAuth, social login, email verification, password recovery, MFA,
business feature routes, admin analytics, and frontend authentication.

The existing Prisma schema supports this design without changes.

## Module boundaries and request flow

Auth follows the existing functional layers:

`Route -> Validation Middleware -> Controller -> Service -> Prisma -> PostgreSQL`

- `auth.routes.ts` composes public and protected endpoints.
- `auth.validator.ts` defines discriminated registration, login, and request schemas.
- `authenticate.ts` verifies a token, reloads its user, and writes typed auth context
  to `res.locals.auth`.
- `require-role.ts` checks the current database role independently of authentication.
- `auth.controller.ts` translates validated requests and authenticated context into
  the existing response envelopes.
- `auth.service.ts` owns registration, credential verification, and current-user
  retrieval through the shared Prisma client.
- Focused password and token utilities wrap bcrypt and `jose` without persistence or
  HTTP concerns.

Typed Express `res.locals` is used because it is request-scoped and avoids modifying
`req`, global Express augmentation, or unsafe casts. Protected controllers declare
the authenticated locals type explicitly.

## Registration

`POST /api/auth/register` accepts a discriminated payload:

- Common: `name`, `email`, `password`, `role`.
- `STUDENT`: `university`, `degree`, `graduationYear`.
- `RECRUITER`: `company`, `designation`.
- `ADMIN` is absent from the public role union and is rejected as
  `400 VALIDATION_ERROR`.

Names and profile strings are trimmed. The HTTP registration and login validators
centrally trim and lowercase email inputs; services receive and operate on normalized
emails without repeating normalization. Passwords are not trimmed or logged.
Password validation requires at least eight characters and at most 72 UTF-8 bytes, measured with
`Buffer.byteLength(password, "utf8")` to enforce bcrypt's real input boundary.

The password is hashed with native bcrypt at cost 12 before opening the transaction.
The service then runs a minimal interactive Prisma transaction containing only the
`User` write and the matching `StudentProfile` or `RecruiterProfile` write. A profile
failure rejects the transaction and rolls back the user. No JWT is created during
registration.

Success returns `201` with only `{ user, profile }`. Explicit Prisma selections
ensure `passwordHash` is never returned. A unique-email race (`P2002`) returns
`409 EMAIL_ALREADY_EXISTS`.

## Login and access token

`POST /api/auth/login` accepts normalized email and the exact supplied password. The
service selects the stored password hash only for verification and uses
`bcrypt.compare`. A missing user and a wrong password both return the same
`401 INVALID_CREDENTIALS` code and message.

The service issues an HS256 access token with `jose` only after successful login.
Claims are limited to `sub` (the User UUID), `iat`, `exp`, and fixed issuer/audience
values. Role is not authoritative token state and is omitted. Success returns `200`:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "expiresIn": "15m",
    "user": {
      "id": "<uuid>",
      "name": "Example User",
      "email": "user@example.com",
      "role": "STUDENT",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  }
}
```

## Authentication and authorization

`authenticate` requires exactly `Authorization: Bearer <token>`, verifies HS256,
issuer, audience, and expiry, and validates `sub` as a UUID. It then selects the
current User ID and role by primary key and stores `{ userId, role }` in typed
`res.locals.auth`.

The database lookup is deliberate: deleted users and role changes take effect on
the next request. The cost is one indexed User lookup for every authenticated
request. No cache or Redis is added.

A valid token whose user was deleted returns `401 USER_NOT_FOUND`. This is an
explicit API choice distinct from malformed or expired credentials, while login
continues to hide whether an email exists. Missing or malformed Bearer credentials
return `401 AUTHENTICATION_REQUIRED`; invalid or expired tokens return
`401 INVALID_TOKEN`.

`requireRole(...roles)` is separate middleware. It reads only the database-loaded
role in `res.locals.auth`, supports one or multiple `UserRole` values, returns
`401 AUTHENTICATION_REQUIRED` if authentication context is absent, and returns
`403 FORBIDDEN` when the current role is not allowed.

## Current user

`GET /api/auth/me` requires authentication and returns explicit safe User fields plus
the profile matching the current database role. Its stable response data shape is
always `{ user, profile }`: ADMIN returns `profile: null`; STUDENT requires a
StudentProfile; RECRUITER requires a RecruiterProfile. A missing expected profile is
a database-integrity violation and becomes a non-public internal server error rather
than a successful response containing `null`.

## Environment configuration

The implemented configuration requires:

- `JWT_SECRET` is required and must provide at least 32 UTF-8 bytes, measured with
  `Buffer.byteLength(secret, "utf8")` rather than JavaScript string length.
- `JWT_EXPIRES_IN` is required and must match `^[1-9][0-9]*(m|h|d)$`, allowing
  controlled values such as `15m`, `1h`, and `1d`.

No refresh-token, cookie, or session configuration is introduced.

## Stable errors

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Request shape, role, password, or field validation failed. |
| 401 | `INVALID_CREDENTIALS` | Login email/password combination is invalid. |
| 401 | `AUTHENTICATION_REQUIRED` | Bearer credentials are missing or malformed. |
| 401 | `INVALID_TOKEN` | Token signature, claims, or expiry are invalid. |
| 401 | `USER_NOT_FOUND` | A valid token references a deleted user. |
| 403 | `FORBIDDEN` | The current database role is not permitted. |
| 409 | `EMAIL_ALREADY_EXISTS` | Registration email violates the unique constraint. |

Unexpected database and cryptographic errors continue through the centralized error
handler. Passwords, password hashes, tokens, and internal exceptions are not logged
or returned by auth code.

## Test strategy

- Registration HTTP/validator tests: student and recruiter success, duplicate email,
  public ADMIN rejection, invalid role-specific payloads, password UTF-8 byte limit,
  safe response, and no token in the response.
- Registration service tests: real bcrypt hashing plus mocked persistence tests that
  prove User/profile writes use the transaction client and that profile failure is
  propagated. These mocked tests do not claim physical database rollback.
- Real PostgreSQL integration tests, when a disposable database is safely available,
  prove physical rollback by forcing a failure after the User write and confirming
  that no User remains. Lack of a live integration database is reported as an
  unverified surface rather than covered by mocks.
- Login tests: success response contract, real bcrypt comparison, wrong password,
  nonexistent email, invalid payload, and absence of `passwordHash`.
- Token/authentication tests: real token signing and verification, valid token,
  missing/malformed Bearer header, invalid token, expired token, invalid/missing
  `sub`, deleted user, and confirmation that context role comes from PostgreSQL.
- RBAC tests: permitted single/multiple roles and forbidden role.
- `/auth/me` tests: authenticated student, recruiter, admin with `profile: null`,
  unauthenticated request, and internal-error behavior for a missing required
  student/recruiter profile.

Prisma is mocked only at the persistence boundary in deterministic unit/HTTP tests;
bcrypt and JWT behavior remain real. Physical PostgreSQL rollback has not been
claimed by these mocked tests.

## Assumptions

- Registration does not sign the user in; clients call login separately.
- User email normalization is enforced by HTTP validators before auth services are
  called. Existing non-normalized rows, if any, require separate data cleanup.
- Access-token revocation beyond user deletion or role lookup is out of scope.
- Admin accounts are seeded or provisioned through a future privileged mechanism.
