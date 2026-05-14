# Payment Tracking

Manual payment tracking for the Car Wash Management System. Staff record payments after a customer pays in person; online payment processing is out of scope.

## Overview

- One payment record per booking (enforced at the API level).
- Payments start as `PENDING` and are confirmed manually by admins or employees.
- Admins can set any status; employees can only confirm pending payments.
- Customers can view their own payment history but cannot create or modify payment records.

## Payment Statuses

| Status      | Meaning                                           |
|-------------|---------------------------------------------------|
| `PENDING`   | Payment recorded but not yet confirmed            |
| `CONFIRMED` | Payment confirmed; `paidAt` timestamp is set      |
| `FAILED`    | Payment attempt failed (e.g. card declined)       |
| `REFUNDED`  | Payment was refunded to the customer              |

## Payment Methods

`CASH`, `CARD`, `BANK_TRANSFER`, `MOBILE_PAYMENT`

## API Endpoints

All payment endpoints are under `/api/v1/payments` and require a valid JWT.

| Method  | Path                              | Roles                  | Description                        |
|---------|-----------------------------------|------------------------|------------------------------------|
| `POST`  | `/payments`                       | ADMIN, EMPLOYEE        | Record a new payment for a booking |
| `GET`   | `/payments`                       | ADMIN                  | List all payments                  |
| `GET`   | `/payments/my`                    | Any authenticated user | Get own payment history            |
| `GET`   | `/payments/booking/{bookingId}`   | Any authenticated user | Get payment for a specific booking |
| `PATCH` | `/payments/{id}/confirm`          | ADMIN, EMPLOYEE        | Confirm a pending payment          |
| `PATCH` | `/payments/{id}/status`           | ADMIN                  | Update payment to any status       |

## Business Rules

- **Duplicate prevention**: Only one payment record is allowed per booking. A `409 Conflict` is returned if a payment already exists for the booking.
- **Amount validation**: The payment amount must match the booking's total price exactly. A `400 Bad Request` is returned otherwise.
- **Access control**: Customers can only view payments for their own bookings. The service enforces ownership checks beyond what Spring Security provides.
- **Confirmed payments**: Once `CONFIRMED`, the `paidAt` timestamp is set automatically. Attempting to confirm an already-confirmed payment returns `400 Bad Request`.

## Frontend Pages

| Route                | Role      | Description                                 |
|----------------------|-----------|---------------------------------------------|
| `/admin/payments`    | ADMIN     | View all payments, confirm, update status   |
| `/my-payments`       | CUSTOMER  | View own payment history                    |
| `/bookings/:id`      | CUSTOMER  | Booking details includes payment status     |

## Error Responses

All errors follow the standard `ErrorResponse` format:

```json
{
  "status": 400,
  "message": "Payment amount 10.00 does not match the booking total price 25.00",
  "path": "/api/v1/payments",
  "timestamp": "2026-05-14T10:00:00"
}
```

Common error codes:

| HTTP Status | Scenario                                          |
|-------------|---------------------------------------------------|
| `400`       | Amount mismatch, already confirmed, invalid input |
| `401`       | Missing or invalid JWT                            |
| `403`       | Insufficient role or accessing another customer's data |
| `404`       | Booking or payment not found                      |
| `409`       | Payment already exists for this booking           |
