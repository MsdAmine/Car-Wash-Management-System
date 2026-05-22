import api from '@/shared/lib/axios';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  NotificationPreferences,
  PasswordResetTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserProfileResponse,
} from './types';

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

export async function requestPasswordReset(
  data: ForgotPasswordRequest,
): Promise<PasswordResetTokenResponse> {
  const response = await api.post<ApiWrapper<PasswordResetTokenResponse>>(
    '/auth/forgot-password',
    data,
  );
  return response.data.data;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await api.post<ApiWrapper<null>>('/auth/reset-password', data);
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  return (await api.get<UserProfileResponse>('/users/profile')).data;
}

export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
  return (await api.put<UserProfileResponse>('/users/profile', data)).data;
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await api.patch('/users/password', data);
}

export async function deleteAccount(): Promise<void> {
  await api.delete('/users/me');
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  return (await api.get<NotificationPreferences>('/users/notifications')).data;
}

export async function updateNotificationPreferences(
  data: NotificationPreferences,
): Promise<NotificationPreferences> {
  return (await api.put<NotificationPreferences>('/users/notifications', data)).data;
}

export async function uploadAvatar(dataUrl: string): Promise<UserProfileResponse> {
  return (
    await api.patch<UserProfileResponse>('/users/avatar', { avatarDataUrl: dataUrl })
  ).data;
}
