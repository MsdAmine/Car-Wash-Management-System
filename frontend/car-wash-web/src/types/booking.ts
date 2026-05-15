export const BOOKING_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'REFUNDED',
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface BookingRequest {
    vehicleId: string;
    washServiceId: string;
    appointmentDateTime: string;
    notes?: string;
}

export interface UpdateBookingStatusRequest {
    status: BookingStatus;
}

export interface BookingResponse {
    id: string;
    customerId: number;
    customerEmail: string;
    vehicleId: string;
    vehicleLicensePlate: string;
    washServiceId: string;
    washServiceName: string;
    washServicePrice: number;
    durationMinutes: number;
    totalPrice: number;
    status: BookingStatus;
    appointmentDateTime: string;
    endDateTime: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
