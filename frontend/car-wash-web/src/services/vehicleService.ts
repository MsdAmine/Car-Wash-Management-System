import api from '../api/axios';
import type { VehicleRequest, VehicleResponse } from '../types/vehicle';

const vehicleService = {
    async create(data: VehicleRequest): Promise<VehicleResponse> {
        const response = await api.post<any>('/vehicles', data);
        return response.data.data;
    },

    async list(): Promise<VehicleResponse[]> {
        const response = await api.get<any>('/vehicles');
        return response.data.data;
    },

    async getById(id: string): Promise<VehicleResponse> {
        const response = await api.get<any>(`/vehicles/${id}`);
        return response.data.data;
    },

    async update(id: string, data: VehicleRequest): Promise<VehicleResponse> {
        const response = await api.put<any>(`/vehicles/${id}`, data);
        return response.data.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/vehicles/${id}`);
    },

    async listByCustomer(customerId: number): Promise<VehicleResponse[]> {
        const response = await api.get<any>(`/vehicles/customer/${customerId}`);
        return response.data.data;
    },
};

export default vehicleService;
