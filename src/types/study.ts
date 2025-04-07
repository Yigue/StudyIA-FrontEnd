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

// Tipos de materiales de estudio
export enum MaterialType {
  FILE = 'file',
  TEXT = 'text',
  URL = 'url'
}

// Material de estudio
export interface StudyMaterial {
  id: string;
  title: string;
  summary: string;
  type: MaterialType;
  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  flashcards?: Array<{
    question: string;
    answer: string;
    tags?: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
  processed: boolean;
  processingStatus?: 'pending' | 'success' | 'error';
}

// DTO para creación de material
export interface CreateMaterialDTO {
  title: string;
  summary: string;
  type: MaterialType;
  tags: Array<{
    id: string;
    name: string;
    color?: string;
    createdAt?: Date;
    count?: number;
  }>;
  file?: File;
  content?: string;
}

// Opciones de procesamiento de IA
export interface ProcessingOptions {
  generate_summary: boolean;
  generate_flashcards: boolean;
  summary_options?: {
    length?: 'short' | 'medium' | 'long';
    focus?: 'general' | 'key_points' | 'detailed';
  };
  flashcards_options?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    count?: number;
    include_images?: boolean;
  };
}

// Configuración de sesión de estudio
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