import axios, { AxiosInstance } from 'axios';
import { ApiResponse, ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_BASEURL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth-storage');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export async function httpClient<TResponse, TRequest = void>(
  endpoint: string,
  options: {
    method?: string;
    data?: TRequest;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers,
    });

    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An unexpected error occurred',
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      };
      throw apiError;
    }
    throw error;
  }
}
