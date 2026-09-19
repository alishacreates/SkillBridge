# Authentication and Authorization Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement public student/recruiter registration, login-issued JWT access tokens, database-resolved authentication, reusable role authorization, and current-user retrieval without changing the Prisma schema.

**Architecture:** Auth extends the existing functional Route -> Validation Middleware -> Controller -> Service -> shared Prisma -> PostgreSQL flow. Zod supplies normalized typed inputs; bcrypt and `jose` are isolated utilities; authenticated identity is passed through typed `res.locals`, and RBAC uses the current database role.

**Tech Stack:** Express 5, TypeScript, Zod 4, Prisma 7.10, PostgreSQL, native bcrypt, `jose`, Vitest, and Supertest.

## Global Constraints

- Preserve `prisma/schema.prisma` unchanged.
- Public registration accepts only STUDENT and RECRUITER and never issues a token.
- Login is the only token-issuing endpoint.
- Passwords remain exact inputs, are never logged/returned, and are limited to 72 UTF-8 bytes.
- JWT contains `sub`, `iat`, `exp`, issuer, and audience; role is loaded from PostgreSQL on every authenticated request.
- Authentication and `requireRole(...roles)` remain separate middleware.
- Add no refresh tokens, sessions, Redis, Passport, OAuth, social login, email verification, password reset, MFA, business routes, frontend auth, or unrelated features.
- No commits are included because the user did not request repository commits.

---

### Task 1: Auth configuration and cryptographic utilities

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `src/config/env.ts`
- Modify: `src/config/env.test.ts`
- Create: `src/utils/password.ts`
- Create: `src/utils/password.test.ts`
- Create: `src/utils/token.ts`
- Create: `src/utils/token.test.ts`

**Interfaces:**
- Produces: required `AppConfig.jwtSecret: string` and `jwtExpiresIn: JwtDuration`.
- Produces: `hashPassword(password): Promise<string>` and `verifyPassword(password, hash): Promise<boolean>` using bcrypt cost 12.
- Produces: `createAccessToken(userId, config): Promise<string>` and `verifyAccessToken(token, config): Promise<{ userId: string }>` using HS256, fixed issuer/audience, and UUID `sub`.

- [x] Install native `bcrypt`, `jose`, and required type declarations.
- [x] Add failing configuration tests for a JWT secret below 32 UTF-8 bytes, a multibyte secret meeting 32 bytes, missing auth settings, invalid durations, and accepted `15m`, `1h`, and `1d` durations.
- [x] Add failing password/token tests for hash/compare, invalid password, minimal claims, invalid signature, expiry, and missing/invalid UUID `sub`.
- [x] Run the focused tests and confirm failures arise from missing stricter config and utilities.
- [x] Implement byte-length secret validation, `^[1-9][0-9]*(m|h|d)$` duration validation, bcrypt wrappers, and `jose` wrappers that translate token validation failures to `401 INVALID_TOKEN`.
- [x] Update `.env.example` with non-secret instructional JWT placeholders that satisfy startup shape only after replacement.
- [x] Rerun focused tests; expect all Task 1 cases to pass.

### Task 2: Registration validation, transaction service, and endpoint

**Files:**
- Create: `src/validators/auth.validator.ts`
- Create: `src/validators/auth.validator.test.ts`
- Create: `src/services/auth.service.ts`
- Create: `src/services/auth.service.test.ts`
- Create: `src/controllers/auth.controller.ts`
- Create: `src/routes/auth.routes.ts`
- Modify: `src/routes/index.ts`
- Create: `src/auth.test.ts`

**Interfaces:**
- Produces: discriminated `registerRequestSchema` and `loginRequestSchema`; both normalize email in the HTTP layer, while password remains unmodified.
- Produces: `registerUser(input): Promise<{ user: SafeUser; profile: StudentProfileResponse | RecruiterProfileResponse }>`.
- Produces: `POST /api/auth/register` returning 201 without token/password fields.

- [x] Add failing validator tests for student/recruiter inputs, ADMIN rejection, role-specific missing fields, normalized email, unchanged password, and 72-byte UTF-8 boundary.
- [x] Add failing service tests using real bcrypt and a mocked Prisma boundary. Assert hashing occurs before `$transaction`, both writes use the callback transaction client, profile failure propagates, and no root-client writes occur. Label these tests as transaction-client/failure-propagation evidence, not physical rollback evidence.
- [x] Add failing HTTP tests for successful student/recruiter responses, invalid input, ADMIN rejection, duplicate email `409 EMAIL_ALREADY_EXISTS`, and absence of token/password/passwordHash.
- [x] Run focused tests and confirm failures are missing auth modules/routes.
- [x] Implement explicit safe Prisma selections, pre-transaction hashing, database-write-only interactive transaction logic, role-specific profile writes, and P2002 translation.
- [x] Wire `/api/auth/register` through validation and controller layers.
- [x] Rerun Task 2 and existing infrastructure tests; expect all to pass.

### Task 3: Login and access-token response

