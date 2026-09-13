# API

All current endpoints are mounted under `/api`.

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
