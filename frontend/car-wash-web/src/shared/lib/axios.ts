import axios from 'axios';
import { ROUTES } from '@/router/routes';

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        window.location.href = ROUTES.PUBLIC.LOGIN;
      } else if (error.response?.status === 403) {
        window.location.href = ROUTES.PUBLIC.UNAUTHORIZED;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
