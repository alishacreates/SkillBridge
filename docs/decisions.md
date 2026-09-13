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
