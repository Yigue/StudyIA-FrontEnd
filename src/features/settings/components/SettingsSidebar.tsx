import { SettingsSection } from '../types/settings.types';

interface SettingsSidebarProps {
  sections: SettingsSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const SettingsSidebar = ({ sections, activeSection, onSectionChange }: SettingsSidebarProps) => (
  <nav className="p-4 space-y-1">
    {sections.map((section) => (
      <button
        key={section.id}
        onClick={() => onSectionChange(section.id)}
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
);
