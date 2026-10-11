# SkillBridge — Engineering Standards

**Version:** 1.0  
**Status:** Active development standards

These standards apply across the entire repository.

**MUST** indicates a required practice. **SHOULD** indicates a strong recommendation. Exceptions require an explained engineering reason.

## 1. General Principles

- MUST prioritize correctness, security, clarity, and maintainability.
- MUST implement against documented requirements.
- MUST keep changes focused and reviewable.
- MUST validate data at trust boundaries.
- MUST distinguish implemented functionality from planned functionality.
- SHOULD prefer simple solutions over premature abstraction.
- SHOULD document meaningful tradeoffs.

## 2. TypeScript and Code Quality

- Enable strict TypeScript.
- Avoid `any` and unnecessary type assertions.
- Prefer descriptive names and cohesive functions.
- Use consistent formatting and linting.
- Avoid duplicated business logic.
- Handle errors deliberately.
- Keep secrets out of source control.

## 3. Frontend

- Use Next.js App Router and React.
- Separate page composition from reusable components.
- Prefer Server Components where appropriate.
- Use Client Components when browser interaction is required.
- Centralize API access.
- Handle loading, empty, error, and success states.
- Use responsive layouts.
- Avoid unnecessary global state.
- Prevent accidental exposure of server-only secrets.

## 4. Design System

- Maintain consistent colors, typography, spacing, and component behavior.
- Separate generic UI primitives from domain components.
- Use accessible semantic HTML.
- Support keyboard navigation and visible focus.
- Avoid communicating meaning through color alone.
- Respect reduced-motion preferences.

The previously selected SkillBridge brand palette and fonts may be retained, but must be implemented through documented design tokens.

## 5. Backend

- Use Express and TypeScript.
- Separate routes, middleware, controllers, and services.
- Keep business rules inside domain services.
- Keep database operations out of HTTP controllers.
- Centralize validation and error handling.
- Use appropriate HTTP methods and status codes.
- Maintain versioned business APIs.
- Avoid unnecessary framework abstractions.

## 6. Database

- Use PostgreSQL for relational persistence.
- Use Prisma for schema management and database access.
- Define appropriate foreign keys and constraints.
- Use transactions for atomic operations.
- Design indexes around actual queries.
- Avoid N+1 query patterns.
- Maintain version-controlled migrations.
- Do not use destructive database operations against production data without reviewed procedures.

## 7. Security

- Hash passwords using an appropriate password-hashing algorithm.
- Never store or log plaintext passwords.
- Enforce authorization on the backend.
- Validate untrusted inputs.
- Protect against unauthorized resource access.
- Configure CORS deliberately.
- Consider XSS and CSRF threats.
- Use secure cookie/session settings when applicable.
- Avoid exposing sensitive information in error responses.
- Apply rate limiting to abuse-sensitive endpoints before public production exposure.
- Keep dependencies updated and review relevant security advisories.

## 8. Authentication

The final browser authentication transport must be documented before implementation.

Authentication must establish identity.

Authorization must enforce roles, organization membership, and resource ownership.

Never rely solely on frontend route hiding.

## 9. API Design

- Use `/api/v1` for business APIs.
- Keep response formats consistent.
- Validate request bodies, parameters, and queries.
- Use bounded pagination for potentially large collections.
- Use stable error codes.
- Avoid exposing implementation details.
- Document implemented endpoints.

## 10. Testing

Testing must include appropriate combinations of:

- Unit tests for business logic
- API tests for request/response contracts
- Integration tests for database behavior
- Component tests for frontend interactions
- End-to-end tests for critical workflows

Tests must be deterministic where practical.

Mock external boundaries deliberately.

Do not claim mocked database tests prove real transaction rollback.

## 11. Performance

- Measure before optimizing.
- Avoid unnecessary frontend dependencies.
- Optimize queries based on observed behavior.
- Paginate large collections.
- Avoid excessive client-side rendering.
- Monitor bundle size when appropriate.
- Add caching only when justified.

## 12. DevOps

- Keep development and production configuration separate.
- Use environment variables for secrets and deployment configuration.
- Maintain reproducible builds.
- Run linting, typechecking, tests, and builds in CI.
- Use HTTPS in production.
- Define deployment and rollback procedures.
- Configure health checks.
- Maintain appropriate database backup and recovery procedures before production use.
- Do not deploy unverified changes to production.

## 13. Observability

- Provide meaningful health checks.
- Log operational failures without leaking secrets.
- Use structured logging when introduced.
- Add request identifiers when useful for debugging.
- Monitor errors and availability in deployed environments.

## 14. Git

- Use meaningful commit messages.
- Keep unrelated changes in separate commits.
- Never commit `.env` files or credentials.
- Use feature branches when appropriate.
- Review diffs before merging.
- Preserve working checkpoints.

## 15. Documentation

Maintain accurate requirements, architecture, database, API, and engineering documentation.

Documentation must describe the real implementation.

Update affected documents when behavior or architecture changes.

## 16. Definition of Done

A feature is complete only when:

- Requirements are satisfied.
- Relevant acceptance criteria are met.
- Appropriate tests pass.
- Typechecking and linting pass.
- Production build succeeds.
- Security and accessibility implications have been considered.
- Documentation is updated.
- Known limitations are reported.

## 17. Architecture Restraint

Do not introduce Redis, Kafka, microservices, Kubernetes, or additional infrastructure solely for resume value.

Introduce new technology only when its benefits justify its implementation and operational costs.