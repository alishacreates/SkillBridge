# Express Infrastructure Design

## Scope

Build the reusable Task 3 Express infrastructure only. Do not add authentication,
authorization, or Student, Recruiter, Opportunity, Application, Assessment, or
admin feature routes. Do not change the Prisma schema.

## Request flow and module boundaries

Requests flow through:

`Route -> Validation Middleware -> Controller -> Service -> Prisma -> PostgreSQL`

- `routes/` declares paths and composes middleware with controllers.
- `middleware/` handles cross-cutting request validation, 404s, and errors.
- `controllers/` translates HTTP input/output without database access.
- `services/` owns application operations and is the only health-layer code that
  calls the shared Prisma client.
- `validators/` exports Zod schemas without HTTP or persistence logic.
- `lib/prisma.ts` exports the single Prisma client instance.
- `config/` validates environment variables and exports typed configuration.
- `utils/` contains response helpers and the application error type.
- `types/` contains shared application types only when a type has multiple consumers.
- `app.ts` configures Express; `server.ts` owns startup and graceful shutdown.

Functional modules are preferred over class-based controllers, services, and a
dependency-injection container because the current dependency graph is small and
explicit. Module mocking will isolate Prisma in database-health tests.

## Error handling

Express 5 forwards rejected async handlers to one centralized error middleware.
`AppError` carries HTTP status, public message, stable machine code, optional
details, and operational status. The middleware maps request-validation failures,
malformed JSON, known Prisma request errors, explicit not-found errors, and
unexpected failures to the standard error envelope. Production responses never
include stack traces or unexpected internal messages.

## Environment configuration

One Zod schema parses environment variables during module startup. `NODE_ENV`,
`PORT`, and `DATABASE_URL` are required and typed. The same single `DATABASE_URL`
is consumed by both application Prisma setup and the existing `prisma.config.ts`;
no second database configuration is introduced. `JWT_SECRET`, `JWT_EXPIRES_IN`,
and `FRONTEND_URL` are reserved future settings. `FRONTEND_URL` is optional in
development but required in production. Application modules consume the exported
configuration object rather than reading `process.env` directly.

## Health endpoints

- `GET /api/health` returns status and service name. It accepts optional query
  parameter `details`, whose only valid string values are `"true"` and `"false"`.
  When `details=true`, the response additionally includes safe environment and
  uptime values. No query parameter and `details=false` return the basic response.
- `GET /api/health/db` performs a lightweight query through a health service using
  the shared Prisma client. It returns 200 when reachable and a structured 503
  `DATABASE_UNAVAILABLE` error when the query fails.
- Unknown routes return 404 with code `ROUTE_NOT_FOUND`.

All success and failure payloads use the documented response envelopes.

## Validation

A reusable middleware validates any selected combination of request body, params,
and query using Zod. It stores the parsed result in a typed request-local validation
container instead of mutating Express `body`, `params`, or `query`; controllers
consume that validated result through a typed accessor. Validation failures return
HTTP 400 with code `VALIDATION_ERROR` and structured field details. The health query
is the only Task 3 example schema; no demonstration-only endpoint is added.

## Test strategy

Vitest and Supertest exercise the public Express boundary. Tests cover basic
health, both accepted `details` values, invalid `details`, unknown routes,
malformed JSON, database-health success, and database-health failure. Prisma is
mocked only for database-health determinism. Final verification runs the full test
suite, Prisma validation, TypeScript typecheck, and production build.

## Assumptions

- CORS allows the configured `FRONTEND_URL` when present. Development without it
  remains permissive for local tools. Production configuration fails validation
  when `FRONTEND_URL` is absent, so production never silently allows arbitrary
  origins.
- JSON request bodies are limited to 1 MiB.
- SIGINT and SIGTERM stop accepting connections, close the HTTP server, disconnect
  Prisma, and use a bounded forced-exit fallback.
- A real database-health success is conditional on a reachable configured database;
  deterministic automated coverage uses the mocked Prisma boundary.
