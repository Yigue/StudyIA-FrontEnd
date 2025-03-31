import React from 'react';
import { User } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tu Perfil
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Actualiza tu información personal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <input
            type="text"
            className="input-base w-full"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            className="input-base w-full"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Biografía
          </label>
          <textarea
            className="input-base w-full"
            rows={4}
            placeholder="Cuéntanos sobre ti..."
          />
        </div>
      </div>
    </div>
  );
};
