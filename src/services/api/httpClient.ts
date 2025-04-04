import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../../types';
import { Params } from '../../types';

// Sistema de caché para peticiones GET
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<ApiResponse<unknown>>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos

  public get<T>(key: string): ApiResponse<T> | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Verificar si el ítem ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as ApiResponse<T>;
  }

  public set<T>(key: string, data: ApiResponse<T>, ttl = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public generateKey(endpoint: string, params?: Params): string {
    return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
  }
}

// Instancia singleton del caché
export const apiCache = new ApiCache();

const baseURL = import.meta.env.VITE_API_BASEURL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // No enviamos credenciales por defecto para evitar conflictos con CORS
  withCredentials: false
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

export async function httpClient<TResponse, TRequest = null>(
  endpoint: string,
  options: {
    method?: string;
    data?: TRequest;
    headers?: Record<string, string>;
    params?: Params;
    withCredentials?: boolean;
    cacheTime?: number; // Tiempo de caché en ms (null para no cachear)
    skipCache?: boolean; // Opción para saltarse el caché
  } = {}
): Promise<ApiResponse<TResponse>> {
  const method = options.method || 'GET';
  
  // Solo usar caché para peticiones GET
  if (method === 'GET' && !options.skipCache) {
    const cacheKey = apiCache.generateKey(endpoint, options.params);
    const cachedData = apiCache.get<TResponse>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    // Creamos una nueva configuración que no sobrescriba los headers de autorización
    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: options.data,
      withCredentials: options.withCredentials,
      params: options.params
    };
    
    // Si hay headers personalizados, los combinamos con los existentes sin sobrescribir la autorización
    if (options.headers) {
      config.headers = {
        ...options.headers
      };
    }
    
    const response = await axiosInstance(config);
    
    const responseData: ApiResponse<TResponse> = {
      data: response.data.data,
      status: "success",
      message: response.data.message,
      meta: response.data.meta
    };
    
    // Guardar en caché solo si es GET y no se especificó skipCache
    if (method === 'GET' && !options.skipCache) {
      const cacheKey = apiCache.generateKey(endpoint, options.params);
      apiCache.set<TResponse>(cacheKey, responseData, options.cacheTime);
    }
    
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An unexpected error occurred',
        code: error.response?.data?.code || 500,
        status: "error"
      };
      throw apiError;
    }
    throw error;
  }
}
