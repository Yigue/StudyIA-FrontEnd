import { useEffect, useRef, useCallback } from 'react';
import { 
  UseInfiniteQueryResult, 
  InfiniteData, 
  FetchNextPageOptions 
} from '@tanstack/react-query';

interface UseInfiniteScrollOptions {
  /**
   * Elemento objetivo para observar el scroll (por defecto, window)
   */
  target?: React.RefObject<HTMLElement> | null;
  
  /**
   * Distancia en píxeles desde el final del contenido para cargar más datos
   */
  threshold?: number;
  
  /**
   * Si se debe habilitar la carga automática
   */
  enabled?: boolean;
  
  /**
   * Opciones adicionales para fetchNextPage
   */
  fetchNextPageOptions?: FetchNextPageOptions;
  
  /**
   * Callback opcional a ejecutar después de cargar la siguiente página
   */
  onFetchNextPage?: () => void;
}

/**
 * Hook personalizado para implementar scroll infinito compatible con React Query
 * 
 * @param query Resultado de useInfiniteQuery
 * @param options Opciones de configuración
 * @returns Objeto con la referencia y funciones útiles
 */
export function useInfiniteScroll<TData, TError>(
  query: UseInfiniteQueryResult<TData, TError>,
  options?: UseInfiniteScrollOptions
) {
  const {
    target = null,
    threshold = 200,
    enabled = true,
    fetchNextPageOptions,
    onFetchNextPage
  } = options || {};
  
  // Referencia al elemento contenedor (si no se proporciona target)
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Referencia para rastrear si estamos cargando actualmente
  const isLoadingRef = useRef(false);
  
  // Accedemos a las propiedades de la consulta
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data
  } = query;
  
  // Función para comprobar si estamos cerca del final
  const checkScrollPosition = useCallback(() => {
    // Si la carga está deshabilitada o ya estamos cargando, no hacer nada
    if (!enabled || isLoadingRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }
    
    // Determinar el elemento a observar
    const element = target?.current || containerRef.current;
    
    // Si no hay elemento, usar window scroll
    if (!element) {
      const { scrollTop, clientHeight, scrollHeight } = 
        document.documentElement || document.body;
      
      // Si estamos cerca del final, cargar más contenido
      if (scrollHeight - scrollTop - clientHeight <= threshold) {
        isLoadingRef.current = true;
        fetchNextPage(fetchNextPageOptions).then(() => {
          isLoadingRef.current = false;
          if (onFetchNextPage) {
            onFetchNextPage();
          }
        }).catch(() => {
          isLoadingRef.current = false;
        });
      }
      return;
    }
    
    // Si hay un elemento específico, comprobar su posición
    const { scrollTop, clientHeight, scrollHeight } = element;
    
    // Si estamos cerca del final, cargar más contenido
    if (scrollHeight - scrollTop - clientHeight <= threshold) {
      isLoadingRef.current = true;
      fetchNextPage(fetchNextPageOptions).then(() => {
        isLoadingRef.current = false;
        if (onFetchNextPage) {
          onFetchNextPage();
        }
      }).catch(() => {
        isLoadingRef.current = false;
      });
    }
  }, [
    enabled,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchNextPageOptions,
    threshold,
    target,
    onFetchNextPage
  ]);
  
  // Efecto para observar el scroll
  useEffect(() => {
    // Si la carga está deshabilitada, no hacer nada
    if (!enabled) {
      return;
    }
    
    // Determinar el elemento objetivo para escuchar el evento
    const scrollElement = target?.current ?? window;
    
    // Añadir event listener para scroll
    scrollElement.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Verificar al montar por si la primera página no llena la pantalla
    checkScrollPosition();
    
    // Limpiar listener al desmontar
    return () => {
      scrollElement.removeEventListener('scroll', checkScrollPosition);
    };
  }, [enabled, checkScrollPosition, target]);
  
  // Resetear la carga cuando cambian los datos
  useEffect(() => {
    isLoadingRef.current = false;
  }, [data]);
  
  // Función para cargar la siguiente página manualmente
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasNextPage && !isFetchingNextPage) {
      isLoadingRef.current = true;
      fetchNextPage(fetchNextPageOptions).then(() => {
        isLoadingRef.current = false;
        if (onFetchNextPage) {
          onFetchNextPage();
        }
      }).catch(() => {
        isLoadingRef.current = false;
      });
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchNextPageOptions,
    onFetchNextPage
  ]);
  
  // Extraer todos los elementos de todas las páginas
  const extractAllItems = useCallback(<TItem>(
    data: InfiniteData<TItem[]> | undefined
  ): TItem[] => {
    if (!data) {
      return [];
    }
    
    return data.pages.reduce<TItem[]>((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, []);
  
  return {
    ref: containerRef,
    loadMore,
    isLoadingMore: isFetchingNextPage,
    hasNextPage,
    extractAllItems
  };
}

export default useInfiniteScroll; 