export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  settings: UserSettings;
  created_at: Date;
  updated_at: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  study_reminder_time: string | null;
  session_duration: number;
}

