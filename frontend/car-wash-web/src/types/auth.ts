export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';

export interface AuthResponse {
    token: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    firstName: string;
    lastName: string;
    phone: string;
    role?: Extract<UserRole, 'CUSTOMER' | 'EMPLOYEE'>;
}
