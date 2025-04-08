import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../ui';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  position = 'center',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  // Gestionar efecto de montaje para SSR
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Manejador para cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Clases para tamaños
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full m-4'
  };

  // Clases para posición
  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-10'
  };

  // Si no está montado o no está abierto, no renderizar
  if (!mounted || !isOpen) return null;

  // Renderizar el modal en un portal
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div 
        className={`flex ${positionClasses[position]} justify-center w-full h-full p-4`} 
      >
        <div 
          className={`relative ${sizeClasses[size]} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all ${className}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Cabecera */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                  onClick={onClose}
                >
                  <X size={20} />
                  <span className="sr-only">Cerrar</span>
                </button>
              )}
            </div>
          )}

          {/* Contenido */}
          <div className="p-4 overflow-auto max-h-[calc(100vh-10rem)]">
            {children}
          </div>

          {/* Pie */}
          {footer && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Componente de confirmación con botones predefinidos
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </Modal>
  );
};

// Componente de formulario con botones predefinidos
export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: ModalProps['size'];
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  isLoading = false,
  size = 'md'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </Button>
          <Button 
            variant="default"
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
            form="modal-form"
          >
            {submitText}
          </Button>
        </>
      }
    >
      <form id="modal-form" onSubmit={onSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default Modal;
