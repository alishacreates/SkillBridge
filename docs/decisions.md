# Architecture Decisions

This file records decisions that are active in the current implementation.

## Express and TypeScript backend

- **Decision:** Use Express 5 with strict TypeScript.
- **Reason:** Express provides a small HTTP layer, while TypeScript checks contracts
  across configuration, validation, controllers, services, and Prisma.
- **Tradeoff:** The project defines its own module boundaries and response/error
  conventions instead of receiving an opinionated framework structure.

## Modular monolith

- **Decision:** Keep one deployable backend organized into functional modules.
- **Reason:** Current features share one relational model and do not require
  independent deployment or operational boundaries.
- **Alternative:** Microservices.
- **Tradeoff:** Modules require discipline to preserve boundaries, but avoid network,
  deployment, and consistency overhead that the current scope does not justify.

## PostgreSQL and Prisma

- **Decision:** Store relational data in PostgreSQL and access it through Prisma
  7.10.0.
- **Reason:** SkillBridge data has explicit relationships, uniqueness rules, and
  transactional joins; Prisma provides a typed client and migration workflow.
- **Alternative:** A document database or handwritten SQL data layer.
- **Tradeoff:** Prisma adds generation and migration tooling, while PostgreSQL schema
  changes require deliberate migrations.

## Functional layered modules

- **Decision:** Use functions and explicit module imports for routes, middleware,
  controllers, services, and persistence access.
- **Reason:** The current dependency graph is small, visible, and testable without a
  class hierarchy or dependency-injection container.
- **Alternatives:** Class-based controllers/services with dependency injection, or a
  single application file.
- **Tradeoff:** Module mocking is used at the Prisma boundary in health tests. If the
  dependency graph becomes complex, explicit factories can be added without changing
  the HTTP contracts.

## Centralized configuration and errors

- **Decision:** Parse environment variables once with Zod and translate errors in one
  final Express middleware.
- **Reason:** Application modules receive typed configuration and return one stable
  response format without exposing internal failures.
- **Tradeoff:** Startup fails immediately when configuration is invalid, including a
  missing production `FRONTEND_URL`.

## Task 4 authentication decisions

The following decisions are active in the implemented authentication surface.

### Separate registration and login

- **Decision:** Registration returns safe user/profile data but no token. Access
  tokens are issued only after successful login.
- **Reason:** Account creation and credential authentication remain explicit,
  independently testable operations.
- **Tradeoff:** A newly registered client makes a second request to sign in.

### JWT access tokens only

- **Decision:** Use short-lived HS256 access tokens through `jose`, with the User ID
  in `sub` and no authoritative role claim.
- **Reason:** This satisfies the current Bearer-token requirement with minimal token
  state and fits the ESM backend.
- **Alternatives:** Server sessions, refresh tokens, Passport, OAuth, and social
  login.
- **Tradeoff:** Users must log in again when the access token expires. Refresh and
  revocation infrastructure are deferred until requirements justify them.

### Reload authenticated users from PostgreSQL

- **Decision:** After JWT verification, authentication performs one indexed User
  lookup and supplies the current ID and role through typed `res.locals`.
- **Reason:** Deleted users and role changes take effect immediately; RBAC never
  trusts a stale token role.
- **Alternative:** Trust identity and role claims until token expiration.
- **Tradeoff:** Every authenticated request incurs one database lookup. Caching and
  Redis are intentionally deferred.

### bcrypt password hashing

- **Decision:** Hash passwords with native bcrypt at cost 12 before database writes;
  enforce bcrypt's 72-byte limit using UTF-8 byte length. Verify supplied passwords
  with `bcrypt.compare`.
- **Reason:** Plaintext passwords never enter persistence, and byte-length validation
  avoids bcrypt's silent input truncation boundary.
- **Tradeoff:** Native bcrypt introduces a platform-specific dependency and hashing
  intentionally consumes CPU.

### Public ADMIN registration prohibited

- **Decision:** The public registration validator accepts only STUDENT and RECRUITER.
- **Reason:** Administrative authority must not be self-assigned through a public
  endpoint.
- **Alternative:** Accept ADMIN and rely on later authorization checks.
- **Tradeoff:** Admin provisioning requires a seed or future privileged mechanism.

### User and profile registration transaction

