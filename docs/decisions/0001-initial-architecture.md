# ADR-0001 — Initial Technology and Architecture Selection

**Status:** Accepted for initial implementation  
**Project:** SkillBridge

## Context

SkillBridge requires a multi-role full-stack application with relational data, assessments, matching, applications, collaboration, and analytics.

The architecture must support incremental development while remaining understandable and maintainable.

## Decision

Adopt:

- Next.js + TypeScript for the frontend
- Tailwind CSS for styling
- Express + TypeScript for the backend
- PostgreSQL as the primary database
- Prisma as the ORM
- Zod for runtime validation
- A modular monolith architecture
- REST for application APIs

## Rationale

### Next.js

Provides a structured React application with routing and server-rendering capabilities.

### Express

Provides a lightweight HTTP foundation and direct control over routing, middleware, and API organization.

### TypeScript

Supports static checking and shared language familiarity across frontend and backend.

### PostgreSQL

Fits the strongly relational domain, including students, skills, organizations, opportunities, and applications.

### Prisma

Provides typed database access and migration tooling.

### Modular Monolith

Allows the application to remain operationally simple while preserving clear module boundaries.

### REST

Fits the resource-oriented application workflows without introducing unnecessary query-layer complexity.

## Alternatives Considered

- MongoDB: Flexible documents, but less natural for the central relational model.
- FastAPI: Suitable for Python-centric systems, but introduces another application language.
- NestJS: Strong conventions, but additional framework concepts are not currently necessary.
- Next.js-only backend: Simpler deployment, but a standalone API better supports the chosen learning and architecture goals.
- Microservices: Unnecessary operational complexity at the initial scale.
- GraphQL: No demonstrated requirement for flexible client-defined queries.

## Consequences

Benefits:

- Clear frontend/backend separation
- Relational integrity
- TypeScript across the application
- Independently testable domain services
- Straightforward initial deployment

Costs:

- Two application processes
- API contract coordination
- PostgreSQL and migration management
- Separate frontend/backend deployment configuration

## Review Conditions

Revisit this decision if requirements, team size, integration needs, performance measurements, or deployment constraints materially change.

The architecture is a deliberate starting point, not a claim that it is optimal for every future scale.