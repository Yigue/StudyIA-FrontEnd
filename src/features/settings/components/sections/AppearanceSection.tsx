import React from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../../../components/ui/useTheme';


export const AppearanceSection: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
          <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Apariencia
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personaliza la apariencia de la aplicación
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tema
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => toggleTheme()}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Sun className={`w-6 h-6 ${
              theme === 'light'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 dark:text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'light'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Claro
            </span>
          </button>

          <button
            onClick={() => toggleTheme()}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Moon className={`w-6 h-6 ${
              theme === 'dark'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 dark:text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'dark'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Oscuro
            </span>
          </button>

          <button
            onClick={() => toggleTheme()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            "
          >
            <Monitor className={`w-6 h-6  'text-indigo-600 dark:text-indigo-400'
                
            }`} />
            <span className={`text-sm font-medium ${
          'text-indigo-600 dark:text-indigo-400'
   
            }`}>
              Sistema
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

