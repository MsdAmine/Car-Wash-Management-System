# Vehicle Management API

Base URL: `/api/v1/vehicles`

All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

---

## Data Model

### VehicleRequest (request body)

| Field          | Type        | Constraints                                                    |
|----------------|-------------|----------------------------------------------------------------|
| `brand`        | string      | Required. 2–50 characters.                                     |
| `model`        | string      | Required. 1–50 characters.                                     |
| `licensePlate` | string      | Required. 3–15 characters. Uppercase letters, digits, `-`, ` `.|
| `type`         | VehicleType | Required. One of: `SEDAN`, `SUV`, `TRUCK`, `VAN`, `MOTORCYCLE`, `COUPE`. |

### VehicleResponse

| Field          | Type        | Description                        |
|----------------|-------------|------------------------------------|
| `id`           | UUID        | Vehicle identifier.                |
| `brand`        | string      | Vehicle brand.                     |
| `model`        | string      | Vehicle model.                     |
| `licensePlate` | string      | License plate number.              |
| `type`         | VehicleType | Vehicle type.                      |
| `ownerEmail`   | string      | Email of the vehicle owner.        |

---

## Endpoints

### POST /api/v1/vehicles

Register a new vehicle for the authenticated customer.

**Roles:** `CUSTOMER`, `ADMIN`

**Request body:** `VehicleRequest`

**Responses:**

| Status | Description                                     |
|--------|-------------------------------------------------|
| `201`  | Vehicle created. Returns `VehicleResponse`.     |
| `400`  | Validation error (missing/invalid fields).      |
| `401`  | Unauthenticated.                                |
| `409`  | License plate already registered.               |

**Example request:**
```json
{
  "brand": "Toyota",
  "model": "Camry",
  "licensePlate": "ABC-1234",
  "type": "SEDAN"
}
```

**Example response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "brand": "Toyota",
  "model": "Camry",
  "licensePlate": "ABC-1234",
  "type": "SEDAN",
  "ownerEmail": "customer@example.com"
}
```

---

### GET /api/v1/vehicles

List all vehicles owned by the authenticated user.

**Roles:** `CUSTOMER`, `ADMIN`

**Responses:**

| Status | Description                              |
|--------|------------------------------------------|
| `200`  | Array of `VehicleResponse` (may be empty). |
| `401`  | Unauthenticated.                         |

---

### GET /api/v1/vehicles/{id}

Get a specific vehicle by ID. The vehicle must belong to the authenticated user.

**Roles:** `CUSTOMER`, `ADMIN`

**Path parameter:** `id` — UUID of the vehicle.

**Responses:**

| Status | Description                     |
|--------|---------------------------------|
| `200`  | Returns `VehicleResponse`.      |
| `401`  | Unauthenticated.                |
| `403`  | Vehicle belongs to another user.|
| `404`  | Vehicle not found.              |

---

### PUT /api/v1/vehicles/{id}

Update an existing vehicle. The vehicle must belong to the authenticated user.

**Roles:** `CUSTOMER`, `ADMIN`

**Path parameter:** `id` — UUID of the vehicle.

**Request body:** `VehicleRequest`

**Responses:**

| Status | Description                                     |
|--------|-------------------------------------------------|
| `200`  | Vehicle updated. Returns `VehicleResponse`.     |
| `400`  | Validation error.                               |
| `401`  | Unauthenticated.                                |
| `403`  | Vehicle belongs to another user.                |
| `404`  | Vehicle not found.                              |
| `409`  | New license plate already in use.               |

---

### DELETE /api/v1/vehicles/{id}

Delete a vehicle. The vehicle must belong to the authenticated user.

**Roles:** `ADMIN` only (enforced globally — only ADMINs can issue DELETE requests).

**Path parameter:** `id` — UUID of the vehicle.

**Responses:**

| Status | Description                     |
|--------|---------------------------------|
| `204`  | Vehicle deleted.                |
| `401`  | Unauthenticated.                |
| `403`  | Not an ADMIN, or vehicle belongs to another user. |
| `404`  | Vehicle not found.              |

---

### GET /api/v1/vehicles/customer/{customerId}

Admin endpoint to list all vehicles for a specific customer.

**Roles:** `ADMIN`

**Path parameter:** `customerId` — numeric ID of the customer.

**Responses:**

| Status | Description                                       |
|--------|---------------------------------------------------|
| `200`  | Array of `VehicleResponse` (may be empty).        |
| `401`  | Unauthenticated.                                  |
| `403`  | Caller is not an ADMIN.                           |
| `404`  | Customer not found.                               |

---

## Ownership & Access Rules

- Every vehicle is linked to the user who created it (the owner).
- Customers can only read, create, and update their own vehicles. They cannot read or modify vehicles belonging to other customers.
- DELETE operations are restricted to `ADMIN` role globally; an ADMIN can delete any vehicle that belongs to the authenticated owner.
- The admin-by-customer lookup (`GET /customer/{customerId}`) is restricted to `ADMIN` only.
- Attempting to access another user's vehicle returns `403 Forbidden`, not `404`, to avoid leaking existence information.

---

## Error Response Format

All errors follow a consistent structure:

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "A vehicle with this license plate is already registered",
  "path": "/api/v1/vehicles"
}
```
