# Booking Workflow

## Overview

The booking workflow allows customers to schedule car wash appointments and lets employees and admins manage those appointments through their lifecycle.

## Roles

| Role | Permissions |
|------|-------------|
| CUSTOMER | Create bookings, view own bookings, cancel own pending bookings |
| STAFF | View today's bookings, update booking status |
| ADMIN | View all bookings, update any booking status, cancel any booking |

## Booking Statuses

```
PENDING → CONFIRMED → COMPLETED
   ↓           ↓
CANCELLED  CANCELLED
```

| Status | Meaning |
|--------|---------|
| `PENDING` | Booking created, awaiting confirmation |
| `CONFIRMED` | Booking confirmed by staff or admin |
| `COMPLETED` | Service has been delivered |
| `CANCELLED` | Booking was cancelled (terminal state) |

Status transitions are enforced server-side. A `COMPLETED` or `CANCELLED` booking cannot be moved to any other status.

## Customer Flow

1. **Book an appointment** — Navigate to `/book-appointment`.
   - Select a vehicle (must be registered under the account).
   - Select a wash service from the active service list.
   - Choose a date and time (minimum 30 minutes from now, maximum 90 days out).
   - Optionally add notes (up to 500 characters).
   - Submit. The booking is created with status `PENDING`.

2. **View bookings** — Navigate to `/my-bookings`.
   - All bookings are listed with their current status badge.
   - Clicking **View Details** opens the full detail page (`/bookings/:id`).

3. **Cancel a booking** — Only `PENDING` bookings can be cancelled.
   - Available from both the list and the detail page.
   - A confirmation dialog prevents accidental cancellation.

## Staff Flow

1. Navigate to `/employee/daily-bookings`.
2. The page lists all bookings scheduled for today, sorted by appointment time.
3. Use the status dropdown on each row to update the booking status (e.g. `PENDING` → `CONFIRMED` → `COMPLETED`).
4. Use the **Refresh** button to reload the schedule.

## Admin Flow

1. Navigate to `/admin/bookings`.
2. All bookings across all customers are listed in a table.
3. Use the **Status** filter at the top-right to narrow by status.
4. Use the status dropdown in the **Actions** column to update any booking.

## API Endpoints

| Method | Path | Role | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/bookings` | CUSTOMER | Create a booking |
| `GET` | `/api/v1/bookings/my` | CUSTOMER | List own bookings |
| `GET` | `/api/v1/bookings/:id` | CUSTOMER, ADMIN | Get booking by ID |
| `GET` | `/api/v1/bookings` | ADMIN | List all bookings |
| `GET` | `/api/v1/bookings/today` | STAFF, ADMIN | List today's bookings |
| `PATCH` | `/api/v1/bookings/:id/status` | STAFF, ADMIN | Update booking status |
| `PATCH` | `/api/v1/bookings/:id/cancel` | CUSTOMER, ADMIN | Cancel a booking |

## Validation Rules

- Appointment time must be at least 30 minutes in the future.
- Appointment time cannot be more than 90 days in the future.
- The vehicle must belong to the customer creating the booking.
- The wash service must be active (not archived).
- End time is calculated automatically from appointment time + service duration.
- Total price is calculated from the wash service price at booking time.

## Frontend Components

| Component / Page | Path |
|-----------------|------|
| Book Appointment form | `src/pages/BookAppointment.tsx` |
| Customer booking list | `src/pages/MyBookings.tsx` |
| Booking detail view | `src/pages/BookingDetails.tsx` |
| Admin booking management | `src/pages/AdminBookings.tsx` |
| Employee daily schedule | `src/pages/EmployeeBookings.tsx` |
| Booking form component | `src/components/BookingForm.tsx` |
| Status badge component | `src/components/BookingStatusBadge.tsx` |
| Skeleton loaders | `src/components/BookingSkeletons.tsx` |
| API service layer | `src/services/bookingService.ts` |
| TypeScript types | `src/types/booking.ts` |
