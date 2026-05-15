import type { PaymentStatus } from './booking';

export const PAYMENT_METHODS = [
    'CASH',
    'CARD',
    'BANK_TRANSFER',
    'MOBILE_PAYMENT',
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface PaymentResponse {
    id: string;
    bookingId: string;
    customerId: number;
    customerEmail: string;
    amount: number | string;
    method: PaymentMethod;
    status: PaymentStatus;
    paidAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdatePaymentStatusRequest {
    status: PaymentStatus;
}
