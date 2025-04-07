import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  /** Número total de items */
  totalItems: number;
  /** Número de items por página */
  itemsPerPage: number;
  /** Página actual */
  currentPage: number;
  /** Callback cuando cambia la página */
  onPageChange: (page: number) => void;
  /** Mostrar contador de items */
  showItemCount?: boolean;
  /** Clases personalizadas */
  className?: string;
  /** Etiqueta para el contador de items */
  itemLabel?: string;
  /** Número de botones visibles (sin contar flechas) */
  maxVisibleButtons?: number;
  /** Si ya está en proceso de carga */
  isLoading?: boolean;
}

/**
 * Componente para paginación de resultados
 */
const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  showItemCount = true,
  className = '',
  itemLabel = 'item',
  maxVisibleButtons = 5,
  isLoading = false,
}) => {
  // Calcular el número total de páginas
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Validar la página actual
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  // Estados para mantener la página actual y rango de buttons
  const [page, setPage] = useState(validCurrentPage);
  
  // Sincronizar el estado interno con la prop
  useEffect(() => {
    setPage(validCurrentPage);
  }, [validCurrentPage]);

  // Manejar el cambio de página
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isLoading) return;
    setPage(newPage);
    onPageChange(newPage);
  };

  // Generar rango de botones a mostrar
  const getPageRange = () => {
    // Si hay pocas páginas, mostrar todas
    if (totalPages <= maxVisibleButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calcular puntos del rango basado en la página actual
    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = startPage + maxVisibleButtons - 1;
    
    // Ajustar si el rango supera el total de páginas
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    const range = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    
    // Añadir elipsis y extremos si es necesario
    const rangeWithDots: (number | string)[] = [];
    
    // Siempre mostrar primera página
    if (startPage > 1) {
      rangeWithDots.push(1);
    }
    
    // Añadir elipsis izquierda si hay brecha
    if (startPage > 2) {
      rangeWithDots.push('start-ellipsis');
    }
    
    // Añadir el rango principal
    rangeWithDots.push(...range);
    
    // Añadir elipsis derecha si hay brecha
    if (endPage < totalPages - 1) {
      rangeWithDots.push('end-ellipsis');
    }
    
    // Siempre mostrar última página
    if (endPage < totalPages) {
      rangeWithDots.push(totalPages);
    }
    
    return rangeWithDots;
  };

  // Calcular rangos de items para mostrar
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);
  
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 mt-4 ${className}`}>
      {/* Contador de items */}
      {showItemCount && totalItems > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> {itemLabel}
          {totalItems !== 1 ? 's' : ''}
        </div>
      )}
      
      {/* Botones de paginación */}
      <div className="flex items-center space-x-1">
        {/* Botón anterior */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className={`p-2 rounded-md flex items-center justify-center ${
            page === 1 || isLoading
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Números de página */}
        {getPageRange().map((pageNum, idx) => {
          // Renderizar elipsis
          if (typeof pageNum === 'string') {
            return (
              <span
                key={pageNum + '-' + idx}
                className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                <MoreHorizontal className="w-5 h-5" />
              </span>
            );
          }
          
          // Renderizar botón numérico
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={isLoading}
              className={`w-9 h-9 rounded-md flex items-center justify-center ${
                pageNum === page
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
              aria-label={`Página ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
        
        {/* Botón siguiente */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isLoading}
          className={`p-2 rounded-md flex items-center justify-center ${
            page === totalPages || isLoading
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination; 