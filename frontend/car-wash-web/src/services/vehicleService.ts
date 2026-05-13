import api from '../api/axios';
import type { VehicleRequest, VehicleResponse } from '../types/vehicle';

const vehicleService = {
    async create(data: VehicleRequest): Promise<VehicleResponse> {
        const response = await api.post<VehicleResponse>('/vehicles', data);
        return response.data;
    },

    async list(): Promise<VehicleResponse[]> {
        const response = await api.get<VehicleResponse[]>('/vehicles');
        return response.data;
    },

    async getById(id: string): Promise<VehicleResponse> {
        const response = await api.get<VehicleResponse>(`/vehicles/${id}`);
        return response.data;
    },

    async update(id: string, data: VehicleRequest): Promise<VehicleResponse> {
        const response = await api.put<VehicleResponse>(`/vehicles/${id}`, data);
        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/vehicles/${id}`);
    },

    async listByCustomer(customerId: number): Promise<VehicleResponse[]> {
        const response = await api.get<VehicleResponse[]>(`/vehicles/customer/${customerId}`);
        return response.data;
    },
};

export default vehicleService;
