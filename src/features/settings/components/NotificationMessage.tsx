import React from 'react';
import { X } from 'lucide-react';

interface NotificationMessageProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const NotificationMessage: React.FC<NotificationMessageProps> = ({
  type,
  message,
  onClose,
}) => {
  const baseClasses = "flex items-center justify-between p-4 rounded-lg mb-4";
  const typeClasses = type === 'success'
    ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
    : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-current hover:opacity-70 transition-opacity"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
