# Frontend Screenshots

This document describes the main UI screens of the Car Wash Management System frontend.

Screenshots can be taken by running `npm run dev` (from `frontend/car-wash-web/`) and navigating to each page listed below.

---

## Public Pages

### Login (`/login`)
- Gradient blue/indigo background with centred card
- Email and password fields with icons
- Inline error message on bad credentials
- Link to registration page

### Register (`/register`)
- Same background as login
- First name, last name, email, phone, and password fields
- Field-level validation errors shown on blur and submit
- Password hint (minimum 6 characters)

### Services (`/services`)
- Public list of active wash packages with price and duration

---

## Customer Pages

### Dashboard (`/`)
- Stats cards: upcoming bookings, total bookings, vehicles registered
- Recent bookings summary

### Book Appointment (`/book-appointment`)
- Dropdown to select a registered vehicle
- Dropdown to select a wash service (with price and duration)
- Date/time picker for the appointment
- Optional notes field
- Inline booking error (e.g. unavailable slot)

### My Bookings (`/my-bookings`)
- Card list of all bookings with status badge and coloured left border
- Skeleton loaders during initial fetch
- Empty state with CTA when no bookings exist
- "Cancel Booking" for PENDING bookings, with a warning confirmation dialog
- Error banner with retry button on fetch failure

### Booking Details (`/bookings/:id`)
- Full details card: service, vehicle, price, dates, duration, notes
- Status badge with coloured top border
- "Cancel Booking" button for PENDING bookings, with confirmation dialog

### My Vehicles (`/my-vehicles`)
- Grid of vehicle cards (brand, model, type, licence plate)
- Edit and Delete buttons per card
- Delete triggers a danger confirmation dialog
- Skeleton loaders on initial fetch
- Empty state with CTA when no vehicles exist

---

## Admin Pages

### Dashboard (`/admin/settings`)
- Revenue summary widget
- Recent bookings widget
- Service popularity chart
- Employee workload summary

### Manage Bookings (`/admin/bookings`)
- Filterable table by booking status
- Assign employee to a booking via a modal
- Change booking status inline via dropdown
- Marking COMPLETED shows a payment confirmation dialog

### Manage Services (`/admin/services`)
- Table of all wash services with active/inactive badge
- Edit, Deactivate, and Delete actions per row
- Delete triggers a danger confirmation dialog
- Empty state with Add Service CTA

### Manage Employees (`/admin/employees`)
- Table of employees with avatar initials, position, hire date, and status
- Deactivate action with a warning confirmation dialog
- Toggle to show/hide inactive employees
- Empty state

---

## Employee (Staff) Pages

### Dashboard (`/employee/dashboard`)
- Overview of assigned bookings and daily schedule

### Daily Schedule (`/employee/bookings`)
- Timeline-style list of today's bookings
- Status badge per booking
- Inline status change dropdown
- Refresh button
- Empty state when no bookings scheduled today

### My Assignments (`/employee/assigned-bookings`)
- Table of all bookings ever assigned to this employee
- "Work on this" link per row navigates to the work detail page
- Empty state when no assignments

---

## Shared UI Patterns

| Pattern | Description |
|---|---|
| Loading skeleton | Animated grey placeholders during data fetch |
| Empty state | Centred icon + message + optional CTA button |
| Error banner | Red bordered alert with retry button |
| Action error | Inline red alert below header for action failures |
| Confirmation dialog | Modal with title, message, cancel, and confirm buttons |
