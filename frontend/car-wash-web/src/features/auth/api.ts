import api from '@/shared/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest, UserProfileResponse } from './types';

interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<ApiWrapper<AuthResponse>>('/auth/login', data);
  return response.data.data;
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<ApiWrapper<AuthResponse>>('/auth/register', data);
  return response.data.data;
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  return (await api.get<UserProfileResponse>('/users/profile')).data;
}

export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
  return (await api.put<UserProfileResponse>('/users/profile', data)).data;
}
