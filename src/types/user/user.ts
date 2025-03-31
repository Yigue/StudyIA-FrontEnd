export interface User {
  id: string;
  email: string;
  name: string;
  role_id: string;
  isEmailVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  studyReminders: boolean;
  sessionDuration: number;
  theme: string;
}

