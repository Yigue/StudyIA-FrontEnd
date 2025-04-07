import React, { ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Loading } from './LoadingStates';
import { AlertCircle, FileWarning } from 'lucide-react';

interface QueryWrapperProps<TData, TError> {
  /** Resultado de la consulta de React Query */
  query: UseQueryResult<TData, TError>;
  /** Componente a renderizar cuando los datos están cargados */
  children: ReactNode | ((data: TData) => ReactNode);
  /** Mensaje personalizado para estado de carga */
  loadingText?: string;
  /** Mensaje personalizado para estado de error */
  errorText?: string;
  /** Mensaje personalizado para datos vacíos */
  emptyText?: string;
  /** Función para verificar si los datos están vacíos */
  isDataEmpty?: (data: TData) => boolean;
  /** Componente personalizado para estado de carga */
  loadingComponent?: ReactNode;
  /** Componente personalizado para estado de error */
  errorComponent?: ReactNode;
  /** Componente personalizado para datos vacíos */
  emptyComponent?: ReactNode;
  /** Contenedor a aplicar alrededor del contenido */
  wrapper?: (content: ReactNode) => ReactNode;
  /** Si se debe mostrar el estado de recarga */
  showRefetching?: boolean;
  /** Callback para reintentar en caso de error */
  onRetry?: () => void;
}

/**
 * Componente que encapsula una consulta de React Query y maneja sus estados
 */
export function QueryWrapper<TData, TError = Error>({
  query,
  children,
  loadingText = 'Cargando datos...',
  errorText,
  emptyText = 'No hay datos disponibles',
  isDataEmpty = (data) => Array.isArray(data) ? data.length === 0 : !data,
  loadingComponent,
  errorComponent,
  emptyComponent,
  wrapper = (content) => content,
  showRefetching = false,
  onRetry,
}: QueryWrapperProps<TData, TError>) {
  const { data, isLoading, isError, error, refetch } = query;

  // Si está cargando, mostrar estado de carga
  if (isLoading) {
    return wrapper(
      loadingComponent || <Loading text={loadingText} size="md" className="my-8" />
    );
  }

  // Si hay error, mostrar estado de error
  if (isError) {
    return wrapper(
      errorComponent || (
        <div className="my-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-2" />
          <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
            {errorText || 'Error al cargar los datos'}
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4 max-w-md">
            {error instanceof Error ? error.message : 'Se produjo un error inesperado'}
          </p>
          {onRetry && (
            <button
              onClick={() => {
                refetch();
                onRetry();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      )
    );
  }

  // Si los datos están vacíos, mostrar estado vacío
  if (data && isDataEmpty(data)) {
    return wrapper(
      emptyComponent || (
        <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
          <FileWarning className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {emptyText}
          </p>
        </div>
      )
    );
  }

  // Renderizar los datos
  // Si estamos recargando y showRefetching es true, mostrar indicador
  const content = typeof children === 'function' ? children(data!) : children;
  
  return wrapper(
    <>
      {content}
      {query.isFetching && showRefetching && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2">
          <Loading size="xs" className="text-white" />
          <span className="text-sm">Actualizando...</span>
        </div>
      )}
    </>
  );
}

/**
 * Variante simplificada para listas que maneja automáticamente la paginación
 */
export function ListQueryWrapper<TItem, TError = Error>({
  query,
  renderItem,
  keyExtractor,
  ...props
}: Omit<QueryWrapperProps<TItem[], TError>, 'children'> & {
  renderItem: (item: TItem, index: number) => ReactNode;
  keyExtractor: (item: TItem, index: number) => string | number;
}) {
  return (
    <QueryWrapper
      query={query}
      {...props}
    >
      {(data) => (
        <div className="space-y-2">
          {data.map((item, index) => (
            <React.Fragment key={keyExtractor(item, index)}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>
      )}
    </QueryWrapper>
  );
}

export default QueryWrapper; 