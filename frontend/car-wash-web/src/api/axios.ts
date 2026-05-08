import axios from 'axios';
import { API_URL } from '../config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// You can add interceptors here later for JWT tokens
export default axiosInstance;