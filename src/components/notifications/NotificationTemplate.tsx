import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info' | 'delete';

interface NotificationTemplateProps {
  title: string;
  message?: string;
  variant?: NotificationVariant;
  icon?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
  duration?: number;
  className?: string;
}

const variantStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    title: 'text-green-800 dark:text-green-300',
    message: 'text-green-700 dark:text-green-400',
    icon: 'text-green-500 dark:text-green-400'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    title: 'text-red-800 dark:text-red-300',
    message: 'text-red-700 dark:text-red-400',
    icon: 'text-red-500 dark:text-red-400'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    title: 'text-yellow-800 dark:text-yellow-300',
    message: 'text-yellow-700 dark:text-yellow-400',
    icon: 'text-yellow-500 dark:text-yellow-400'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500 dark:text-blue-400'
  },
  delete: {
    container: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    title: 'text-gray-800 dark:text-gray-200',
    message: 'text-gray-700 dark:text-gray-300',
    icon: 'text-gray-500 dark:text-gray-400'
  }
};

const NotificationTemplate: React.FC<NotificationTemplateProps> = ({
  title,
  message,
  variant = 'info',
  icon,
  onClose,
  actions,
  className = '',
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={`rounded-lg border shadow-sm p-4 max-w-md w-full flex ${styles.container} ${className}`}>
      {icon && (
        <div className={`mr-3 shrink-0 ${styles.icon}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-auto -mr-1.5 -mt-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none"
            >
              <X size={16} />
              <span className="sr-only">Cerrar</span>
            </button>
          )}
        </div>
        
        {message && (
          <div className={`mt-1 text-sm ${styles.message}`}>
            {message}
          </div>
        )}
        
        {actions && (
          <div className="mt-3 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTemplate;
