import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_BASEURL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let failedAuthAttempts = 0;
const MAX_AUTH_FAILURES = 3;

axiosInstance.interceptors.request.use((config) => {
  try {
    // Intentar obtener el token desde localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const token = parsedStorage?.state?.token;
      if (token) {
        // Asegurarse de que config.headers exista
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error obteniendo el token:', error);
  }
  return config;
});

// Bandera para evitar múltiples redirecciones
let isRedirecting = false;

// Conjunto para rastrear URLs que ya fallaron por 401
const failedUrls = new Set<string>();

axiosInstance.interceptors.response.use(
  (response) => {
    // Resetear contador de fallos al tener una respuesta exitosa
    failedAuthAttempts = 0;
    return response;
  },
  (error) => {
    // Solo procesar errores 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Ignorar si la URL ya falló antes (para evitar bucles)
      const url = error.config.url;
      if (failedUrls.has(url)) {
        console.log(`Ignorando error 401 repetido en: ${url}`);
        return Promise.reject(error);
      }
      
      // Registrar esta URL como fallida
      failedUrls.add(url);
      
      // Incrementar contador para detectar bucles
      failedAuthAttempts++;
      
      // Si hay demasiados fallos en poco tiempo, probablemente hay un bucle
      if (failedAuthAttempts >= MAX_AUTH_FAILURES) {
        console.error("Detectado posible bucle de autenticación. Forzando cierre de sesión.");
        localStorage.removeItem('auth-storage');
        failedAuthAttempts = 0;
        
        // Redirigir solo si no estamos ya redirigiendo
        if (!isRedirecting) {
          isRedirecting = true;
          
          // Esperar un momento antes de redirigir
          setTimeout(() => {
            window.location.href = '/';
            
            // Resetear banderas después de un tiempo
            setTimeout(() => {
              isRedirecting = false;
              failedUrls.clear();
            }, 3000);
          }, 200);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
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
    // Creamos una nueva configuración que no sobrescriba los headers de autorización
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
    };
    
    // Si hay headers personalizados, los combinamos con los existentes sin sobrescribir la autorización
    if (options.headers) {
      config.headers = {
        ...options.headers
      };
    }
    
    const response = await axiosInstance(config);
    
    return {
      data: response.data.data,
      error: null,
      message: response.data.message,
      success: response.data.success,
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
