import axios from 'axios';
import { IAuthResponse } from '../shared/interfaces/IAuthResponse';

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._isRetry &&
      !originalRequest.url?.includes('/refresh')
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }
    throw error;
  }
);

export default $api;
