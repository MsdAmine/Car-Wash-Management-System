# Employee Operations — Phase 7

This document covers the employee management and booking assignment features implemented as part of Phase 7.

---

## Overview

The employee operations module provides:

- **Admin** — full CRUD for employee profiles, assignment of employees to bookings, and employee management UI.
- **Employee (STAFF)** — read-only access to their own profile, view and work on assigned bookings.

---

## Backend API

Base URL: `/api/v1`

### Employee Management

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/employees` | ADMIN | Create a new employee linked to an existing user |
| `GET` | `/employees` | ADMIN | List all employees (active and inactive) |
| `GET` | `/employees/me` | ADMIN, EMPLOYEE | Get the authenticated user's employee profile |
| `GET` | `/employees/{id}` | ADMIN | Get an employee by ID |
| `PUT` | `/employees/{id}` | ADMIN | Update an employee's position and hire date |
| `DELETE` | `/employees/{id}` | ADMIN | Deactivate an employee (soft delete) |

### Booking Assignments

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/bookings/{bookingId}/assign` | ADMIN | Assign an active employee to a PENDING or CONFIRMED booking |
| `DELETE` | `/bookings/{bookingId}/assign/{employeeId}` | ADMIN | Remove an employee from a booking |
| `GET` | `/bookings/{bookingId}/assignments` | ADMIN, EMPLOYEE | Get all assignments for a specific booking |
| `GET` | `/employees/{employeeId}/bookings` | ADMIN, EMPLOYEE | Get all booking assignments for an employee |
| `GET` | `/employees/me/bookings/today` | ADMIN, EMPLOYEE | Get today's assigned bookings for the current user |

---

## Data Models

### EmployeeResponse

```json
{
  "id": "uuid",
  "userId": 1,
  "email": "employee@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "position": "WASHER",
  "hireDate": "2024-01-15",
  "active": true,
  "createdAt": "2024-01-15T09:00:00",
  "updatedAt": "2024-01-15T09:00:00"
}
```

### CreateEmployeeRequest

```json
{
  "userId": 5,
  "position": "WASHER",
  "hireDate": "2024-01-15"
}
```

> `userId` must be the numeric ID of an existing user account that does not already have an employee profile.

### UpdateEmployeeRequest

```json
{
  "position": "SUPERVISOR",
  "hireDate": "2024-01-15"
}
```

### AssignEmployeeRequest

```json
{
  "employeeId": "uuid"
}
```

### BookingAssignmentResponse

```json
{
  "id": "uuid",
  "bookingId": "uuid",
  "employeeId": "uuid",
  "employeeFirstName": "Jane",
  "employeeLastName": "Smith",
  "employeePosition": "WASHER",
  "assignedByUserId": 1,
  "assignedByEmail": "admin@example.com",
  "assignedAt": "2024-05-14T10:30:00"
}
```

---

## Employee Positions

| Value | Description |
|-------|-------------|
| `WASHER` | Performs the wash |
| `SUPERVISOR` | Oversees wash operations |
| `CASHIER` | Handles payments |
| `MANAGER` | Manages the location |
| `RECEPTIONIST` | Handles customer reception |

---

## Business Rules

- An employee must be **active** to be assigned to a booking.
- Only bookings in `PENDING` or `CONFIRMED` status can have employees assigned.
- The same employee cannot be assigned to the same booking twice (enforced with a unique constraint and a 409 response).
- Deactivating an employee is a **soft delete** — the record is retained, but the `active` flag is set to `false`.
- An employee profile links to a User account via `userId`. Each user can have at most one employee profile.

---

## Frontend Routes

### Admin Routes (requires ADMIN role)

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/employees` | `AdminEmployees` | List all employees, deactivate |
| `/admin/employees/add` | `AddEmployee` | Create a new employee profile |
| `/admin/employees/:id/edit` | `EditEmployee` | Update position and hire date |
| `/admin/bookings` | `AdminBookings` | Manage bookings + assign employees via modal |

### Employee Routes (requires ADMIN or STAFF role)

| Path | Component | Description |
|------|-----------|-------------|
| `/employee/dashboard` | `EmployeeDashboard` | Personal profile + today's schedule overview |
| `/employee/daily-bookings` | `EmployeeBookings` | Today's bookings list with inline status update |
| `/employee/assigned-bookings` | `EmployeeAssignedBookings` | All bookings assigned to current employee |
| `/employee/bookings/:bookingId/work` | `EmployeeBookingWork` | Full booking detail with status update controls |

---

## Frontend Services

### `employeeService` (`src/services/employeeService.ts`)

```typescript
employeeService.create(data)                          // POST /employees
employeeService.list()                                // GET  /employees
employeeService.getMe()                               // GET  /employees/me
employeeService.getById(id)                           // GET  /employees/:id
employeeService.update(id, data)                      // PUT  /employees/:id
employeeService.deactivate(id)                        // DELETE /employees/:id
employeeService.assignToBooking(bookingId, data)      // POST /bookings/:id/assign
employeeService.removeFromBooking(bookingId, empId)   // DELETE /bookings/:id/assign/:empId
employeeService.getBookingAssignments(bookingId)      // GET  /bookings/:id/assignments
employeeService.getAssignedBookings(employeeId)       // GET  /employees/:id/bookings
employeeService.getMyTodayAssignments()               // GET  /employees/me/bookings/today
```

---

## Tests

### `BookingAssignmentControllerTest`

`@WebMvcTest` slice test covering all five endpoints of `BookingAssignmentController`:

- **POST assign** — 201 success, 400 validation/inactive/non-assignable, 404 not found, 409 duplicate, 403 employee role, 401 unauthenticated.
- **DELETE unassign** — 204 success, 404 not found, 403 employee role, 401 unauthenticated.
- **GET assignments for booking** — 200 admin, 200 employee, 404 booking not found, 401 unauthenticated.
- **GET assigned bookings for employee** — 200 admin, 200 employee, 404 not found, 401 unauthenticated.
- **GET my today's bookings** — 200 employee, 200 admin, 404 no profile, 401 unauthenticated.
