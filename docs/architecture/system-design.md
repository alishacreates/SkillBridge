# SkillBridge — System Architecture

**Status:** Proposed  
**Architecture Style:** Modular Monolith

## 1. Overview

SkillBridge is a multi-role academia–industry collaboration platform.

The initial implementation uses a separately deployed frontend and backend with one primary relational database.

## 2. High-Level Architecture

```text
                  USERS
                    |
          Browser / Web Client
                    |
                    v
          Next.js + TypeScript
                    |
               REST / HTTPS
                    |
                    v
           Express + TypeScript
                    |
       +------------+-------------+
       |            |             |
   Identity     Domain        Matching
   & Access     Services      Engine
       |            |             |
       +------------+-------------+
                    |
                Prisma ORM
                    |
                PostgreSQL
```

## 3. Frontend

**Technology:** Next.js, React, TypeScript, Tailwind CSS.

Responsibilities:

- Page rendering and navigation
- Accessible user interfaces
- Form handling and client-side feedback
- Calling backend APIs
- Presenting server-provided data
- Role-specific user experiences

The frontend is not the authority for authentication, authorization, or business rules.

## 4. Backend

**Technology:** Node.js, Express, TypeScript.

The backend is organized into domain modules.

Initial modules:

- Identity and Access
- Students and Skills
- Organizations and Recruiters
- Opportunities
- Applications
- Assessments
- Matching
- Learning
- Portfolios
- Internships
- Academia Collaboration
- Institutions and Analytics
- Documents
- Administration

Modules will be introduced incrementally.

## 5. Backend Request Lifecycle

```text
HTTP Request
     |
     v
Route
     |
     v
Validation Middleware
     |
     v
Authentication / Authorization
     |
     v
Controller
     |
     v
Service
     |
     v
Prisma
     |
     v
PostgreSQL
```

**Routes:** Define endpoint mappings and middleware composition.

**Controllers:** Translate HTTP requests and responses.

**Services:** Implement business rules and application operations.

**Prisma:** Provides database access.

**Middleware:** Implements reusable HTTP concerns.

## 6. Matching Engine

The matching engine is a domain service, not a separate microservice.

Its responsibilities include:

- Evaluating eligibility
- Comparing required and preferred skills
- Evaluating proficiency and assessment evidence
- Ranking suitable opportunities
- Explaining matching outcomes
- Identifying skill gaps

The initial algorithm will be deterministic and independently testable.

It must not be described as machine learning unless an actual ML component is implemented.

## 7. Authentication and Authorization

Authentication and authorization are separate concerns.

The proposed design includes:

- Secure password hashing
- Server-verified authentication
- Role-based permissions
- Resource ownership checks
- Protected routes and APIs

Browser token/session transport will be finalized in a dedicated security design before implementation.

## 8. Database

PostgreSQL will be the primary database.

The relational model will enforce appropriate:

- Primary and foreign keys
- Unique constraints
- Many-to-many relationships
- Transactions
- Indexes
- Referential integrity

## 9. External Integrations

Learning platforms, certification providers, and institutional databases will be accessed through documented integration boundaries.

External failures must not corrupt internal data or compromise core workflows.

## 10. Deployment

The frontend, backend, and database may be deployed independently.

Production deployment must use HTTPS, secure configuration, and appropriate database connectivity.

Hosting providers will be selected after the initial application foundation is operational.

## 11. Architectural Principles

- Modular monolith before microservices
- Clear separation of concerns
- Backend-authoritative security
- Explicit domain boundaries
- Database integrity
- Testable business logic
- Minimal infrastructure complexity
- Measured optimization

## 12. Future Evolution

Caching, background jobs, object storage, advanced search, and additional services may be introduced when requirements or measured workloads justify them.

These capabilities are not part of the initial implementation.