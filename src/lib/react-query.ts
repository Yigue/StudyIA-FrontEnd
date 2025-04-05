import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '../types';

// Función centralizada de manejo de errores con posible integración con sistema de notificaciones
const handleQueryError = (error: unknown) => {
  const apiError = error as unknown as ApiError;
  
  // Errores específicos que queremos manejar de forma diferente
  if (apiError.code === 401) {
    // El token ha expirado o el usuario no está autenticado
    // Podríamos redirigir al login o refrescar token automáticamente
    console.warn('Sesión expirada, redirigiendo...');
    return;
  }
  
  if (apiError.code === 403) {
    console.error('No tiene permisos para realizar esta acción');
    return;
  }
  
  if (apiError.code === 429) {
    console.error('Demasiadas solicitudes, intente más tarde');
    return;
  }
  
  // Para otros errores, podríamos usar un sistema de notificaciones
  console.error('Error de Query:', apiError.message || 'Error desconocido');
  
  // Aquí podrías integrar con un sistema de notificaciones:
  // toast.error(apiError.message || 'Ha ocurrido un error inesperado')
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleQueryError,
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos por defecto
      gcTime: 10 * 60 * 1000, // 10 minutos por defecto (antes cacheTime)
      retry: (failureCount, error: Error) => {
        // Personalizar los reintentos basado en el error o número de intentos
        const apiError = error as unknown as ApiError;
        
        // No reintentar para errores 4xx excepto problemas de red
        if (apiError.code && apiError.code >= 400 && apiError.code < 500) {
          return false;
        }
        
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      refetchOnWindowFocus: true, // Refrescar datos cuando la ventana recupera el foco
      refetchOnReconnect: true, // Refrescar cuando se restablece la conexión
      refetchOnMount: true, // Refrescar cuando el componente se monta
    },
    mutations: {
      retry: false, // No reintentar mutaciones fallidas por defecto
      onSuccess: () => {
        // Celebrar el éxito (opcional)
      }
    }
  },
}); 