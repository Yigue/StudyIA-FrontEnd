import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  /** Texto a mostrar, opcional */
  text?: string;
  /** Tamaño del componente, por defecto md */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Colores personalizados */
  className?: string;
  /** Si es fullscreen */
  fullscreen?: boolean;
  /** Si debe mostrar un overlay */
  overlay?: boolean;
}

/**
 * Componente de carga genérico con spinner
 */
export const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'md',
  className = '',
  fullscreen = false,
  overlay = false,
}) => {
  // Tamaños del spinner
  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Clases base para el spinner
  const spinnerClasses = `animate-spin ${spinnerSizes[size]} text-indigo-600 dark:text-indigo-400 ${className}`;

  // Contenido de carga con o sin texto
  const loadingContent = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={spinnerClasses} />
      {text && (
        <p className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  // Si es fullscreen, centrar en la pantalla
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        {loadingContent}
      </div>
    );
  }

  // Si es overlay, centrar en el contenedor con fondo semitransparente
  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg z-10">
        {loadingContent}
      </div>
    );
  }

  // Por defecto, solo el spinner
  return loadingContent;
};

/**
 * Componente de carga para tarjetas o secciones
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 p-4 ${className}`}
    >
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
  );
};

/**
 * Componente de carga para listas
 */
export const ListSkeleton: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente de carga para tablas
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ 
  rows = 5,
  cols = 4,
  className = '',
}) => {
  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="bg-gray-100 dark:bg-gray-800 flex">
          {Array.from({ length: cols }).map((_, index) => (
            <div key={`header-${index}`} className="p-4 flex-1">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        {/* Filas */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="flex border-t border-gray-200 dark:border-gray-700"
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="p-4 flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente de carga para formularios
 */
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 4,
  className = '',
}) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-indigo-200 dark:bg-indigo-900 rounded w-1/3 mt-6"></div>
    </div>
  );
};

/**
 * Componente para mostrar spinner inline en botones o textos
 */
export const SpinnerInline: React.FC<{ size?: 'xs' | 'sm' | 'md'; className?: string }> = ({ 
  size = 'sm',
  className = '',
}) => {
  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <Loader2 className={`animate-spin ${spinnerSizes[size]} ${className}`} />
  );
};

export default Loading; 