# Dashboard & Reporting — Phase 8

This document covers the dashboard and reporting features implemented as part of Phase 8.

---

## Overview

The dashboard module provides role-scoped summary views for each user type:

- **Admin** — system-wide statistics: bookings, revenue, and most-requested services.
- **Customer** — personal summary: upcoming bookings, booking history, and registered vehicles.
- **Employee** — workload overview: assigned bookings and bookings currently in progress.

---

## Backend API

Base URL: `/api/v1`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard/admin` | ADMIN | System-wide booking and revenue statistics |
| `GET` | `/dashboard/customer` | CUSTOMER | Authenticated customer's booking and vehicle summary |
| `GET` | `/dashboard/employee` | EMPLOYEE | Authenticated employee's workload summary |

All endpoints require a valid Bearer JWT token. Requests without a token return `401`; requests with the wrong role return `403`.

---

## Data Models

### AdminDashboardResponse

```json
{
  "totalBookings": 120,
  "todaysBookings": 8,
  "pendingBookings": 14,
  "completedBookings": 98,
  "dailyRevenue": 340.00,
  "monthlyRevenue": 7200.00,
  "mostRequestedServices": [
    { "serviceName": "Full Wash", "bookingCount": 45 },
    { "serviceName": "Interior Clean", "bookingCount": 30 }
  ]
}
```

### CustomerDashboardResponse

```json
{
  "upcomingBookings": 2,
  "previousBookings": 10,
  "registeredVehicles": 3
}
```

### EmployeeDashboardResponse

```json
{
  "assignedBookings": 15,
  "bookingsInProgress": 3
}
```

---

## Admin Dashboard Logic

The admin dashboard aggregates data from bookings and payments:

- **Total bookings** — count of all bookings in the system.
- **Today's bookings** — bookings with `appointmentDateTime` within the current calendar day.
- **Pending bookings** — bookings with status `PENDING`.
- **Completed bookings** — bookings with status `COMPLETED`.
- **Daily revenue** — sum of confirmed payments (`CONFIRMED`) paid today.
- **Monthly revenue** — sum of confirmed payments paid within the current calendar month.
- **Most requested services** — top 5 services ranked by booking count.

---

## Customer Dashboard Logic

The customer dashboard is scoped to the authenticated user's data:

- **Upcoming bookings** — bookings with status `PENDING` or `CONFIRMED` and `appointmentDateTime` in the future.
- **Previous bookings** — bookings with status `COMPLETED`.
- **Registered vehicles** — vehicles owned by the authenticated customer.

---

## Employee Dashboard Logic

The employee dashboard is scoped to the authenticated employee's assignments:

- **Assigned bookings** — total number of booking assignments for the employee.
- **Bookings in progress** — assignments where the booking status is `CONFIRMED`.

Returns `404` if the authenticated user has no linked employee profile.

---

## Frontend Routes

| Path | Component | Role |
|------|-----------|------|
| `/dashboard` | `CustomerDashboard` | CUSTOMER |
| `/admin/dashboard` | `AdminDashboard` | ADMIN |
| `/employee/dashboard` | `EmployeeDashboard` | EMPLOYEE |

---

## Frontend Service

### `dashboardService` (`src/services/dashboardService.ts`)

```typescript
dashboardService.getAdminDashboard()    // GET /dashboard/admin
dashboardService.getCustomerDashboard() // GET /dashboard/customer
dashboardService.getEmployeeDashboard() // GET /dashboard/employee
```

---

## UI Behaviour

### Loading states

All three dashboard pages show skeleton placeholder cards while data is being fetched. Each data section loads independently so partial failures do not block the rest of the page.

### Error states

- A red banner is displayed at the top of the page if the primary dashboard stats call fails.
- Inline error messages appear within individual sections (e.g. profile, workload, today's schedule) if those specific calls fail.

### Empty states

- Sections display an italicised grey message when data is available but empty (e.g. no bookings today, no service statistics yet).
- Stats cards default to `0` for numeric fields returned by the API — a zero value is informative rather than an absent state.

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `StatsCard` | Displays a single labelled numeric statistic with optional colour styling |
| `RevenueSummary` | Two-column card showing today's and monthly revenue formatted as currency |
| `ServicePopularity` | Bar chart of the top requested services by booking count |
| `EmployeeWorkloadSummary` | Two-column card showing total assigned and in-progress bookings |
| `RecentBookings` | Shared list component showing service name, vehicle plate, date/time, status badge, and a detail link |

---

## Tests

### `DashboardControllerTest`

`@WebMvcTest` slice covering all three endpoints:

- **GET /dashboard/admin** — 200 with full stats, 401 unauthenticated, 403 non-admin role.
- **GET /dashboard/customer** — 200 with customer summary, 401 unauthenticated, 403 non-customer role.
- **GET /dashboard/employee** — 200 with workload summary, 401 unauthenticated, 403 non-employee role, 404 no employee profile.

### `DashboardServiceTest`

Pure Mockito unit tests verifying:

- Correct repository calls for each dashboard type.
- Revenue aggregation uses the current day and month boundaries.
- Customer stats are scoped to the authenticated user's ID.
- Employee stats are scoped to the authenticated employee's ID.
- `404` is thrown when no employee profile is linked to the authenticated user.
