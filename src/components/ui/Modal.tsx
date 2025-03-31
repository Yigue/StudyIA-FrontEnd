import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  /**
   * Determina si el modal está visible
   */
  isOpen: boolean;
  /**
   * Función que se ejecuta al cerrar el modal
   */
  onClose: () => void;
  /**
   * Título del modal (opcional)
   */
  title?: React.ReactNode;
  /**
   * Contenido del modal
   */
  children: React.ReactNode;
  /**
   * Determina si se debe mostrar un botón de cierre
   */
  showCloseButton?: boolean;
  /**
   * Determina si se debe cerrar el modal al hacer clic fuera de él
   */
  closeOnClickOutside?: boolean;
  /**
   * Determina si se debe cerrar el modal al presionar la tecla Escape
   */
  closeOnEsc?: boolean;
  /**
   * Tamaño del modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Clase adicional para el contenedor del modal
   */
  className?: string;
  /**
   * Clase adicional para el fondo del modal
   */
  backdropClassName?: string;
  /**
   * Componente de footer (opcional)
   */
  footer?: React.ReactNode;
  /**
   * Posición del modal
   */
  position?: 'center' | 'top';
  /**
   * Determina si se debe mostrar un fondo oscuro
   */
  showBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  size = 'md',
  className,
  backdropClassName,
  footer,
  position = 'center',
  showBackdrop = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Manejar el cierre al presionar Escape
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (closeOnEsc && event.key === 'Escape') {
      onClose();
    }
  }, [closeOnEsc, onClose]);
  
  // Añadir y eliminar el listener de teclado
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevenir el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      
      // Trigger animation
      setIsAnimating(true);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restaurar el scroll del body
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);
  
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full min-h-screen w-full rounded-none',
  };
  
  // Mapeo de posiciones
  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-16',
  };
  
  // Manejar el clic en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center',
        positionClasses[position],
        backdropClassName
      )}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      {showBackdrop && (
        <div 
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )} 
        />
      )}
      
      {/* Modal container */}
      <div
        className={cn(
          'relative z-50 m-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full overflow-hidden',
          sizeClasses[size],
          'transition-all duration-200',
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 className="text-xl font-semibold dark:text-gray-100">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 