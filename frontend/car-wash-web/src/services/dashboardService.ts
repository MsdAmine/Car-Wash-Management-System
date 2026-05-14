import api from '../api/axios';
import type {
    AdminDashboardResponse,
    CustomerDashboardResponse,
    EmployeeDashboardResponse,
} from '../types/dashboard';

const dashboardService = {
    async getAdminDashboard(): Promise<AdminDashboardResponse> {
        const response = await api.get<AdminDashboardResponse>('/dashboard/admin');
        return response.data;
    },

    async getCustomerDashboard(): Promise<CustomerDashboardResponse> {
        const response = await api.get<CustomerDashboardResponse>('/dashboard/customer');
        return response.data;
    },

    async getEmployeeDashboard(): Promise<EmployeeDashboardResponse> {
        const response = await api.get<EmployeeDashboardResponse>('/dashboard/employee');
        return response.data;
    },
};

export default dashboardService;
