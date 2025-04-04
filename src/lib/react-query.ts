import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '../types';

// Función centralizada de manejo de errores
const handleQueryError = (error: unknown) => {
  const apiError = error as ApiError;
  
  // Errores que no mostraremos al usuario (401 se maneja en otro lugar)
  if (apiError.code === 401) {
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
}); 