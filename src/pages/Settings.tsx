import { useState } from 'react';
import { 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  Palette,
  UserCircle,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsSection {
  id: string;
  label: string;
  icon: any;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    studyReminders: true,
    sessionDuration: 25,
    theme: 'indigo',
  });

  const sections: SettingsSection[] = [
    { id: 'profile', label: 'Perfil', icon: UserCircle },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'study', label: 'Estudio', icon: Clock },
    { id: 'account', label: 'Cuenta', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Error al cerrar sesión'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Aquí implementarías la lógica para guardar en Supabase
      setNotification({
        type: 'success',
        message: 'Configuración guardada exitosamente'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Error al guardar la configuración'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Información del Perfil</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Biografía
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Apariencia</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span>Modo Oscuro</span>
                </div>
                <button
                  onClick={() => setSettings(s => ({...s, darkMode: !s.darkMode}))}
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
                  onChange={(e) => setSettings(s => ({...s, theme: e.target.value}))}
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

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notificaciones Push</span>
                <button
                  onClick={() => setSettings(s => ({...s, notifications: !s.notifications}))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Recordatorios de Estudio</span>
                <button
                  onClick={() => setSettings(s => ({...s, studyReminders: !s.studyReminders}))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.studyReminders ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.studyReminders ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'study':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Configuración de Estudio</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración de Sesión (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionDuration}
                onChange={(e) => setSettings(s => ({...s, sessionDuration: parseInt(e.target.value)}))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Cuenta</h3>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </nav>
          
          <div className="p-6 col-span-3">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
