# Backend Architecture

SkillBridge is currently an Express 5 and TypeScript modular monolith. The only
implemented HTTP features are infrastructure health checks.

## Request flow

`Route -> Validation Middleware -> Controller -> Service -> Prisma -> PostgreSQL`

- **Routes** declare paths and compose validation with controllers. They contain no
  business or persistence logic.
- **Validation middleware** parses body, params, and query data with Zod. Parsed
  values are passed directly to the controller without mutating Express request
  properties.
- **Controllers** translate validated HTTP input into response envelopes.
- **Services** perform application operations. The database-health service is the
  current example and owns the Prisma call.
- **Prisma** is initialized once during server startup and shared through
  `src/lib/prisma.ts`.
- **PostgreSQL** stores the relational SkillBridge data described in
  `prisma/schema.prisma`.

Express 5 forwards rejected async handlers to centralized error middleware, so
controllers do not need repetitive `try/catch` wrappers.

## Current source structure

```text
src/
├── config/          # Typed environment parsing
├── controllers/     # HTTP translation for health endpoints
├── middleware/      # Validation, 404, and centralized errors
├── routes/          # Root API router and health routes
├── services/        # Database health operation
├── validators/      # Health request Zod schema
├── utils/           # AppError and response helpers
├── generated/       # Generated Prisma Client (gitignored)
├── lib/             # Shared Prisma lifecycle
├── app.ts           # Express middleware and route composition
└── server.ts        # Configuration, HTTP startup, and shutdown
```

Folders are added only when they contain a concrete module; no empty feature
directories are maintained.

## Runtime boundaries

`createApp(config)` is side-effect free and does not open a port or database
connection. `server.ts` loads configuration, initializes Prisma, starts HTTP, and
handles SIGINT/SIGTERM. Shutdown stops accepting requests and disconnects Prisma;
a ten-second timeout prevents shutdown from hanging indefinitely.
