import api from '@/shared/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<ApiWrapper<AuthResponse>>('/api/v1/auth/login', data);
  return response.data.data;
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<ApiWrapper<AuthResponse>>('/api/v1/auth/register', data);
  return response.data.data;
}
