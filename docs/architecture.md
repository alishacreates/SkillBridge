# Backend Architecture

SkillBridge is an Express 5 and strict-TypeScript modular monolith. Its implemented
HTTP surface currently consists of infrastructure health checks plus registration,
login, Bearer authentication, role authorization middleware, and current-user
retrieval.

## Request flow

`Route -> Validation Middleware -> Controller -> Service -> Prisma -> PostgreSQL`

- **Routes** declare paths and compose validation/authentication/authorization with
  controllers. They contain no business or persistence logic.
- **Validation middleware** parses body, params, and query data with Zod. Parsed
  values are passed directly to the controller without mutating Express request
  properties.
- **Authentication middleware** verifies Bearer tokens, reloads the current User by
  primary key, and writes `{ userId, role }` to typed `res.locals.auth`.
- **Role middleware** authorizes against only that database-loaded role.
- **Controllers** translate validated HTTP input or authenticated context into
  response envelopes.
- **Services** own registration, login, current-user, and database-health operations.
  Password and JWT utilities have no HTTP or persistence responsibilities.
- **Prisma** is initialized once during server startup and shared through
  `src/lib/prisma.ts`.
- **PostgreSQL** stores the relational SkillBridge data described in
  `prisma/schema.prisma`.

Express 5 forwards rejected async handlers to centralized error middleware, so
controllers do not need repetitive `try/catch` wrappers.

Registration performs bcrypt hashing before a minimal Prisma transaction containing
only the User/profile writes. Login alone issues an HS256 access token. Tokens carry
the User ID in `sub` and no role; each protected request verifies the token and then
performs one indexed User lookup, so deletion and role changes apply immediately.

## Current source structure

```text
src/
├── config/          # Typed environment parsing
├── controllers/     # HTTP translation for health and authentication
├── middleware/      # Validation, auth/RBAC, 404, and centralized errors
├── routes/          # Root, health, and auth routers
├── services/        # Auth and database-health operations
├── validators/      # Health and auth Zod schemas
├── utils/           # Errors, responses, bcrypt, and JWT helpers
├── types/           # Request-scoped authenticated-user types
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

Non-operational errors such as a missing required role profile are logged outside
tests and exposed only as the generic `500 INTERNAL_SERVER_ERROR` envelope.
