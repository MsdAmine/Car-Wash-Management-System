export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

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
