import api from '../api/axios';
import type { BookingRequest, BookingResponse, UpdateBookingStatusRequest } from '../types/booking';

const bookingService = {
    async create(data: BookingRequest): Promise<BookingResponse> {
        const response = await api.post<BookingResponse>('/bookings', data);
        return response.data;
    },

    async getMyBookings(): Promise<BookingResponse[]> {
        const response = await api.get<BookingResponse[]>('/bookings/my');
        return response.data;
    },

    async getById(id: string): Promise<BookingResponse> {
        const response = await api.get<BookingResponse>(`/bookings/${id}`);
        return response.data;
    },

    async getAll(): Promise<BookingResponse[]> {
        const response = await api.get<BookingResponse[]>('/bookings');
        return response.data;
    },

    async getToday(): Promise<BookingResponse[]> {
        const response = await api.get<BookingResponse[]>('/bookings/today');
        return response.data;
    },

    async updateStatus(id: string, data: UpdateBookingStatusRequest): Promise<BookingResponse> {
        const response = await api.patch<BookingResponse>(`/bookings/${id}/status`, data);
        return response.data;
    },

    async cancel(id: string): Promise<BookingResponse> {
        const response = await api.patch<BookingResponse>(`/bookings/${id}/cancel`);
        return response.data;
    },
};

export default bookingService;
