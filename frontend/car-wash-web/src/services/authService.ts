import api from '../api/axios';
// Explicit 'type' import to satisfy verbatimModuleSyntax
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<any>('/auth/login', credentials);

        // Access the 'data' property from your JSON response
        const authData = response.data.data;

        if (authData.token) {
            localStorage.setItem('token', authData.token);
        }

        // Return the nested data object so the Context gets firstName, lastName, etc.
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
        // This call relies on the axios interceptor to attach the Bearer token
        const response = await api.get<any>('/users/profile');
        // If your API wraps data in a 'data' field, extract it here
        return response.data.data || response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
        // Using window.location.href is a "hard" reset which clears all memory leaks
        window.location.href = '/login';
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};


export default authService;