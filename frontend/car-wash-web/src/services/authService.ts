import api from '../api/axios';
// Explicit 'type' import to satisfy verbatimModuleSyntax
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/users/profile');
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
        // Simple redirect to login on logout
        window.location.href = '/login';
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};
(window as any).authService = authService;
export default authService;
