import axios, { AxiosInstance } from 'axios';
import { ApiResponse, ApiError } from '../../types';

const baseURL = '/api';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export async function httpClient<T>(
  endpoint: string,
  options: {
    method?: string;
    data?: T ;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
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
