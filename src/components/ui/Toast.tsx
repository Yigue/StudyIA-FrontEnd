import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  autoClose?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  duration = 5000,
  position = 'top-right',
  onClose,
  autoClose = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  // Configuraciones según el tipo
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-500 dark:border-green-700',
      iconColor: 'text-green-500 dark:text-green-400',
      progressColor: 'bg-green-500 dark:bg-green-400',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-300',
      borderColor: 'border-red-500 dark:border-red-700',
      iconColor: 'text-red-500 dark:text-red-400',
      progressColor: 'bg-red-500 dark:bg-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      borderColor: 'border-yellow-500 dark:border-yellow-700',
      iconColor: 'text-yellow-500 dark:text-yellow-400',
      progressColor: 'bg-yellow-500 dark:bg-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-300',
      borderColor: 'border-blue-500 dark:border-blue-700',
      iconColor: 'text-blue-500 dark:text-blue-400',
      progressColor: 'bg-blue-500 dark:bg-blue-400',
    },
  };
  
  const config = configs[type];
  const Icon = config.icon;
  
  // Manejar posición
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  
  // Cerrar el toast
  const closeToast = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }
  };
  
  // Auto-cerrar después de la duración
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    if (autoClose) {
      const intervalDuration = 10; // actualizar cada 10ms
      const steps = duration / intervalDuration;
      const decrementSize = 100 / steps;
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - decrementSize;
          return newProgress > 0 ? newProgress : 0;
        });
      }, intervalDuration);
      
      timeoutId = setTimeout(closeToast, duration);
    }
    
    return () => {
      if (autoClose) {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
      }
    };
  }, [autoClose, duration]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed z-50 ${positionClasses[position]} max-w-sm transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      }`}
    >
      <div className={`p-4 rounded-lg shadow-lg border ${config.bgColor} ${config.borderColor} flex items-start`}>
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`ml-3 flex-grow ${config.textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={closeToast}
          className={`ml-4 flex-shrink-0 ${config.textColor} focus:outline-none`}
        >
          <X className="w-4 h-4" />
        </button>
        
        {autoClose && (
          <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-lg overflow-hidden">
            <div 
              className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Sistema de gestión de toasts
type ToastOptions = Partial<Omit<ToastProps, 'message' | 'type'>> & { id?: string };

interface ToastItem extends ToastProps {
  id: string;
}

let toasts: ToastItem[] = [];
let listeners: ((toasts: ToastItem[]) => void)[] = [];

// Generar un ID único
const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Funciones para manipular toasts
export const toast = {
  show: (message: string, type: ToastType = 'info', options: ToastOptions = {}): string => {
    const id = options.id || generateId();
    const newToast = { id, message, type, ...options };
    
    toasts = [...toasts, newToast];
    listeners.forEach(listener => listener(toasts));
    
    return id;
  },
  
  success: (message: string, options: ToastOptions = {}): string => 
    toast.show(message, 'success', options),
  
  error: (message: string, options: ToastOptions = {}): string => 
    toast.show(message, 'error', options),
  
  warning: (message: string, options: ToastOptions = {}): string => 
    toast.show(message, 'warning', options),
  
  info: (message: string, options: ToastOptions = {}): string => 
    toast.show(message, 'info', options),
  
  dismiss: (id: string): void => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  },
  
  dismissAll: (): void => {
    toasts = [];
    listeners.forEach(listener => listener(toasts));
  },
  
  // Para suscribirse a cambios en los toasts
  subscribe: (listener: (toasts: ToastItem[]) => void): (() => void) => {
    listeners.push(listener);
    listener(toasts); // Notificar inmediatamente
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

// Componente para mostrar todos los toasts activos
export const ToastContainer: React.FC<{
  position?: ToastProps['position']
}> = ({ position = 'top-right' }) => {
  const [visibleToasts, setVisibleToasts] = useState<ToastItem[]>([]);
  
  useEffect(() => {
    // Suscribirse a cambios en los toasts
    const unsubscribe = toast.subscribe(setVisibleToasts);
    return unsubscribe;
  }, []);
  
  return (
    <>
      {visibleToasts.map(toastProps => (
        <Toast 
          key={toastProps.id}
          {...toastProps}
          position={position}
          onClose={() => toast.dismiss(toastProps.id)} 
        />
      ))}
    </>
  );
};

export default Toast; 