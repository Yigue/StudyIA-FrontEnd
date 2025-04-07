/**
 * Tipos relacionados con el área de estudio
 */

// Sujetos/materias de estudio
export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Resultado del análisis de material
export interface AnalysisResult {
  summary: string;
  flashcards: Array<{
    question: string;
    answer: string;
    tags?: string[];
  }>;
  keyTerms?: string[];
  topics?: string[];
}

// Archivo para estudio
export interface FileItem {
  id?: string;
  name: string;
  content?: string;
  url?: string;
  type?: string;
  size?: number;
}

// Sesión de estudio
export interface StudySessionConfig {
  duration: number;
  cardsLimit?: number;
  includeNew?: boolean;
  includeReview?: boolean;
  subjects?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
}

// Resultado de una sesión de estudio
export interface StudySessionResult {
  duration: number;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  newCards: number;
  reviewedCards: number;
  startTime: Date;
  endTime: Date;
} 