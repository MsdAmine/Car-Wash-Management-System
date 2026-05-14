# Wash Service Management API

Base URL: `/api/v1/services`

Read endpoints are public. Write endpoints require a valid JWT with the `ADMIN` role in the `Authorization: Bearer <token>` header.

---

## Data Model

### WashServiceRequest (request body)

| Field             | Type       | Constraints                                          |
|-------------------|------------|------------------------------------------------------|
| `name`            | string     | Required. 2–100 characters.                          |
| `description`     | string     | Optional. Max 500 characters.                        |
| `price`           | BigDecimal | Required. Minimum `0.01`. Max 8 integer + 2 decimal digits. |
| `durationMinutes` | integer    | Required. 1–480.                                     |
| `active`          | boolean    | Optional. Defaults to `true`.                        |

### WashServiceResponse

| Field             | Type       | Description                              |
|-------------------|------------|------------------------------------------|
| `id`              | UUID       | Service identifier.                      |
| `name`            | string     | Unique service name.                     |
| `description`     | string     | Optional description (may be `null`).    |
| `price`           | BigDecimal | Price in USD.                            |
| `durationMinutes` | integer    | Estimated service duration in minutes.   |
| `active`          | boolean    | Whether the service is available.        |
| `createdAt`       | datetime   | ISO-8601 creation timestamp.             |
| `updatedAt`       | datetime   | ISO-8601 last-update timestamp.          |

---

## Endpoints

### POST /api/v1/services

Create a new wash service.

**Roles:** `ADMIN`

**Request body:** `WashServiceRequest`

**Responses:**

| Status | Description                                      |
|--------|--------------------------------------------------|
| 201    | Service created. Body: `WashServiceResponse`.    |
| 400    | Validation error (missing or invalid fields).    |
| 401    | Missing or invalid JWT.                          |
| 403    | Authenticated user does not have `ADMIN` role.   |
| 409    | A service with the same name already exists.     |

---

### GET /api/v1/services

List all wash services (active and inactive).

**Roles:** Public (no authentication required)

**Responses:**

| Status | Description                                         |
|--------|-----------------------------------------------------|
| 200    | Success. Body: array of `WashServiceResponse`.      |

---

### GET /api/v1/services/active

List only active wash services (`active = true`).

**Roles:** Public (no authentication required)

**Responses:**

| Status | Description                                         |
|--------|-----------------------------------------------------|
| 200    | Success. Body: array of `WashServiceResponse`.      |

---

### GET /api/v1/services/{id}

Get a single wash service by its UUID.

**Roles:** Public (no authentication required)

**Path parameter:** `id` — UUID of the service.

**Responses:**

| Status | Description                                      |
|--------|--------------------------------------------------|
| 200    | Success. Body: `WashServiceResponse`.            |
| 404    | Service not found.                               |

---

### PUT /api/v1/services/{id}

Update an existing wash service.

**Roles:** `ADMIN`

**Path parameter:** `id` — UUID of the service.

**Request body:** `WashServiceRequest` (all fields are re-validated; partial updates are not supported)

**Responses:**

| Status | Description                                      |
|--------|--------------------------------------------------|
| 200    | Updated. Body: `WashServiceResponse`.            |
| 400    | Validation error.                                |
| 401    | Missing or invalid JWT.                          |
| 403    | Authenticated user does not have `ADMIN` role.   |
| 404    | Service not found.                               |
| 409    | Another service with the same name already exists. |

---

### PATCH /api/v1/services/{id}/deactivate

Deactivate a wash service (sets `active = false`). The service record is preserved.

**Roles:** `ADMIN`

**Path parameter:** `id` — UUID of the service.

**Responses:**

| Status | Description                                      |
|--------|--------------------------------------------------|
| 200    | Deactivated. Body: `WashServiceResponse`.        |
| 401    | Missing or invalid JWT.                          |
| 403    | Authenticated user does not have `ADMIN` role.   |
| 404    | Service not found.                               |

---

### DELETE /api/v1/services/{id}

Permanently delete a wash service.

**Roles:** `ADMIN`

**Path parameter:** `id` — UUID of the service.

**Responses:**

| Status | Description                                      |
|--------|--------------------------------------------------|
| 204    | Deleted. No response body.                       |
| 401    | Missing or invalid JWT.                          |
| 403    | Authenticated user does not have `ADMIN` role.   |
| 404    | Service not found.                               |

---

## Error Response Format

All error responses follow the standard problem-detail structure:

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Wash service with name 'Basic Wash' already exists",
  "path": "/api/v1/services"
}
```

---

## Frontend Integration

The frontend service layer (`src/services/washServiceService.ts`) maps to these endpoints:

| Function            | HTTP call                              | Auth required |
|---------------------|----------------------------------------|---------------|
| `create(data)`      | `POST /services`                       | ADMIN JWT     |
| `listAll()`         | `GET /services`                        | No            |
| `listActive()`      | `GET /services/active`                 | No            |
| `getById(id)`       | `GET /services/{id}`                   | No            |
| `update(id, data)`  | `PUT /services/{id}`                   | ADMIN JWT     |
| `deactivate(id)`    | `PATCH /services/{id}/deactivate`      | ADMIN JWT     |
| `remove(id)`        | `DELETE /services/{id}`                | ADMIN JWT     |

The API base URL is configured via the `VITE_API_BASE_URL` environment variable (see `.env.example`).
