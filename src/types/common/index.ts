import { DifficultyLevel } from "../flashcards";

/**
 * Tipos comunes utilizados en toda la aplicación
 */
export interface StatusState {
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface FileAttachment {
  id: string;
  url: string;
  filename: string;
  mimetype?: string;
  size?: number;
  createdAt?: string;
}


// Valores constantes para DifficultyLevel

export type ProcessStatus = 'pending' | 'completed' | 'failed';

// Tipo para parámetros de consultas a la API
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[] | string;
  sort?: string;
  order?: 'asc' | 'desc';
  difficulty?: DifficultyLevel;
  archived?: boolean;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id?: string;
  type: NotificationType;
  message: string;
  duration?: number;
  timestamp?: number;
} 