- **Decision:** Create the User and its role-specific profile in the same Prisma
  transaction. Hashing occurs before the transaction; JWT issuance is not part of
  registration.
- **Reason:** Registration never leaves a profile-less partial account when a profile
  write fails, while expensive non-database work does not extend the transaction.
- **Tradeoff:** Registration service logic must preserve discriminated role/profile
  inputs and translate unique-email races.

### Authentication and authorization remain separate

- **Decision:** Authentication establishes current identity; `requireRole(...roles)`
  independently decides whether that identity may perform an operation.
- **Reason:** Protected routes can reuse authentication without duplicating or
  coupling role policy.
- **Tradeoff:** Route composition must maintain authentication before authorization.

### Deleted-token subject error

- **Decision:** A structurally valid token referencing a deleted user returns
  `401 USER_NOT_FOUND`; malformed or expired tokens return `401 INVALID_TOKEN`.
- **Reason:** This makes the database-resolution failure explicit for API clients.
- **Tradeoff:** Protected endpoints reveal that the token once referenced a user,
  while login continues to use the non-enumerating `INVALID_CREDENTIALS` response.

### Role-specific profile integrity

- **Decision:** `/api/auth/me` returns `profile: null` only for ADMIN. STUDENT and
  RECRUITER users missing their expected profile produce a non-public internal error.
- **Reason:** Registration guarantees the role-specific profile transactionally, so
  absence indicates corrupted or externally modified data rather than a valid user
  state.
- **Tradeoff:** A data-integrity problem makes the endpoint unavailable for that user
  instead of returning a partial account representation.

### Mocked transactions versus database rollback

- **Decision:** Deterministic service tests mock Prisma only at the persistence
  boundary and verify callback transaction-client usage plus failure propagation.
- **Reason:** These tests precisely cover service orchestration without requiring a
  shared external database.
- **Tradeoff:** They do not prove physical PostgreSQL rollback. That property requires
  a separate disposable-database integration test, which is not currently present.

## Frontend Phase 1 decisions

### Standalone Next.js App Router package

- **Decision:** Next.js 16 and React 19 in `frontend/`, with strict TypeScript and
  Server Components for the initial layout and placeholder. Use port 3001 locally.
- **Reason:** Establish routing, font loading, metadata, and a build boundary without
  coupling the UI to the Express runtime or its default port 3000.
- **Alternative:** A client-only SPA or a combined backend/frontend package.
- **Tradeoff:** Separate install/build commands; dynamic UI and API integration need
  deliberate future boundaries. Phase 1 implements no authentication UI.

### CSS Modules plus one runtime token stylesheet

- **Decision:** Use the CSS Modules/global CSS approach in the approved frontend
  plan. `frontend/styles/tokens.css` is the single runtime source; `frontend/DESIGN.md`
  records visual intent and `docs/design-system.md` explains usage.
- **Reason:** Native CSS custom properties support semantic aliases, responsive
  values, and motion preferences without a second theme system.
- **Alternatives:** Tailwind or a CSS-in-JS theme provider.
- **Tradeoff:** Components will author explicit CSS rules and must consume the shared
  tokens. Media-query breakpoints remain literals, as CSS variables cannot supply
  media-query thresholds.

### Font roles and accessible palette use

- **Decision:** Self-host Inter and Felipa through `next/font/google`. Inter covers
  all product UI; Felipa is limited to the placeholder's short decorative brand line.
  Preserve the five locked brand colors; define semantic/chart colors independently.
- **Reason:** Keep product text readable and predictable while retaining a small
  recognizable brand accent. Brand pink/yellow are not suitable default small-text
  colors on the pale canvas.
- **Alternative:** Browser-loaded Google Fonts stylesheets or decorative headings
  throughout the product.
- **Tradeoff:** A fresh production build needs access to Google font downloads;
  rendered pages serve fonts locally. Every future text/background pair still needs
  contrast verification.

### Phase boundary

- **Decision:** `/` is a coming-soon placeholder for Phase 1. The older full design
  spec describes later dashboard/showcase work, not currently shipped features.
- **Reason:** Review the font, token, layout, and accessibility foundation before
  implementing reusable controls or domain UI.
- **Tradeoff:** No `/design`, dashboard, chart, form, or API integration is available
  yet. The skill-pathway motif remains reserved for later progress/analytics work.