**Files:**
- Modify: `src/services/auth.service.ts`
- Modify: `src/services/auth.service.test.ts`
- Modify: `src/controllers/auth.controller.ts`
- Modify: `src/routes/auth.routes.ts`
- Modify: `src/auth.test.ts`

**Interfaces:**
- Produces: `login(input, config): Promise<{ accessToken; tokenType: "Bearer"; expiresIn; user: SafeUser }>`.
- Produces: `POST /api/auth/login` returning 200 on valid credentials and identical `401 INVALID_CREDENTIALS` behavior for unknown email/wrong password.

- [x] Add failing service/HTTP tests for success, real `bcrypt.compare`, normalized validator output, wrong password, nonexistent email, invalid request, exact response fields, and no password hash.
- [x] Run focused login tests; expect 404 or missing-service failures.
- [x] Implement explicit login selection, credential verification, post-verification token issuance, and stable non-enumerating login errors.
- [x] Wire the validated login controller and route.
- [x] Rerun login, registration, and infrastructure tests; expect all to pass.

### Task 4: Database-resolved authentication and RBAC

**Files:**
- Create: `src/types/auth.ts`
- Create: `src/middleware/authenticate.ts`
- Create: `src/middleware/authenticate.test.ts`
- Create: `src/middleware/require-role.ts`
- Create: `src/middleware/require-role.test.ts`

**Interfaces:**
- Produces: `AuthLocals` containing `auth: { userId: string; role: UserRole }`.
- Produces: `createAuthenticate(config): RequestHandler` using Bearer parsing, token verification, and current User lookup.
- Produces: `requireRole(...roles): RequestHandler` using only `res.locals.auth.role`.

- [x] Add failing authentication tests for valid JWT, missing/malformed header, invalid/expired token, missing/invalid `sub`, deleted user `401 USER_NOT_FOUND`, current database role context, and unexpected database error propagation.
- [x] Add failing RBAC tests for allowed single/multiple roles, forbidden current role, and absent auth context.
- [x] Run focused middleware tests; expect missing-module failures.
- [x] Implement typed `res.locals` context without request mutation or global Express augmentation. Map missing/malformed credentials to `AUTHENTICATION_REQUIRED`, token failures to `INVALID_TOKEN`, and a deleted subject to the approved `USER_NOT_FOUND` response.
- [x] Implement role middleware that never reads role from JWT claims.
- [x] Rerun middleware and full tests; expect all to pass.

### Task 5: Current-user endpoint and profile integrity

**Files:**
- Modify: `src/services/auth.service.ts`
- Modify: `src/services/auth.service.test.ts`
- Modify: `src/controllers/auth.controller.ts`
- Modify: `src/routes/auth.routes.ts`
- Modify: `src/utils/app-error.ts`
- Modify: `src/middleware/error-handler.ts`
- Modify: `src/auth.test.ts`

**Interfaces:**
- Produces: `getCurrentUser(userId, role): Promise<{ user: SafeUser; profile: StudentProfileResponse | RecruiterProfileResponse | null }>`.
- Produces: authenticated `GET /api/auth/me` with stable `{ user, profile }` data.

- [x] Add failing tests for student/recruiter profile responses, ADMIN `profile: null`, unauthenticated access, deleted-user race, and missing required profile.
- [x] Add a failing error-handler test proving non-operational/data-integrity errors are logged server-side but exposed only as `500 INTERNAL_SERVER_ERROR` without internal details.
- [x] Run focused tests; expect route/service failures.
- [x] Implement role-specific explicit selections. STUDENT/RECRUITER missing their required profile throws a non-operational data-integrity error; ADMIN returns null.
- [x] Update centralized error handling so non-operational `AppError` instances are logged outside tests and return only the generic internal envelope.
- [x] Compose `authenticate` before `/me` and rerun all auth/infrastructure tests.

### Task 6: Documentation and final verification

**Files:**
- Modify: `docs/architecture.md`
- Modify: `docs/api.md`
- Modify: `docs/decisions.md`
- Modify: `docs/setup.md`
- Keep: `docs/database.md`

**Interfaces:**
- Produces: living documentation describing the implemented auth surface and its tested limits.

- [x] Update architecture with auth flow, typed auth context, middleware separation, and database lookup tradeoff.
- [x] Document register/login/me payloads, status codes, authentication header, and stable errors in API docs.
- [x] Change approved Task 4 decisions from planned to implemented only after source/tests exist; document JWT/bcrypt setup requirements.
- [x] State explicitly that mocked transaction tests prove transaction-client use and failure propagation, while physical rollback requires a real PostgreSQL integration test. Do not claim physical rollback unless such a test actually runs.
- [x] Scan source/docs for password or token logging, response leakage, unimplemented claims, direct role trust from JWT, unsafe request mutation, and schema changes.
- [x] Run `npm test`, Prisma format check and validation, Prisma Client generation, `npm run typecheck`, and `npm run build`; expect exit 0 and report test counts.

## Unresolved product decisions

None. Physical rollback verification remains conditional on a safely available real PostgreSQL test database and must be reported separately from mocked transaction coverage.
