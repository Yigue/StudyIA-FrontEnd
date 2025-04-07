/**
 * Tipos relacionados con la configuración y ajustes
 */

export interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  studyReminders: boolean;
  sessionDuration: number;
  theme: 'indigo' | 'blue' | 'green' | 'purple';
  flashcardsPerSession?: number;
  language?: 'es' | 'en';
  emailNotifications?: boolean;
}

export interface ThemeSettings {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

// Preferencias de estudio
export interface StudyPreferences {
  cardsPerSession: number;
  sessionDuration: number;
  studyMethod: 'spaced-repetition' | 'random' | 'sequential';
  sortBy?: 'difficulty' | 'date-created' | 'last-reviewed';
  showAnswerTime?: number;
} 