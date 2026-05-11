import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
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
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 1. Handle Network Errors (Server down, no internet)
        if (!error.response) {
            console.error('Network error or server is unreachable');
            return Promise.reject(error);
        }

        // 2. Handle 401 Unauthorized (Expired/Invalid JWT)
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            // Avoid redirecting if already on Login/Register to prevent loops
            const publicPages = ['/login', '/register'];
            if (!publicPages.some(page => window.location.pathname.includes(page))) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;