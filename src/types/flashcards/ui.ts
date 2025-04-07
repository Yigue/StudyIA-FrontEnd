import { Flashcard } from './index';
import { FlashcardWithSpacedRepetition } from './spaced-repetition';

/**
 * Tipos relacionados con la interfaz de usuario para flashcards
 * con estilo TikTok y elementos de gamificación
 */

// Estados de visualización de flashcard
export enum FlashcardViewState {
  Question = 'question',
  Answer = 'answer',
  Feedback = 'feedback',
  Result = 'result'
}

// Animaciones disponibles
export enum FlashcardAnimation {
  SlideUp = 'slide-up',
  SlideDown = 'slide-down',
  Flip = 'flip',
  Rotate = 'rotate',
  Fade = 'fade',
  Bounce = 'bounce',
  Pulse = 'pulse',
  Wobble = 'wobble',
  Tada = 'tada',
  Jello = 'jello'
}

// Transiciones entre estados
export interface FlashcardTransition {
  from: FlashcardViewState;
  to: FlashcardViewState;
  animation: FlashcardAnimation;
  duration: number; // en milisegundos
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// Configuración de interfaz
export interface FlashcardUIConfig {
  theme: 'light' | 'dark' | 'auto';
  cardStyle: 'minimal' | 'paper' | 'glass' | 'neomorphic';
  fontSize: 'small' | 'medium' | 'large';
  enableSounds: boolean;
  enableHapticFeedback: boolean;
  animations: FlashcardAnimation[];
  transitionSpeed: 'slow' | 'normal' | 'fast';
  showTimer: boolean;
  showProgressBar: boolean;
  swipeThreshold: number; // umbral para detectar un deslizamiento
  verticalNavigation: boolean; // navegación vertical estilo TikTok
}

// Estado de progreso visual
export interface ProgressState {
  currentCardIndex: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  percentageComplete: number;
  streakCount: number;
  streakDays: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

// Recompensas y elementos de gamificación
export interface GamificationReward {
  id: string;
  type: 'streak' | 'milestone' | 'achievement' | 'level_up' | 'perfect_score';
  title: string;
  description: string;
  icon: string;
  animation: FlashcardAnimation;
  xpAwarded: number;
  unlockedFeature?: string;
  confetti?: boolean;
}

// Feedback visual tras respuesta
export interface AnswerFeedback {
  isCorrect: boolean;
  message: string;
  animation: FlashcardAnimation;
  color: string;
  icon: string;
  soundEffect?: string;
}

// Componente de flashcard para la vista
export interface FlashcardViewProps {
  card: FlashcardWithSpacedRepetition;
  viewState: FlashcardViewState;
  onAnswer: (quality: number) => void;
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onFlip: () => void;
  progress: ProgressState;
  feedbackTimeMs: number;
  showHint?: boolean;
  preloadNextCard?: boolean;
}

// Elemento de lista de flashcards
export interface FlashcardListItem {
  card: Flashcard;
  dueDate?: Date;
  isDue: boolean;
  progress: number; // 0-100
  color: string;
  icon?: string;
} 