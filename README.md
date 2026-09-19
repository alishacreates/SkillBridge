# SkillBridge

SkillBridge is organized as a repository with separate backend, frontend, and
documentation areas.

```text
SkillBridge/
├── backend/    # Express, TypeScript, Prisma, and PostgreSQL backend
├── frontend/   # Reserved for the upcoming Next.js frontend
└── docs/       # Architecture, API, setup, and project-learning documentation
```

The implemented application currently lives entirely in `backend/`. Its HTTP
surface contains infrastructure health checks plus registration, login, Bearer
authentication, reusable role authorization, and current-user retrieval. Frontend
and business feature routes are not implemented yet.

## Backend quick start

Run backend commands from `backend/`:

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

## Project documentation

- [Setup and commands](docs/setup.md)
- [Backend architecture](docs/architecture.md)
- [API endpoints](docs/api.md)
- [Database model](docs/database.md)
- [Architecture decisions](docs/decisions.md)
- [Task 3 design specification](docs/specs/2026-09-13-express-infrastructure-design.md)
- [Task 4 auth design specification](docs/specs/2026-09-14-authentication-authorization-design.md)
- [Task 4 implementation plan](docs/plans/2026-09-14-authentication-authorization.md)
