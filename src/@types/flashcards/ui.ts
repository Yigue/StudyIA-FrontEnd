/**
 * Tipos relacionados con la interfaz de usuario para flashcards
 */

// Estados de visualización para las flashcards
export enum FlashcardViewState {
  Question = 'question',
  Answer = 'answer',
  Review = 'review',
  Complete = 'complete'
}

// Animaciones para flashcards
export enum FlashcardAnimation {
  Flip = 'flip',
  Slide = 'slide',
  Fade = 'fade',
  None = 'none'
}

// Configuración de transición para cambios de estado
export interface FlashcardTransition {
  from: FlashcardViewState;
  to: FlashcardViewState;
  animation: FlashcardAnimation;
  duration: number;
}

// Configuración de UI para estudio de flashcards
export interface FlashcardUIConfig {
  showProgressBar: boolean;
  enableKeyboardShortcuts: boolean;
  showHints: boolean;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'system';
  animations: FlashcardAnimation;
  autoDarkModeHours?: {
    start: number; // 0-23
    end: number; // 0-23
  };
  transitionDuration: number;
}

// Recompensas de gamificación
export interface GamificationReward {
  type: 'streak' | 'milestone' | 'badge' | 'levelUp';
  title: string;
  description: string;
  iconUrl?: string;
  value?: number;
  achievedDate: string;
}

// Feedback visual para respuestas
export interface AnswerFeedback {
  isCorrect: boolean;
  message: string;
  tips?: string[];
  color: string;
  iconName?: string;
  animation: 'bounce' | 'shake' | 'pulse' | 'none';
}

// Opciones para modo de estudio
export interface StudyModeOptions {
  mode: 'standard' | 'pomodoro' | 'exam' | 'daily_challenge';
  settings: {
    standard?: {
      reviewLimit?: number;
    };
    pomodoro?: {
      workDuration: number; // minutos
      breakDuration: number; // minutos
      longBreakDuration: number; // minutos
      sessionsBeforeLongBreak: number;
    };
    exam?: {
      duration: number; // minutos
      cardsCount: number;
      allowSkip: boolean;
    };
    dailyChallenge?: {
      difficulty: 'easy' | 'medium' | 'hard';
      topicFocus?: string;
    };
  };
} 