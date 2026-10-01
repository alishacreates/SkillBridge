# Project Architecture

SkillBridge has an Express 5 and strict-TypeScript modular-monolith backend and a
separate Next.js frontend. The backend's implemented HTTP surface consists of
infrastructure health checks plus registration,
login, Bearer authentication, role authorization middleware, and current-user
retrieval. The backend is self-contained under `backend/`; `frontend/` contains the
Next.js design foundation, primitives, domain components, student dashboard, and public design reference; documentation remains in
`docs/`. The frontend does not call the backend yet.

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
  `backend/src/lib/prisma.ts`.
- **PostgreSQL** stores the relational SkillBridge data described in
  `backend/prisma/schema.prisma`.

Express 5 forwards rejected async handlers to centralized error middleware, so
controllers do not need repetitive `try/catch` wrappers.

Registration performs bcrypt hashing before a minimal Prisma transaction containing
only the User/profile writes. Login alone issues an HS256 access token. Tokens carry
the User ID in `sub` and no role; each protected request verifies the token and then
performs one indexed User lookup, so deletion and role changes apply immediately.

## Current source structure

```text
SkillBridge/
├── backend/
│   ├── src/
│   │   ├── config/          # Typed environment parsing
│   │   ├── controllers/     # HTTP translation for health and authentication
│   │   ├── middleware/      # Validation, auth/RBAC, 404, and centralized errors
│   │   ├── routes/          # Root, health, and auth routers
│   │   ├── services/        # Auth and database-health operations
│   │   ├── validators/      # Health and auth Zod schemas
│   │   ├── utils/           # Errors, responses, bcrypt, and JWT helpers
│   │   ├── types/           # Request-scoped authenticated-user types
│   │   ├── generated/       # Generated Prisma Client (gitignored)
│   │   ├── lib/             # Shared Prisma lifecycle
│   │   ├── app.ts           # Express middleware and route composition
│   │   └── server.ts        # Configuration, startup, and shutdown
│   ├── prisma/              # Schema, migrations, and seed entry point
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig*.json
├── frontend/
│   ├── app/                 # App Router shell, dashboard /, and public /design
│   ├── layout/              # Dashboard shell, responsive navigation, decorative icons
│   ├── styles/              # Canonical tokens and global base styles
│   ├── components/ui/       # Product-agnostic primitives and component tests
│   ├── components/skillbridge/ # Typed domain compositions and component tests
│   ├── components/dashboard/ # Page composition, local data, chart, sample previews
│   ├── components/design/   # Production-component reference, token specimens, local state lab
│   ├── test/fixtures/       # Isolated browser fixture; not a Next route
│   ├── e2e/                 # Production browser smoke checks
│   ├── DESIGN.md            # Visual intent and token ownership
│   ├── package.json         # Independent frontend commands/dependencies
│   └── playwright.config.ts # Browser verification server/configuration
└── docs/                    # Repository-level living documentation
```

Folders are added only when they contain a concrete module; no empty feature
directories are maintained.

## Runtime boundaries

`createApp(config)` is side-effect free and does not open a port or database
connection. `backend/src/server.ts` loads configuration, initializes Prisma, starts
HTTP, and handles SIGINT/SIGTERM. Shutdown stops accepting requests and disconnects
Prisma; a ten-second timeout prevents shutdown from hanging indefinitely.

Non-operational errors such as a missing required role profile are logged outside
tests and exposed only as the generic `500 INTERNAL_SERVER_ERROR` envelope.

## Frontend composition (Phases 1–5)

`frontend/app/layout.tsx` owns the HTML document, metadata, Inter/Felipa font
variables, global styles, and skip navigation. `frontend/app/page.tsx` is a Server
Component with dashboard metadata that renders `StudentDashboard`, a client
composition with local search/preview state. Next still prerenders the initial HTML.
No API calls or auth UI exist. `components/ui/` exposes native controls and display/feedback components;
it cannot import domain/page/backend code. `components/skillbridge/` composes that
layer into opportunity, skill, match, profile, candidate, and deadline displays.
These receive typed props and caller-owned actions; no API or matching logic exists
in the frontend. `components/dashboard/` now composes them into the `/` page.

Style flow: `styles/tokens.css` -> `styles/base.css` and layer-owned CSS Modules ->
rendered page. `app/globals.css` imports tokens/base once. Runtime CSS variables are
canonical; `frontend/DESIGN.md` explains intent and `docs/design-system.md` records
values, accessibility rules, and current scope. Fonts are self-hosted by Next after
build-time download. `layout/dashboard-shell.module.css` owns navigation/header
layout; `components/dashboard/dashboard.module.css` owns page grids and chart
geometry. Neither duplicates primitive recipes or changes the locked tokens.

`dashboard-data.ts` contains typed fictional snapshot data. `StudentDashboard`
composes metrics, `MatchOverview`, skill progress, recommendations, learning,
profile/gap summaries, applications, and deadlines. `RecommendationsSection` and
`LearningSection` own only local preview selection; `SamplePreview` restores focus
when closed. Search filters the three local opportunities on submit, without a
network request, persistence, or URL state. The lightweight SVG chart presents
supplied values and matching HTML summaries; it is not an analytics engine.

`DashboardShell` uses a 240px desktop sidebar at 64rem and a nonmodal in-flow
navigation disclosure below it. Escape closes the menu and restores focus. Main
content scrolls with the document; a 12-column grid uses multi-column sections at
80rem, reduced columns at tablet widths, and a single column on mobile. Gutters
remain 16/24/32px. Only Dashboard in product navigation links to a route; other destinations and
notifications are explicitly unavailable. No fake backend workflows are exposed.

`app/design/page.tsx` renders the public `DesignShowcase`. Static introduction,
`TokenSpecimens`, accessibility notes, and layering diagram are server-compatible;
`PrimitiveSpecimens`, `DomainSpecimens`, and `StateLab` are small Client Components
for local controls and feedback. They import the production `ui` and `skillbridge`
exports directly, never the test fixture. `catalog.ts` holds typed example data and
documentation labels; CSS variables remain the sole runtime theme. The reference
adds no persistence, API requests, or global state. Dashboard footer/reference
header link between the two routes; other product navigation remains unavailable.

Frontend commands run in `frontend/`; development/production servers default to
3001. Strict TypeScript and the Next/TypeScript ESLint presets are configured.
`npm run typecheck` generates App Router types before running `tsc --noEmit`.
Vitest/Testing Library checks component behavior. Playwright checks the compiled
dashboard and `/design`, plus an isolated Vite primitive/domain/dashboard-state fixture with axe and interaction tests.
The fixture is outside App Router and reuses production fonts through a local proxy.
API integration, authentication UI, and other product routes remain deferred.
