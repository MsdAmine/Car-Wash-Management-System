export interface AuthResponse {
    token: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'CUSTOMER';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    firstName: string;
    lastName: string;
    phone: string;
}