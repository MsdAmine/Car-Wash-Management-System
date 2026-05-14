export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT';

export interface PaymentRequest {
    bookingId: string;
    amount: number;
    method: PaymentMethod;
    notes?: string;
}

export interface UpdatePaymentStatusRequest {
    status: PaymentStatus;
}

export interface PaymentResponse {
    id: string;
    bookingId: string;
    customerId: number;
    customerEmail: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    paidAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
