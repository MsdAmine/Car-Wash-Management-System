import api from '../api/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<any>('/auth/login', credentials);
        const authData = response.data.data;

        if (authData.token) {
            localStorage.setItem('token', authData.token);
        }

        return authData;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<any>('/auth/register', data);
        const authData = response.data.data;

        if (authData.token) {
            localStorage.setItem('token', authData.token);
        }

        return authData;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<any>('/users/profile');
        return response.data.data ?? response.data;
    },

    // Clears stored credentials only — callers are responsible for navigation.
    clearSession(): void {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};

export default authService;
