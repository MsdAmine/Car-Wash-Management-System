import api from '../api/axios';
import type { PaymentRequest, PaymentResponse, UpdatePaymentStatusRequest } from '../types/payment';

const paymentService = {
    async create(data: PaymentRequest): Promise<PaymentResponse> {
        const response = await api.post<PaymentResponse>('/payments', data);
        return response.data;
    },

    async getAll(): Promise<PaymentResponse[]> {
        const response = await api.get<PaymentResponse[]>('/payments');
        return response.data;
    },

    async getMyPayments(): Promise<PaymentResponse[]> {
        const response = await api.get<PaymentResponse[]>('/payments/my');
        return response.data;
    },

    async getByBookingId(bookingId: string): Promise<PaymentResponse> {
        const response = await api.get<PaymentResponse>(`/payments/booking/${bookingId}`);
        return response.data;
    },

    async confirm(id: string): Promise<PaymentResponse> {
        const response = await api.patch<PaymentResponse>(`/payments/${id}/confirm`);
        return response.data;
    },

    async updateStatus(id: string, data: UpdatePaymentStatusRequest): Promise<PaymentResponse> {
        const response = await api.patch<PaymentResponse>(`/payments/${id}/status`, data);
        return response.data;
    },
};

export default paymentService;
