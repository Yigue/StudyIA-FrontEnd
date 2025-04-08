/**
 * Tipos relacionados con la funcionalidad de estudio
 */
import { DifficultyLevel } from '../api';

// Modos de estudio
export enum StudyMode {
  Standard = 'standard',
  Pomodoro = 'pomodoro',
  Exam = 'exam',
  DailyChallenge = 'daily_challenge'
}

// Configuración general de estudio
export interface StudyConfig {
  mode: StudyMode;
  materialIds?: string[];
  tagIds?: string[];
  maxDifficulty?: DifficultyLevel;
  cardLimit?: number;
  shuffleCards: boolean;
  showHints: boolean;
}

// Configuración específica de Pomodoro
export interface PomodoroConfig {
  workDuration: number; // minutos
  breakDuration: number; // minutos
  longBreakDuration: number; // minutos
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
}

// Configuración específica de Examen
export interface ExamConfig {
  duration: number; // minutos
  questionsCount: number;
  allowSkip: boolean;
  showResults: boolean;
  passingScore: number; // porcentaje
}

// Configuración de desafío diario
export interface DailyChallengeConfig {
  difficulty: DifficultyLevel;
  fixedCardCount: number;
  topicFocus?: string;
}

// Estado de sesión de estudio
export interface StudySessionState {
  currentCardIndex: number;
  totalCards: number;
  completedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedCards: number;
  startTime: string;
  endTime?: string;
  timeElapsed: number; // segundos
  isCompleted: boolean;
  isPaused: boolean;
}

// Resultado de sesión de estudio
export interface StudySessionResult {
  mode: StudyMode;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedCards: number;
  accuracyRate: number; // porcentaje
  durationMinutes: number;
  startTime: string;
  endTime: string;
  materialIds: string[];
  tagIds: string[];
}

// Estadísticas de progreso
export interface StudyProgressStats {
  dailyGoal: number;
  dailyProgress: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyAverage: number;
  currentStreak: number;
  longestStreak: number;
} 