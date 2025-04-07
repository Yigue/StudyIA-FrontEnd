import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente para capturar errores en la aplicación y mostrar un fallback UI
 * Integrado con React Query para manejar errores de consulta
 */
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar el error
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    // Llamar al callback onError si existe
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Usar el fallback proporcionado o mostrar UI por defecto
      return fallback || (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            Ha ocurrido un error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4 max-w-md">
            {error?.message || 'Se produjo un error inesperado. Por favor, intenta nuevamente.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset?.();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Componente wrapper que integra ErrorBoundary con React Query
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ErrorBoundaryClass
      {...props}
      onReset={() => {
        reset();
        props.onReset?.();
      }}
    />
  );
};

/**
 * Componente para errores de consulta específicos
 */
export const QueryErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ErrorBoundaryClass
      {...props}
      onReset={() => {
        reset();
        props.onReset?.();
      }}
      fallback={
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 dark:text-yellow-400 mb-2 mx-auto" />
          <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300 mb-1">
            Error al cargar datos
          </h3>
          <p className="text-yellow-600 dark:text-yellow-300 mb-3 text-sm">
            {props.fallback || 'No se pudieron cargar los datos. Por favor, intenta nuevamente.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-md flex items-center mx-auto"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reintentar
          </button>
        </div>
      }
    />
  );
};

export default ErrorBoundary; 