// Re-exportar tipos de flashcards para facilitar las importaciones
import { DifficultyLevel } from './index';
export * from './ui';
export * from './spaced-repetition';

// Extender la interfaz Flashcard para añadir compatibilidad con ambos estilos de nombres de propiedades
export interface ExtendedFlashcard {
  // Propiedades originales
  id: string;
  materialId: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  archived: boolean;
  lastReviewed: string | null;
  tags?: { id: string; name: string; color?: string }[];
  createdAt: string;
  updatedAt: string;
  
  // Propiedades alternativas para compatibilidad
  material_id?: string;
  next_review?: string;
  last_reviewed?: string;
}

// Re-exportar el tipo DifficultyLevel
export { DifficultyLevel };

// Re-definir Flashcard 
export type Flashcard = ExtendedFlashcard;

// Definir tipos adicionales necesarios para los componentes
export interface FlashcardFilters {
  difficulty: string | 'all';
  subject: string | 'all';
  status: string | 'all' | 'pending' | 'due' | 'new' | 'completed';
  tags?: string[];
  archived?: boolean;
}

export interface FlashcardStats {
  total: number;
  filtered?: number;
  current?: number;
  pending?: number;
  completed?: number;
}

export interface StudySessionConfig {
  duration: number;
  cardLimit: number;
  difficulty: string[];
  tagIds: string[];
  randomize: boolean;
  // Propiedades adicionales
  newCardsPerDay?: number;
  maxReviewsPerDay?: number;
  reviewOrder?: string;
  studyMode?: string;
  learningSteps?: number[];
}

export enum ResponseQuality {
  AGAIN = 0,
  HARD = 3,
  GOOD = 4,
  EASY = 5
}

// Añadir tipo para ReviewResult
export type ReviewResult = ResponseQuality; 