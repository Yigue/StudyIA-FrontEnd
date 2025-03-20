export interface SettingsSection {
  id: string;
  label: string;
  icon: any;
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  studyReminders: boolean;
  sessionDuration: number;
  theme: 'indigo' | 'blue' | 'green' | 'purple';
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
}
