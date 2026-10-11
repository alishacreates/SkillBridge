# SkillBridge — REST API Design

**Status:** Proposed  
**Backend:** Express + TypeScript  
**API Style:** REST

## 1. Versioning

Business APIs will use:

`/api/v1`

Examples:

```http
POST /api/v1/auth/register
GET  /api/v1/students/me
GET  /api/v1/opportunities
```

Health and infrastructure endpoints may remain unversioned.

## 2. HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve resources |
| POST | Create resources or initiate operations |
| PATCH | Partially update resources |
| PUT | Replace resources where appropriate |
| DELETE | Delete resources where permitted |

## 3. Success Response

```json
{
  "success": true,
  "data": {}
}
```

Optional metadata may include pagination information.

## 4. Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields"
  }
}
```

Error responses may contain structured field details where appropriate.

## 5. HTTP Status Codes

- 200 — Successful request
- 201 — Resource created
- 204 — Successful request without response body
- 400 — Invalid request
- 401 — Authentication required or invalid
- 403 — Insufficient permission
- 404 — Resource not found
- 409 — State or uniqueness conflict
- 422 — Semantic validation error where the API contract uses it
- 429 — Rate limit exceeded
- 500 — Unexpected server error
- 503 — Service unavailable

## 6. Proposed Resource Groups

```text
/api/v1/auth
/api/v1/students
/api/v1/skills
/api/v1/assessments
/api/v1/opportunities
/api/v1/applications
/api/v1/recruitment
/api/v1/internships
/api/v1/learning-programs
/api/v1/mentorships
/api/v1/academia
/api/v1/institutions
/api/v1/portfolios
/api/v1/documents
/api/v1/analytics
/api/v1/admin
```

These namespaces are proposed, not implemented endpoints.

## 7. Validation

Use Zod for incoming request validation.

Validate request bodies, path parameters, query parameters, and environment configuration.

Business rules involving database state belong in services.

## 8. Pagination

List endpoints must support bounded responses.

A consistent pagination contract will be chosen before implementing the first paginated endpoint.

## 9. Filtering and Sorting

Filtering and sorting must use explicit allowed fields.

Untrusted input must not be passed directly into dynamic database queries.

## 10. Authentication and Authorization

Protected operations require server-side authentication.

Authorization must consider:

- User roles
- Organization membership
- Resource ownership
- Workflow permissions

Frontend controls are not security boundaries.

## 11. API Documentation

Implemented endpoints will be documented with request and response examples.

OpenAPI documentation may be introduced as the API surface grows.

## 12. Compatibility

Breaking API changes require deliberate compatibility and versioning review.

Do not create a new version for every internal implementation change.