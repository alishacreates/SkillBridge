# API

All endpoints are mounted under `/api`.

## Response envelopes

Success:

```json
{
  "success": true,
  "data": {}
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message"
  }
}
```

Validation errors additionally include an `error.details` array containing the
Zod issue code, message, and request path.

## POST /api/auth/register

Creates a User and its role-specific profile atomically. Registration never returns
an access token.

Common JSON fields are `name`, `email`, `password`, and `role`. `STUDENT` also
requires `university`, `degree`, and integer `graduationYear`; `RECRUITER` also
requires `company` and `designation`. Public `ADMIN` registration is invalid.
Names/profile strings are trimmed; email is trimmed and lowercased. Password is kept
exact, must contain at least eight characters, and may not exceed 72 UTF-8 bytes.

- `201`: `{ "success": true, "data": { "user": { ... }, "profile": { ... } } }`
- `400 VALIDATION_ERROR`: invalid or role-incompatible payload.
- `409 EMAIL_ALREADY_EXISTS`: email is already registered.

Only `id`, `name`, `email`, `role`, `createdAt`, and `updatedAt` are returned for the
User. Password fields are never returned.

## POST /api/auth/login

Accepts `email` and `password`. Email is trimmed/lowercased; the password is not
trimmed and may not exceed 72 UTF-8 bytes. Successful credential verification
returns:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "expiresIn": "15m",
    "user": {
      "id": "<uuid>",
      "name": "Example User",
      "email": "user@example.com",
      "role": "STUDENT",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  }
}
```

- `200`: credentials accepted and access token issued.
- `400 VALIDATION_ERROR`: invalid payload.
- `401 INVALID_CREDENTIALS`: email is unknown or password is wrong; the response is
  deliberately identical for both cases.

## GET /api/auth/me

Requires `Authorization: Bearer <accessToken>`. The token subject is verified and
the current User ID/role is reloaded from PostgreSQL before the controller runs.
The response is always `{ "success": true, "data": { "user": { ... }, "profile": ... } }`.

- STUDENT: `profile` is the required StudentProfile.
- RECRUITER: `profile` is the required RecruiterProfile.
- ADMIN: `profile` is `null`.

A missing required student/recruiter profile is treated as corrupted data and
returns a sanitized `500 INTERNAL_SERVER_ERROR`, not `profile: null`.

Authentication errors:

- `401 AUTHENTICATION_REQUIRED`: Bearer header is missing or malformed.
- `401 INVALID_TOKEN`: signature, expiry, issuer, audience, or UUID subject is invalid.
- `401 USER_NOT_FOUND`: a valid token refers to a deleted User. This distinction is
  an explicit API choice.

Reusable `requireRole(...roles)` middleware additionally returns `403 FORBIDDEN`
when a protected route does not allow the current database role. No current feature
route uses RBAC yet.

## GET /api/health

Returns process-level service health without querying PostgreSQL.

Query parameters:

| Name | Required | Accepted values | Behavior |
| --- | --- | --- | --- |
| `details` | No | `true`, `false` | `true` includes environment and uptime; omitted or `false` returns basic health. |

Basic response (`200`):

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "skillbridge-api"
  }
}
```

`details=true` adds `environment` and numeric `uptimeSeconds`. Invalid values
return `400 VALIDATION_ERROR`.

## GET /api/health/db

Executes a lightweight `SELECT 1` using the shared Prisma client.

- `200`: `{ "success": true, "data": { "status": "ok", "database": "reachable" } }`
- `503 DATABASE_UNAVAILABLE`: PostgreSQL is unavailable or Prisma was not initialized.

Connection errors and credentials are never included in the response.

## General errors

- Malformed JSON returns `400 MALFORMED_JSON`.
- Unknown routes return `404 ROUTE_NOT_FOUND` with message `Route not found`.
- Known Prisma not-found and uniqueness errors map to `404 RESOURCE_NOT_FOUND` and
  `409 RESOURCE_CONFLICT` respectively.
- Unexpected errors return `500 INTERNAL_SERVER_ERROR` without a stack trace.
