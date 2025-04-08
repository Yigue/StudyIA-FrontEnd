import React from 'react';
import { AlertCircle } from 'lucide-react';
import NotificationTemplate from './NotificationTemplate';
import { Button } from '../ui';

interface ErrorNotificationProps {
  title?: string;
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  className?: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  title = 'Error',
  message,
  onClose,
  onRetry,
  className = '',
}) => {
  return (
    <NotificationTemplate
      title={title}
      message={message}
      variant="error"
      icon={<AlertCircle size={20} />}
      onClose={onClose}
      className={className}
      actions={onRetry && (
        <Button 
          size="sm" 
          variant="default"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      )}
    />
  );
};

export default ErrorNotification;
