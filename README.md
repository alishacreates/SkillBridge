# SkillBridge

SkillBridge is organized as a repository with separate backend, frontend, and
documentation areas.

```text
SkillBridge/
├── backend/    # Express, TypeScript, Prisma, and PostgreSQL backend
├── frontend/   # Next.js App Router: Phase 1 design foundation
└── docs/       # Architecture, API, setup, and project-learning documentation
```

The backend application lives in `backend/`. Its HTTP
surface contains infrastructure health checks plus registration, login, Bearer
authentication, reusable role authorization, and current-user retrieval. The
frontend currently renders a standalone coming-soon page with design tokens and
fonts; it has no API integration, authentication UI, or business features yet.

## Backend quick start

Run backend commands from `backend/`:

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

## Frontend quick start

Run frontend commands from `frontend/` (a separate terminal from the backend):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3001`. No frontend environment variables are needed for
Phase 1. See [the design foundation](docs/design-system.md) for verification commands.

## Project documentation

- [Setup and commands](docs/setup.md)
- [Project architecture](docs/architecture.md)
- [Frontend design foundation](docs/design-system.md)
- [API endpoints](docs/api.md)
- [Database model](docs/database.md)
- [Architecture decisions](docs/decisions.md)
- [Task 3 design specification](docs/specs/2026-09-13-express-infrastructure-design.md)
- [Task 4 auth design specification](docs/specs/2026-09-14-authentication-authorization-design.md)
- [Task 4 implementation plan](docs/plans/2026-09-14-authentication-authorization.md)
