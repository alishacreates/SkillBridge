# Express Infrastructure Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable Express 5 and TypeScript infrastructure for SkillBridge without adding business routes or changing the Prisma schema.

**Architecture:** Functional modules implement Route -> Validation Middleware -> Controller -> Service -> shared Prisma client -> PostgreSQL. A typed configuration object is created once at startup and passed to the app; reusable HTTP middleware owns validation, 404, and error translation.

**Tech Stack:** Node.js, Express 5, TypeScript, Prisma 7.10, PostgreSQL, Zod, Helmet, CORS, Vitest, and Supertest.

## Global Constraints

- Preserve `prisma/schema.prisma` unchanged.
- Add only `GET /api/health` and `GET /api/health/db`.
- Do not implement authentication, authorization, or business feature modules.
- Keep one application Prisma client and the existing `DATABASE_URL`.
- Read `process.env` only in `src/config/env.ts`.
- Production requires `FRONTEND_URL`; development may allow all origins when it is absent.
- Do not mutate Express `body`, `params`, or `query` with parsed values.

---

### Task 1: Typed configuration contract

**Files:**
- Create: `src/config/env.ts`
- Create: `src/config/env.test.ts`
- Modify: `.env.example`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `loadConfig(source?: NodeJS.ProcessEnv): AppConfig`
- Produces: `AppConfig` with `nodeEnv`, `port`, `databaseUrl`, and optional future/CORS settings.

- [ ] Add Zod, Helmet, CORS, Vitest, and Supertest dependencies and test scripts.
- [ ] Add focused tests proving valid development parsing, numeric port parsing, rejection of missing required values, rejection of production without `FRONTEND_URL`, and acceptance of production with a valid frontend URL.
- [ ] Run `npm test -- src/config/env.test.ts`; expect failure because `loadConfig` does not exist.
- [ ] Implement one Zod environment schema. Empty optional values normalize to `undefined`; production adds a cross-field `FRONTEND_URL` issue.
- [ ] Update `.env.example` with all six configuration keys while retaining the existing single `DATABASE_URL`.
- [ ] Rerun the focused test; expect all configuration cases to pass.

### Task 2: HTTP foundation, health validation, and centralized errors

**Files:**
- Create: `src/app.ts`
- Create: `src/routes/index.ts`
- Create: `src/routes/health.routes.ts`
- Create: `src/controllers/health.controller.ts`
- Create: `src/validators/health.validator.ts`
- Create: `src/middleware/validate-request.ts`
- Create: `src/middleware/not-found.ts`
- Create: `src/middleware/error-handler.ts`
- Create: `src/utils/app-error.ts`
- Create: `src/utils/api-response.ts`
- Create: `src/app.test.ts`
- Delete: `src/index.ts`

**Interfaces:**
- Produces: `createApp(config: AppConfig): Express`.
- Produces: `validateRequest(schema, handler): RequestHandler`, where the handler receives Zod output as a fourth argument without request mutation or application-layer casts.
- Produces: `getHealth(request, response, next, validated)` controller.
- Produces: success envelopes `{ success: true, message?, data }` and error envelopes `{ success: false, error: { code, message, details? } }`.

- [ ] Add Supertest cases for basic health, `details=true`, `details=false`, invalid details, malformed JSON, CORS behavior, and an unknown route.
- [ ] Run `npm test -- src/app.test.ts`; expect module-not-found failure for `src/app.ts`.
- [ ] Implement Helmet, 1 MiB JSON parsing, environment-aware CORS, `/api` routing, validation adapter, controller, 404 middleware, `AppError`, and centralized error middleware.
- [ ] Map Zod errors to 400 `VALIDATION_ERROR`, malformed JSON to 400 `MALFORMED_JSON`, route misses to 404 `ROUTE_NOT_FOUND`, known Prisma P2025 to 404, P2002 to 409, other known Prisma errors to 500, and unexpected errors to a non-leaking 500 response.
- [ ] Rerun the focused test; expect all HTTP foundation cases to pass.

### Task 3: Shared Prisma access, database health, and server lifecycle

**Files:**
- Modify: `src/lib/prisma.ts`
- Create: `src/services/health.service.ts`
- Modify: `src/controllers/health.controller.ts`
- Modify: `src/routes/health.routes.ts`
- Extend: `src/app.test.ts`
- Create: `src/server.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `initializePrisma(databaseUrl: string): PrismaClient`, `getPrisma(): PrismaClient`, and `disconnectPrisma(): Promise<void>` around one cached instance.
- Produces: `checkDatabaseHealth(): Promise<void>` using a lightweight `SELECT 1` query.
- Produces: `getDatabaseHealth` controller and `startServer(): Promise<void>` bootstrap.

- [ ] Add database-health tests with the Prisma accessor mocked: successful query returns 200; rejected query returns 503 `DATABASE_UNAVAILABLE` without internal details.
- [ ] Run the focused database-health tests; expect 404 because the endpoint is absent.
- [ ] Refactor the existing Prisma integration into an initialized singleton, implement the health service/controller/route, and convert any database-health failure into operational 503.
- [ ] Implement `server.ts`: load configuration inside a caught bootstrap, initialize Prisma once, listen on the configured port, handle server startup errors, and perform idempotent SIGINT/SIGTERM shutdown with HTTP close, Prisma disconnect, and a 10-second forced-exit fallback.
- [ ] Update `dev`, `start`, and build output paths to use `server.ts`.
- [ ] Rerun the focused and full tests; expect all cases to pass.

### Task 4: Living documentation and final verification

**Files:**
- Create: `docs/architecture.md`
- Create: `docs/database.md`
- Create: `docs/api.md`
- Create: `docs/decisions.md`
- Create: `docs/setup.md`
- Modify: `README.md`

**Interfaces:**
- Produces: implementation-specific architecture, API, database, decision, and setup references matching the repository.

- [ ] Document only the implemented architecture, health endpoints, current Prisma model relationships/constraints/indexes, established technology decisions, environment contract, and exact package scripts.
- [ ] Point the README to the maintained documents and remove duplicated setup instructions where appropriate.
- [ ] Scan documentation for unimplemented feature claims and correct any mismatch against source.
- [ ] Run `npm test`, Prisma format check and validation, `npm run prisma:generate`, `npm run typecheck`, and `npm run build`; expect every command to exit 0.
- [ ] Perform an HTTP smoke test through Supertest coverage and, when a real configured PostgreSQL instance is reachable, record the live `/api/health/db` result; otherwise report the live database check as unavailable while retaining deterministic mocked coverage.

## Unresolved product decisions

None. Live database-health verification depends only on whether the configured PostgreSQL instance is reachable in the implementation environment.

No commits are included because the user did not request repository commits.
