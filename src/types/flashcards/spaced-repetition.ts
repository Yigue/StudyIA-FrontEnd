import { DifficultyLevel } from './index';
import { Flashcard } from './index';

/**
 * Tipos relacionados con el algoritmo de repetición espaciada
 */

// Niveles de conocimiento de una flashcard
export enum KnowledgeLevel {
  New = 0,
  Learning = 1,
  Review = 2,
  Mastered = 3
}

// Estado del algoritmo SM-2 para una flashcard
export interface SpacedRepetitionState {
  easeFactor: number;       // Factor de facilidad (1.3 - 2.5)
  interval: number;         // Intervalo en días
  repetitions: number;      // Número de repeticiones consecutivas correctas
  dueDate: Date;            // Fecha para la próxima revisión
  knowledgeLevel: KnowledgeLevel; // Nivel de conocimiento actual
  lastReviewDate?: Date;    // Última fecha de revisión
  streak: number;           // Racha actual de respuestas correctas
}

// Respuesta de calidad para el algoritmo SM-2
export enum ResponseQuality {
  Blackout = 0,     // Completamente olvidado
  Incorrect = 1,    // Respuesta incorrecta pero recordaba algo
  Difficult = 2,    // Respuesta correcta pero con mucha dificultad
  Hesitation = 3,   // Respuesta correcta pero con dudas
  Easy = 4,         // Respuesta correcta con un poco de esfuerzo
  Perfect = 5       // Respuesta perfecta sin esfuerzo
}

// Resultado tras evaluar una flashcard
export interface ReviewResult {
  flashcard: Flashcard;
  responseQuality: ResponseQuality;
  oldState: SpacedRepetitionState;
  newState: SpacedRepetitionState;
  timeTaken: number;        // Tiempo en segundos que tardó en responder
  answerCorrect: boolean;   // Si la respuesta fue correcta o no
}

// Metadata para flashcards con información de repetición espaciada
export interface FlashcardWithSpacedRepetition extends Flashcard {
  spacedRepetition: SpacedRepetitionState;
}

// Configuración del algoritmo
export interface SpacedRepetitionConfig {
  initialEaseFactor: number;     // Factor de facilidad inicial (normalmente 2.5)
  minEaseFactor: number;         // Factor de facilidad mínimo (normalmente 1.3)
  initialInterval: number;       // Intervalo inicial en días (normalmente 1)
  easyBonus: number;             // Bonus para respuestas muy fáciles
  hardPenalty: number;           // Penalización para respuestas difíciles
  lapseNewInterval: number;      // Fracción del intervalo anterior tras un fallo
  maxInterval: number;           // Intervalo máximo en días
  difficultyWeight: number;      // Peso de la dificultad en el cálculo del intervalo
}

// Estadísticas de estudio
export interface SpacedRepetitionStats {
  totalReviews: number;          // Número total de revisiones
  correctResponses: number;      // Respuestas correctas
  incorrectResponses: number;    // Respuestas incorrectas
  streakDays: number;            // Días consecutivos de estudio
  averageResponseQuality: number; // Calidad media de respuesta
  masteredCards: number;         // Tarjetas dominadas
  learningCards: number;         // Tarjetas en aprendizaje
  newCards: number;              // Tarjetas nuevas
  reviewCards: number;           // Tarjetas en revisión
  retentionRate: number;         // Tasa de retención (0-1)
  averageTimePerCard: number;    // Tiempo medio por tarjeta en segundos
  totalStudyTime: number;        // Tiempo total de estudio en segundos
  predictedRetention: Record<string, number>; // Retención predicha por tema/categoría
}

// Configuración de sesión de estudio
export interface StudySessionConfig {
  newCardsPerDay: number;        // Número de tarjetas nuevas por día
  maxReviewsPerDay: number;      // Número máximo de revisiones por día
  learningSteps: number[];       // Pasos de aprendizaje en minutos (ej: [1, 10, 60, 360])
  reviewOrder: 'due' | 'difficulty' | 'random'; // Orden de revisión
  studyMode: 'standard' | 'pomodoro' | 'exam' | 'daily_challenge' | 'cram' | 'custom'; // Modo de estudio
  includeTags?: string[];        // Tags a incluir
  excludeTags?: string[];        // Tags a excluir
  difficultyRange?: [DifficultyLevel, DifficultyLevel]; // Rango de dificultad
  
  // Configuración para modo Pomodoro
  pomodoroConfig?: {
    studyMinutes: number;        // Minutos de estudio (por defecto 25)
    breakMinutes: number;        // Minutos de descanso (por defecto 5)
    longBreakMinutes: number;    // Minutos de descanso largo (por defecto 15)
    cyclesBeforeLongBreak: number; // Ciclos antes de un descanso largo (por defecto 4)
  };
  
  // Configuración para modo examen
  examConfig?: {
    timeLimit: number;           // Límite de tiempo en minutos
    questionsCount: number;      // Número de preguntas
    passingScore: number;        // Puntaje para aprobar (1-100)
    showFeedbackImmediately: boolean; // Mostrar feedback inmediatamente o al final
  };
  
  // Configuración para desafío diario
  dailyChallengeConfig?: {
    cardsCount: number;          // Número de tarjetas para el desafío
    difficulty: DifficultyLevel; // Dificultad del desafío
    targetStreak: number;        // Racha objetivo para completar
  };
}

// Evento de gamificación
export interface StudyAchievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  earnedDate?: Date;
  progress?: number;          // Progreso actual (0-100)
  requiredValue: number;      // Valor requerido para conseguir el logro
  type: 'streak' | 'cards_studied' | 'perfect_reviews' | 'time_studied' | 'mastered_cards';
}

// Predicción de recuerdo
export interface RetentionPrediction {
  flashcardId: string;
  predictedRetention: number; // 0-1 (probabilidad de recordar)
  dueDate: Date;              // Fecha óptima para revisión
  urgency: number;            // 0-1 (qué tan urgente es revisar esta tarjeta)
  forgettingCurve: Array<{date: Date, retention: number}>; // Puntos de la curva de olvido
} 