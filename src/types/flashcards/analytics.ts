import { DifficultyLevel } from '../common';
import { Flashcard } from './index';

/**
 * Tipos relacionados con el análisis y estadísticas de flashcards
 */

// Periodos de tiempo para análisis
export type TimeRange = 'day' | 'week' | 'month' | '3months' | '6months' | 'year' | 'all';

// Datos para gráficos de estudio
export interface StudyTimeData {
  date: string;            // Fecha en formato ISO
  minutes: number;         // Minutos estudiados
  cardsReviewed: number;   // Tarjetas revisadas
  newCards: number;        // Tarjetas nuevas estudiadas
  reviewCards: number;     // Tarjetas de repaso estudiadas
}

// Datos de rendimiento por categoría
export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  averageCorrectRate: number;  // 0-1
  averageEaseFactor: number;   // Facilidad media
  mostDifficultCards: Flashcard[];
  retentionRate: number;       // 0-1
  timeSpent: number;           // En minutos
}

// Áreas de debilidad identificadas
export interface WeakArea {
  categoryId: string;
  categoryName: string;
  correctRate: number;        // 0-1
  problemCards: Flashcard[];
  suggestedActions: string[];
  priority: 'high' | 'medium' | 'low';
}

// Predicción de curva de aprendizaje
export interface LearningCurve {
  dates: string[];                  // Fechas futuras
  predictedRetention: number[];     // Valores de retención predichos (0-1)
  predictedMastery: number[];       // Tarjetas dominadas predichas
  confidenceInterval: [number, number][]; // Intervalos de confianza para predicciones
}

// Desglose de tiempo dedicado
export interface TimeBreakdown {
  totalMinutes: number;
  byCategory: Record<string, number>;  // Minutos por categoría
  byTimeOfDay: Record<string, number>; // Mañana, tarde, noche
  byDayOfWeek: Record<string, number>; // Lunes a domingo
  averageDuration: number;            // Duración media en minutos
  longestSession: number;             // Sesión más larga en minutos
  studyHabit: 'consistent' | 'irregular' | 'weekend' | 'weekday';
}

// Análisis de patrones de respuesta
export interface ResponsePatterns {
  averageResponseTime: number;      // En segundos
  responseTimeByDifficulty: Record<DifficultyLevel, number>;
  bestTimeOfDay: string;            // Mejor hora para estudiar
  mistakePatterns: Array<{
    pattern: string;
    frequency: number;
    examples: Flashcard[];
  }>;
  correctStreaks: number[];         // Rachas de respuestas correctas
}

// Reporte completo de análisis
export interface AnalyticsReport {
  userId: string;
  generatedAt: Date;
  period: TimeRange;
  studyTime: StudyTimeData[];
  categoryPerformance: CategoryPerformance[];
  weakAreas: WeakArea[];
  learningCurve: LearningCurve;
  timeBreakdown: TimeBreakdown;
  responsePatterns: ResponsePatterns;
  recommendations: string[];
  summary: {
    cardsLearned: number;
    retention: number;     // 0-1
    timeSpent: number;     // En minutos
    efficiency: number;    // Tarjetas/hora
    streakDays: number;
    estimatedTimeToMastery: number; // En días
  };
} 