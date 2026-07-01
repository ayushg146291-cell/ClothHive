import axios from 'axios';
import { API_BASE_URL } from '../lib/constants';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and Session ID
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach guest session ID for cart operations if user is not logged in
    let sessionId = localStorage.getItem('clothhive-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('clothhive-session-id', sessionId);
    }
    config.headers['x-session-id'] = sessionId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s (token expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if the refresh token endpoint itself fails
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('clothhive-refresh-token');
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        
        // Update store with new tokens (refresh token goes to standard localStorage to avoid storing it in Zustand if we prefer)
        // Or simply keep it in localStorage:
        localStorage.setItem('clothhive-refresh-token', newRefreshToken);
        useAuthStore.getState().setAuth(useAuthStore.getState().user as any, accessToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
