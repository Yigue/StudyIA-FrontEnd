import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API } from '../../@types';
import { ApiResponse, ApiError } from '../../types';
import { Params } from '../../types';

// Sistema de caché para peticiones GET
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<API.ApiResponse<unknown>>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos

  public get<T>(key: string): API.ApiResponse<T> | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Verificar si el ítem ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as API.ApiResponse<T>;
  }

  public set<T>(key: string, data: API.ApiResponse<T>, ttl = this.DEFAULT_TTL): void {
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

  public generateKey(endpoint: string, params?: API.Params): string {
    return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
  }
}

// Instancia singleton del caché
export const apiCache = new ApiCache();

// Obtener la URL base de las variables de entorno o usar un valor por defecto
const baseURL = import.meta.env.VITE_API_BASEURL || 'http://localhost:3000/api';

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
    // Buscar el token directamente en localStorage
    const token = localStorage.getItem('token');
    
    // Debug: Verificar token y URL
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/auth/');
    
    if (isAuthEndpoint) {
      console.debug(`Petición a endpoint de auth: ${url} - Token presente: ${!!token}`);
    }
    
    if (token) {
      // Asegurarse de que config.headers exista
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // Debug: Confirmar que se ha añadido el token
      if (isAuthEndpoint) {
        console.debug('Token añadido a los headers de la petición');
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
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
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
    // Configurar el token en los headers por defecto de Axios
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Configurar también el formato en localStorage para redundancia
    localStorage.setItem('token', token);
    
    // Verificación de configuración
    console.debug('Token configurado correctamente en Axios');
  } else {
    // Eliminar el token de los headers
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // También eliminar de localStorage
    localStorage.removeItem('token');
    
    console.debug('Token eliminado de Axios');
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
): Promise<API.ApiResponse<TResponse>> {
  const method = options.method || 'GET';
  
  // No usar caché para endpoints de autenticación
  const isAuthEndpoint = endpoint.includes('/auth/');
  const useCache = method === 'GET' && !options.skipCache && !isAuthEndpoint;
  
  // Solo usar caché para peticiones GET no relacionadas con autenticación
  if (useCache) {
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
    
    // Manejo flexible de la respuesta - verificamos si tiene una estructura estándar de API
    // o si los datos están directamente en la respuesta
    let responseData: API.ApiResponse<TResponse>;
    
    if (response.data && typeof response.data === 'object' && 'status' in response.data) {
      // La respuesta ya tiene el formato esperado
      responseData = {
        data: response.data.data,
        status: response.data.status,
        message: response.data.message || '',
        meta: response.data.meta
      };
    } else {
      // La respuesta no tiene el formato esperado, lo adaptamos
      
      responseData = {
        data: response.data.data as unknown as TResponse,
        status: "success",
        message: "",
        meta: undefined
      };
    }
    
    // Guardar en caché solo si corresponde
    if (useCache) {
      const cacheKey = apiCache.generateKey(endpoint, options.params);
      apiCache.set<TResponse>(cacheKey, responseData, options.cacheTime);
    }
    
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error en petición ${method} a ${endpoint}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Error especial para problemas de CORS
      if (error.message && error.message.includes('Network Error')) {
        console.warn('Posible error de CORS detectado. Verifica la configuración del servidor.');
      }
      
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Ocurrió un error inesperado',
        code: error.response?.data?.code || error.response?.status || 500,
        status: "error"
      };
      throw apiError;
    }
    console.error(`Error no Axios en petición ${method} a ${endpoint}:`, error);
    throw error;
  }
}
