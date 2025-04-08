import React from 'react';
import { AlertTriangle } from 'lucide-react';
import NotificationTemplate from './NotificationTemplate';
import { Button } from '../ui';

interface WarningNotificationProps {
  title?: string;
  message: string;
  onClose?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const WarningNotification: React.FC<WarningNotificationProps> = ({
  title = 'Advertencia',
  message,
  onClose,
  onAction,
  actionLabel = 'Entendido',
  className = '',
}) => {
  return (
    <NotificationTemplate
      title={title}
      message={message}
      variant="warning"
      icon={<AlertTriangle size={20} />}
      onClose={onClose}
      className={className}
      actions={onAction && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    />
  );
};

export default WarningNotification;
