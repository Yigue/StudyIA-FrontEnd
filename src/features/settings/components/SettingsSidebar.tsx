import React from 'react';
import { 
  User,
  Settings,
  Palette,
  ChevronRight
} from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'account', label: 'Cuenta', icon: Settings },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-64">
      <nav className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
