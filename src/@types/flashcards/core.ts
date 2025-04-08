/**
 * Tipos centrales para las flashcards
 */
import { DifficultyLevel } from '../api';
import { Tag } from '../tags';

// Constantes de dificultad
export const FlashcardDifficulty = {
  Easy: 'easy' as DifficultyLevel,
  Medium: 'medium' as DifficultyLevel,
  Hard: 'hard' as DifficultyLevel
};

// Entidad principal de flashcard
export interface Flashcard {
  id: string;
  materialId: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  archived: boolean;
  lastReviewed: string | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// DTOs para operaciones CRUD
export interface FlashcardCreateDTO {
  material_id: string;
  question: string;
  answer: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export interface FlashcardUpdateDTO {
  question?: string;
  answer?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export interface FlashcardReviewDTO {
  rating: number;
  notes?: string;
}

// Respuesta de revisión
export interface FlashcardReview {
  id: string;
  rating: number;
  notes: string | null;
  flashcardId: string;
  createdAt: string;
}

// Tipos adicionales para la UI
export interface FlashcardFilters {
  difficulty?: DifficultyLevel;
  tags?: string[];
  archived?: boolean;
  search?: string;
  materialId?: string;
  page?: number;
  limit?: number;
}

export interface FlashcardStats {
  total: number;
  due: number;
  new: number;
  learned: number;
}

// Respuesta simplificada para estudio
export interface FlashcardStudyItem {
  id: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  material?: {
    id: string;
    title: string;
  };
  lastReviewed: string | null;
} 