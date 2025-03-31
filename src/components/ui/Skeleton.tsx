import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  direction?: 'row' | 'column';
  gap?: number | string;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '16px',
  borderRadius = '0.375rem',
  count = 1,
  direction = 'column',
  gap = '0.5rem',
  animate = true
}) => {
  // Convertir los valores numéricos a px
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
  
  // Estilos base para un item skeleton
  const itemStyle = {
    width: widthValue,
    height: heightValue,
    borderRadius,
  };
  
  // Estilos para el contenedor, dependiendo de la dirección
  const containerStyle = {
    display: 'flex',
    gap: gapValue,
    flexDirection: direction as 'row' | 'column',
  };
  
  // Generar los elementos skeleton según el count
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`bg-gray-200 dark:bg-gray-700 ${animate ? 'animate-pulse' : ''} ${className}`}
      style={itemStyle}
      role="status"
      aria-label="Cargando..."
    />
  ));
  
  return (
    <div style={containerStyle}>
      {skeletonItems}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-card animate-pulse">
      <div className="flex gap-4 items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="w-6 h-6"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton; 