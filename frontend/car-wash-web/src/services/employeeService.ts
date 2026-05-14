import api from '../api/axios';
import type {
    AssignEmployeeRequest,
    BookingAssignmentResponse,
    CreateEmployeeRequest,
    EmployeeResponse,
    UpdateEmployeeRequest,
} from '../types/employee';

const employeeService = {
    async create(data: CreateEmployeeRequest): Promise<EmployeeResponse> {
        const response = await api.post<EmployeeResponse>('/employees', data);
        return response.data;
    },

    async list(): Promise<EmployeeResponse[]> {
        const response = await api.get<EmployeeResponse[]>('/employees');
        return response.data;
    },

    async getMe(): Promise<EmployeeResponse> {
        const response = await api.get<EmployeeResponse>('/employees/me');
        return response.data;
    },

    async getById(id: string): Promise<EmployeeResponse> {
        const response = await api.get<EmployeeResponse>(`/employees/${id}`);
        return response.data;
    },

    async update(id: string, data: UpdateEmployeeRequest): Promise<EmployeeResponse> {
        const response = await api.put<EmployeeResponse>(`/employees/${id}`, data);
        return response.data;
    },

    async deactivate(id: string): Promise<void> {
        await api.delete(`/employees/${id}`);
    },

    async assignToBooking(bookingId: string, data: AssignEmployeeRequest): Promise<BookingAssignmentResponse> {
        const response = await api.post<BookingAssignmentResponse>(`/bookings/${bookingId}/assign`, data);
        return response.data;
    },

    async removeFromBooking(bookingId: string, employeeId: string): Promise<void> {
        await api.delete(`/bookings/${bookingId}/assign/${employeeId}`);
    },

    async getBookingAssignments(bookingId: string): Promise<BookingAssignmentResponse[]> {
        const response = await api.get<BookingAssignmentResponse[]>(`/bookings/${bookingId}/assignments`);
        return response.data;
    },

    async getAssignedBookings(employeeId: string): Promise<BookingAssignmentResponse[]> {
        const response = await api.get<BookingAssignmentResponse[]>(`/employees/${employeeId}/bookings`);
        return response.data;
    },

    async getMyTodayAssignments(): Promise<BookingAssignmentResponse[]> {
        const response = await api.get<BookingAssignmentResponse[]>('/employees/me/bookings/today');
        return response.data;
    },
};

export default employeeService;
