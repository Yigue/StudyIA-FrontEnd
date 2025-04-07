import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useStudyContext } from '../context/StudyContext';

/**
 * Componente para mostrar errores y mensajes de éxito
 */
const NotificationCenter: React.FC = () => {
  const { state, dispatch } = useStudyContext();
  const { error, showSuccess } = state;
  
  // Función para cerrar un error
  const handleCloseError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };
  
  // Función para cerrar un mensaje de éxito
  const handleCloseSuccess = () => {
    dispatch({ type: 'SHOW_SUCCESS', payload: false });
  };
  
  if (!error && !showSuccess) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="min-w-5 w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="flex-1 text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleCloseError}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn dark:bg-green-900/20 dark:border-green-800">
          <Check className="min-w-5 w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="flex-1 text-green-600 dark:text-green-400">
            ¡Material procesado correctamente! Los resultados se mostrarán a continuación.
          </p>
          <button
            onClick={handleCloseSuccess}
            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 