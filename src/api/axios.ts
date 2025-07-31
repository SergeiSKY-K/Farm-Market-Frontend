import axios, {
    type InternalAxiosRequestConfig,
    type AxiosError,
} from 'axios';
import { store } from '../store/store';
import { logout, setAuth } from '../store/slices/authSlice';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
    withCredentials: true,
});


const isAuthFreeEndpoint = (url?: string): boolean => {
    if (!url) return true;
    return (
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/register')
    );
};


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers && !isAuthFreeEndpoint(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const accessToken = res.headers.authorization?.split(' ')[1];

                if (accessToken) {
                    const role = store.getState().auth.role ?? 'USER';
                    store.dispatch(setAuth({ accessToken, role }));

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }

                    return api(originalRequest);
                }

                throw new Error('Access token not received');
            } catch (refreshError) {
                store.dispatch(logout());
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;