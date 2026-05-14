import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Prevent multiple concurrent 401s from triggering duplicate redirects.
let isRedirectingToLogin = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('[API] Network error or server unreachable');
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !isRedirectingToLogin) {
            const publicPaths = ['/login', '/register'];
            const isPublicPath = publicPaths.some((p) =>
                window.location.pathname.startsWith(p)
            );

            if (!isPublicPath) {
                isRedirectingToLogin = true;
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
