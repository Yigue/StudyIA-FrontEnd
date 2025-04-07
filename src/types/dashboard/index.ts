/**
 * Tipos relacionados con el dashboard y estadísticas
 */

// Estadísticas generales de estudio
export interface StudyStats {
  totalMaterials: number;
  totalFlashcards: number;
  studyHours: number;
  achievements: number;
  streak: number;
}

// Información de sesiones de estudio
export interface StudySession {
  id?: string;
  date: string;
  duration: number;
  materialsStudied: number;
  flashcardsReviewed: number;
  correctAnswers?: number;
  wrongAnswers?: number;
}

// Próximas revisiones de flashcards
export interface FlashcardReview {
  id?: string;
  question: string;
  nextReview: string;
  difficulty: number;
  materialId?: string;
  materialTitle?: string;
}

// Datos para gráficos
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

// Filtros de tiempo para dashboard
export type TimeFilter = 'day' | 'week' | 'month' | 'year' | 'all'; 