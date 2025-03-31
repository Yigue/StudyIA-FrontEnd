import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Palette,
  UserCircle,
  Settings as SettingsIcon,
} from 'lucide-react';
import { SettingsSection, UserSettings, Notification } from './types/settings.types';
import { SettingsHeader } from './components/SettingsHeader';
import { NotificationMessage } from './components/NotificationMessage';
import { SettingsSidebar } from './components/SettingsSidebar';
import { ProfileSection } from './components/sections/ProfileSection';
import { AppearanceSection } from './components/sections/AppearanceSection';
import { AccountSection } from './components/sections/AccountSection';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
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
      console.error('Error al guardar la configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof UserSettings, value: undefined) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'appearance':
        return <AppearanceSection settings={settings} onSettingChange={handleSettingChange} />;
      case 'notifications':
        return <div>Notificaciones</div>;
      case 'study':
        return <div>Estudio</div>;
      case 'account':
        return <AccountSection />
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsHeader loading={loading} onSave={saveSettings} />
        
        <div className="mt-8 flex gap-8">
          <SettingsSidebar
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <div className="flex-1">
            {notification && (
              <NotificationMessage
                type={notification.type}
                message={notification.message}
                onClose={handleNotificationClose}
              />
            )}
            
            <div className="card">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
