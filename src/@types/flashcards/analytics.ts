/**
 * Tipos relacionados con analíticas de flashcards
 */

// Estadísticas generales de flashcards
export interface FlashcardGlobalStats {
  total: number;
  mastered: number;
  learning: number;
  forgotten: number;
  new: number;
  retention: number; // 0-100%
  dueToday: number;
  dueThisWeek: number;
  createdThisWeek: number;
  reviewedLastWeek: number;
}

// Datos para gráficos de rendimiento
export interface FlashcardPerformanceData {
  dates: string[]; // Fechas ISO
  reviewCounts: number[];
  correctCounts: number[];
  retentionRates: number[]; // 0-100%
  avgResponseTimes: number[]; // Segundos
}

// Rendimiento por etiqueta
export interface TagPerformance {
  tagId: string;
  tagName: string;
  color: string;
  cardCount: number;
  masteredCount: number;
  retentionRate: number; // 0-100%
  averageEase: number; // 0-100%
  lastStudied: string | null;
}

// Rendimiento por material
export interface MaterialPerformance {
  materialId: string;
  materialTitle: string;
  cardCount: number;
  masteredCount: number;
  retentionRate: number; // 0-100%
  averageEase: number; // 0-100%
  lastStudied: string | null;
}

// Estadísticas de rendimiento de usuario
export interface UserPerformance {
  totalStudyTime: number; // Segundos
  totalReviews: number;
  averageRetention: number; // 0-100%
  currentStreak: number; // Días
  longestStreak: number; // Días
  studyDays: number; // Total días con actividad
  cardsPerDay: number; // Promedio
  weeklyActivity: number[]; // Conteo de actividad por día de la semana (0=domingo, 6=sábado)
}

// Predicción de carga de estudio
export interface StudyLoadForecast {
  dates: string[]; // Próximos días en formato ISO
  newCards: number[]; // Cantidad de tarjetas nuevas recomendadas
  dueReviews: number[]; // Cantidad de revisiones pendientes
  estimatedTimeMinutes: number[]; // Tiempo estimado en minutos
}

// Recomendación para estudio basada en análisis
export interface StudyRecommendation {
  type: 'tag' | 'material' | 'specific';
  reason: string;
  targetId?: string;
  targetName: string;
  cardCount: number;
  estimatedTimeMinutes: number;
  priority: 'high' | 'medium' | 'low';
}