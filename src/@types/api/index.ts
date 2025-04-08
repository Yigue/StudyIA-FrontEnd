/**
 * Exportación centralizada de todos los tipos relacionados con la API
 */

export * from './responses';
export * from './requests';

// Definición de tipos comunes de la API
export type Params = Record<string, string | number | boolean | string[] | undefined | null>;

// Tipos de métodos HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Tipos literales para estado de procesamiento
export type ProcessingStatus = 'pending' | 'completed' | 'failed';

// Tipos para valores de dificultad
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Tipos para formatos de resumen
export type SummaryFormat = 'bullet_points' | 'paragraph' | 'structured';

// Tipos para longitud de resumen
export type SummaryLength = 'short' | 'medium' | 'long';

// Tipos para tipos de preguntas de examen
export type ExamQuestionType = 'multiple_choice' | 'true_false' | 'short_answer'; 