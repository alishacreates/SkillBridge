# Backend Setup

## Requirements

- Node.js 20.19 or newer
- PostgreSQL

Copy `.env.example` to `.env` and configure:

| Variable | Requirement |
| --- | --- |
| `NODE_ENV` | Required: `development`, `test`, or `production`. |
| `PORT` | Required integer from 1 through 65535. |
| `DATABASE_URL` | Required PostgreSQL URL used by both Prisma CLI and the application. |
| `FRONTEND_URL` | Optional URL in development/test; required in production for CORS. |
| `JWT_SECRET` | Required signing secret containing at least 32 UTF-8 bytes. |
| `JWT_EXPIRES_IN` | Required positive duration matching `15m`, `1h`, or `1d` style (`m`, `h`, or `d`). |

No second database URL or connection configuration is used.

## Commands

```bash
npm install                         # Install dependencies
npm run dev                         # Start the TypeScript watch server
npm test                            # Run the Vitest suite once
npm run test:watch                  # Run Vitest in watch mode
npm run typecheck                   # Strict TypeScript check without output
npm run build                       # Compile to dist/
npm start                           # Run the compiled server
npm run prisma:generate             # Generate Prisma Client
npm run prisma:format               # Format the Prisma schema
npm run prisma:validate             # Validate Prisma configuration/schema
npm run prisma:migrate -- --name X  # Create/apply a development migration
npm run prisma:deploy               # Apply committed migrations in deployment
npm run prisma:seed                 # Run prisma/seed.ts explicitly
```

Run Prisma generation after installing dependencies or changing the schema. A
reachable `DATABASE_URL` is required for migrations, seeding, and the live database
health endpoint.

`JWT_SECRET` should be replaced with a securely generated deployment secret. Access
tokens use the configured duration; refresh tokens and sessions are not implemented.
