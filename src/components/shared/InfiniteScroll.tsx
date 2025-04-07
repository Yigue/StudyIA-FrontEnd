import React, { useEffect, useRef, ReactNode } from 'react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { Loading, SpinnerInline } from './LoadingStates';
import { AlertCircle } from 'lucide-react';

interface InfiniteScrollProps<TData, TError> {
  /** Consulta infinita de React Query */
  query: UseInfiniteQueryResult<TData, TError>;
  /** Función para extraer items de cada página */
  getItems: (page: TData) => any[];
  /** Renderiza cada página de datos */
  children: (items: any[]) => ReactNode;
  /** Texto de carga inicial */
  loadingText?: string;
  /** Texto cuando hay un error */
  errorText?: string;
  /** Texto cuando no hay más datos */
  endMessage?: ReactNode;
  /** Umbral de píxeles para iniciar carga (observador de intersección) */
  threshold?: number;
  /** Clase CSS para el contenedor principal */
  className?: string;
  /** Componente a mostrar durante la carga de más contenido */
  loadingComponent?: ReactNode;
  /** Componente a mostrar en error */
  errorComponent?: ReactNode;
  /** Si se debe usar botón en lugar de scroll para cargar más */
  useButton?: boolean;
  /** Texto para el botón de cargar más */
  buttonText?: string;
}

/**
 * Componente para manejar carga infinita con React Query
 */
function InfiniteScroll<TData, TError = Error>({
  query,
  getItems,
  children,
  loadingText = 'Cargando...',
  errorText = 'Error al cargar los datos',
  endMessage = <p className="text-center text-gray-500 dark:text-gray-400 my-6">No hay más resultados</p>,
  threshold = 300,
  className = '',
  loadingComponent,
  errorComponent,
  useButton = false,
  buttonText = 'Cargar más',
}: InfiniteScrollProps<TData, TError>) {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = query;
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Configurar Intersection Observer para detectar cuando se acerca al final
  useEffect(() => {
    if (isLoading || !hasNextPage || useButton) return;
    
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    
    const options = {
      root: null,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1,
    };
    
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, threshold, useButton]);
  
  // Renderizar estado de carga inicial
  if (isLoading) {
    return loadingComponent || (
      <div className="my-8 flex justify-center">
        <Loading text={loadingText} size="lg" />
      </div>
    );
  }

  // Renderizar estado de error
  if (isError) {
    return errorComponent || (
      <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
        <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
          {errorText}
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm mb-3">
          {error instanceof Error ? error.message : 'Se produjo un error inesperado'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Si no hay datos, no renderizar nada
  if (!data || !data.pages || data.pages.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      {/* Renderizar todas las páginas de datos */}
      {data.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {children(getItems(page))}
        </React.Fragment>
      ))}
      
      {/* Elemento para observar la intersección o botón para cargar más */}
      {hasNextPage ? (
        useButton ? (
          <div className="flex justify-center my-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <SpinnerInline size="sm" className="text-white" />
                  <span>Cargando...</span>
                </>
              ) : (
                buttonText
              )}
            </button>
          </div>
        ) : (
          <div ref={loadMoreRef} className="py-4 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <SpinnerInline />
                <span className="text-sm font-medium">Cargando más...</span>
              </div>
            )}
          </div>
        )
      ) : (
        data.pages.length > 0 && endMessage
      )}
    </div>
  );
}

export default InfiniteScroll; 