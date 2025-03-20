import { Moon, Sun } from 'lucide-react';
import { UserSettings } from '../../types/settings.types';

interface AppearanceSectionProps {
  settings: UserSettings;
  onSettingChange: (key: keyof UserSettings, value:any) => void;
}

export const AppearanceSection = ({ settings, onSettingChange }: AppearanceSectionProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Apariencia</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>Modo Oscuro</span>
        </div>
        <button
          onClick={() => onSettingChange('darkMode', !settings.darkMode)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            settings.darkMode ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            settings.darkMode ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema de Color
        </label>
        <select
          value={settings.theme}
          onChange={(e) => onSettingChange('theme', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="indigo">Índigo</option>
          <option value="blue">Azul</option>
          <option value="green">Verde</option>
          <option value="purple">Púrpura</option>
        </select>
      </div>
    </div>
  </div>
);

