import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import NotificationTemplate, { NotificationVariant } from './NotificationTemplate';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  variant?: NotificationVariant;
  duration?: number;
  onClose?: () => void;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

// Componente individual de Toast
const Toast: React.FC<ToastProps & { removeToast: (id: string) => void }> = ({
  id,
  title,
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  removeToast
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeToast, onClose]);

  const handleClose = () => {
    removeToast(id);
    if (onClose) onClose();
  };

  // Selección del icono según la variante
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="transform transition-all duration-300 ease-in-out animate-slide-in">
      <NotificationTemplate
        title={title}
        message={message}
        variant={variant}
        icon={getIcon()}
        onClose={handleClose}
        className="mb-3 shadow-md"
      />
    </div>
  );
};

// Contenedor principal para todos los toasts
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'bottom-right',
  toasts,
  removeToast
}) => {
  // Determinar las clases de posición
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`fixed z-50 flex flex-col ${positionClasses[position]}`}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

// Crear el sistema de toasts
let toastPortalRoot: HTMLElement | null = null;

// Función para crear y gestionar toasts
export const createToast = (() => {
  let toasts: ToastProps[] = [];
  let setToastsState: React.Dispatch<React.SetStateAction<ToastProps[]>> | null = null;

  // Componente Portal para los toasts
  const ToastPortal: React.FC = () => {
    const [toastsState, setToasts] = useState<ToastProps[]>([]);
    
    useEffect(() => {
      setToastsState = setToasts;
      return () => {
        setToastsState = null;
      };
    }, []);

    const removeToast = (id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      toasts = toasts.filter(toast => toast.id !== id);
    };

    // Solo renderizar si hay toasts
    if (toastsState.length === 0) return null;

    return createPortal(
      <ToastContainer toasts={toastsState} removeToast={removeToast} position="bottom-right" />,
      document.body
    );
  };

  // Asegurar que solo hay un portal
  if (typeof document !== 'undefined' && !toastPortalRoot) {
    const div = document.createElement('div');
    div.id = 'toast-portal';
    document.body.appendChild(div);
    toastPortalRoot = div;
    
    const root = document.createElement('div');
    toastPortalRoot.appendChild(root);
    
    // Renderizar el componente Portal usando createRoot directamente
    createRoot(root).render(<ToastPortal />);
  }

  // Función para mostrar un toast
  return {
    success: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'title' | 'message' | 'variant'>>) => {
      const newToast: ToastProps = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        variant: 'success',
        ...options
      };
      
      toasts.push(newToast);
      if (setToastsState) setToastsState([...toasts]);
    },
    
    error: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'title' | 'message' | 'variant'>>) => {
      const newToast: ToastProps = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        variant: 'error',
        ...options
      };
      
      toasts.push(newToast);
      if (setToastsState) setToastsState([...toasts]);
    },
    
    warning: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'title' | 'message' | 'variant'>>) => {
      const newToast: ToastProps = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        variant: 'warning',
        ...options
      };
      
      toasts.push(newToast);
      if (setToastsState) setToastsState([...toasts]);
    },
    
    info: (title: string, message?: string, options?: Partial<Omit<ToastProps, 'id' | 'title' | 'message' | 'variant'>>) => {
      const newToast: ToastProps = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        variant: 'info',
        ...options
      };
      
      toasts.push(newToast);
      if (setToastsState) setToastsState([...toasts]);
    },
    
    dismiss: (id: string) => {
      toasts = toasts.filter(toast => toast.id !== id);
      if (setToastsState) setToastsState([...toasts]);
    },
    
    dismissAll: () => {
      toasts = [];
      if (setToastsState) setToastsState([]);
    }
  };
})();

// Exportamos el componente Toast para uso en aplicaciones que necesitan customización
export default Toast;
