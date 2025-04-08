import React from 'react';
import { Trash2 } from 'lucide-react';
import NotificationTemplate from './NotificationTemplate';
import { Button } from '../ui';

interface DeleteNotificationProps {
  title?: string;
  message?: string;
  itemName?: string;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

const DeleteNotification: React.FC<DeleteNotificationProps> = ({
  title = 'Confirmar eliminación',
  message,
  itemName,
  onDelete,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const defaultMessage = itemName 
    ? `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`
    : '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.';

  return (
    <NotificationTemplate
      title={title}
      message={message || defaultMessage}
      variant="delete"
      icon={<Trash2 size={20} />}
      onClose={onCancel}
      className={className}
      actions={
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Eliminar
          </Button>
        </div>
      }
    />
  );
};

export default DeleteNotification;
