import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsHeaderProps {
  loading?: boolean;
  onSave?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  loading = false,
  onSave,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Configuración
        </h1>
      </div>
      
      {onSave && (
        <button
          onClick={onSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⌛</span>
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      )}
    </div>
  );
};
