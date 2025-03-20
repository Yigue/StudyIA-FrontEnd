import { Save } from 'lucide-react';

interface SettingsHeaderProps {
  loading: boolean;
  onSave: () => void;
}

export const SettingsHeader = ({ loading, onSave }: SettingsHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
    <button
      onClick={onSave}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      <Save className="w-4 h-4" />
      {loading ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  </div>
);
