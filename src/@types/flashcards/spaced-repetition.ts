/**
 * Tipos relacionados con el sistema de repetición espaciada
 */
import { DifficultyLevel } from '../api';

// Niveles de conocimiento para repetición espaciada
export enum KnowledgeLevel {
  New = 0,          // Nueva tarjeta, nunca revisada
  Learning = 1,     // Aprendiendo, necesita revisión frecuente
  Familiar = 2,     // Familiar, revisión ocasional
  Mastered = 3,     // Dominada, revisión infrecuente
  Forgotten = -1    // Olvidada, necesita ser reaprendida
}

// Estado interno del algoritmo de repetición espaciada
export interface SpacedRepetitionState {
  knowledgeLevel: KnowledgeLevel;
  nextReviewDate: string;
  easeFactor: number;  // Factor de facilidad (multiplicador para intervalos)
  consecutiveCorrect: number;
  intervalDays: number;
  lastReviewedDate: string | null;
  reviewCount: number;
}

// Configuración del algoritmo de repetición espaciada
export interface SpacedRepetitionConfig {
  // Intervalos iniciales en días para cada nivel
  initialIntervals: {
    [KnowledgeLevel.Learning]: number;
    [KnowledgeLevel.Familiar]: number;
    [KnowledgeLevel.Mastered]: number;
  };
  // Factor de facilidad inicial
  initialEaseFactor: number;
  // Modificadores del factor de facilidad basados en calificación
  easeFactorModifiers: {
    [key: number]: number; // Calificación (1-5) => modificador
  };
  // Umbrales para cambiar de nivel
  levelThresholds: {
    toFamiliar: number;
    toMastered: number;
  };
}

// Estadísticas de retención
export interface RetentionStats {
  lastWeek: {
    total: number;
    correct: number;
    percentage: number;
  };
  lastMonth: {
    total: number;
    correct: number;
    percentage: number;
  };
  overall: {
    total: number;
    correct: number;
    percentage: number;
  };
}

// Predicción de retención
export interface RetentionPrediction {
  predictedRetention: number; // 0-1
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  nextOptimalReviewDate: string;
}

// Opciones para la sesión de estudio
export interface StudySessionOptions {
  newCardsPerDay: number;
  reviewsPerDay: number;
  prioritizeDue: boolean;
  maxDifficultyLevel?: DifficultyLevel;
  includeTags?: string[];
  excludeTags?: string[];
  materialIds?: string[];
}

// Estadísticas de la sesión de estudio
export interface StudySessionStats {
  newStudied: number;
  reviewsStudied: number;
  correctAnswers: number;
  wrongAnswers: number;
  avgScore: number;
  remainingNew: number;
  remainingReviews: number;
  timeSpent: number; // En segundos
} 