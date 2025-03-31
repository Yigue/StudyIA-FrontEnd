import React from 'react';
import { Lock, Key, Trash2 } from 'lucide-react';
import { useAuthActions } from "../../../../hook/useAuth";

export const AccountSection: React.FC = () => {
  const {logout} = useAuthActions();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seguridad de la Cuenta
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona tu contraseña y seguridad
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type="password"
              className="input-base w-full pr-10"
              placeholder="••••••••"
            />
            <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              className="input-base w-full pr-10"
              placeholder="••••••••"
            />
            <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              className="input-base w-full pr-10"
              placeholder="••••••••"
            />
            <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="btn-danger flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

