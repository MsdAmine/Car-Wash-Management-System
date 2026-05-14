import api from '../api/axios';
import type { WashServiceRequest, WashServiceResponse } from '../types/washService';

const washServiceService = {
    async create(data: WashServiceRequest): Promise<WashServiceResponse> {
        const response = await api.post<WashServiceResponse>('/services', data);
        return response.data;
    },

    async listAll(): Promise<WashServiceResponse[]> {
        const response = await api.get<WashServiceResponse[]>('/services');
        return response.data;
    },

    async listActive(): Promise<WashServiceResponse[]> {
        const response = await api.get<WashServiceResponse[]>('/services/active');
        return response.data;
    },

    async getById(id: string): Promise<WashServiceResponse> {
        const response = await api.get<WashServiceResponse>(`/services/${id}`);
        return response.data;
    },

    async update(id: string, data: WashServiceRequest): Promise<WashServiceResponse> {
        const response = await api.put<WashServiceResponse>(`/services/${id}`, data);
        return response.data;
    },

    async deactivate(id: string): Promise<WashServiceResponse> {
        const response = await api.patch<WashServiceResponse>(`/services/${id}/deactivate`);
        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/services/${id}`);
    },
};

export default washServiceService;
