import React from 'react';
import { Button } from '../ui/Button';
import { FileQuestion } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface NotFoundPageProps {
  message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ 
  message = 'Lo sentimos, la página que estás buscando no existe o ha sido movida.'
}) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate({ to: '/dashboard' });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-full">
          <FileQuestion size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Página no encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {message}
        </p>
        <div className="flex justify-center">
          <Button onClick={handleGoHome} className="px-6">
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 