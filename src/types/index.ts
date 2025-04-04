// Exportar todos los tipos definidos en Material.d.ts
// Nota: Material.d.ts se incluye automáticamente al ser un archivo .d.ts de declaración

// Exportar los tipos relacionados con la API
export * from './api';

// Exportar tipos según sea necesario
export * from './studyMaterial/studyMaterial';
export * from './studyMaterial/studyMaterialRequest';
export * from './flashcards/flashcards';
export * from './summary/summary';
export * from './tag/tag';
export * from './user/user';

// Tipos para solicitudes a la API
export interface Params {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[] | string;
  sort?: string;
  order?: 'asc' | 'desc';
  type?: 'pdf' | 'text' | 'url';
  [key: string]: any;
}

// Tipos de entidades
export interface Tag {
  id: string;
  name: string;
  color?: string;
  userId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FileAttachment {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

// Tipos comunes para la aplicación

// Opciones de procesamiento para materiales
export interface ProcessingOptions {
  summary?: boolean;
  flashcards?: boolean;
}

// Tipo para materiales de estudio
export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'text' | 'url';
  content?: string;
  url?: string;
  file?: File;
  userId: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

// Tipo para opciones API procesamiento
export interface ApiProcessingOptions {
  generate_summary: boolean;
  generate_flashcards: boolean;
  summary_options?: {
    max_length?: number;
    format?: string;
  };
  flashcards_options?: {
    count?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

// Tipo para flashcards
export interface Flashcard {
  id: string;
  material_id: string;
  question: string;
  answer: string;
  difficulty: number | string;
  nextReview?: string;
  lastReviewed?: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
}

// Tipo para resúmenes
export interface Summary {
  id: string;
  material_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMaterialDTO {
  title: string;
  description?: string;
  type: 'pdf' | 'text' | 'url';
  content?: string;
  file?: File;
  userId?: string;
  tags?: string[];
}

// Estado de la aplicación
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface StatusState {
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Tipos de dificultad para Flashcards
export type FlashcardDifficulty = "easy" | "medium" | "hard";

// Tipo de estado de revisión para Flashcards
export type ReviewStatus = "new" | "learning" | "review" | "graduated";

// Tipo Meta de la API (representa la respuesta)
export interface ApiMeta {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  meta?: ApiMeta;
}

export interface ApiError {
  message: string;
  code: number;
  status: 'error';
}

// Tipos para autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  role_id: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  nombre: string;
  role_id: string;
  accessToken: string;
  refreshToken?: string;
  isEmailVerified: boolean;
  created_at: string;
  updated_at: string;
}

export interface userLoginDTO {
  email: string;
  password: string;
}

export interface userRegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  password: string;
  passwordConfirmation: string;
}

// Tipos para etiquetas
export interface TagCreateDTO {
  name: string;
  color?: string;
}

export interface TagUpdateDTO {
  name?: string;
  color?: string;
}

// Tipos para resúmenes
export interface SummaryCreateDTO {
  material_id: string;
  content: string;
}

export interface SummaryUpdateDTO {
  content?: string;
}

// Tipos para flashcards
export interface FlashcardCreateDTO {
  material_id: string;
  question: string;
  answer: string;
  difficulty?: number | string;
}

export interface FlashcardUpdateDTO {
  question?: string;
  answer?: string;
  difficulty?: number | string;
  archived?: boolean;
}

export interface FlashcardReviewDTO {
  difficulty: number;
  correct: boolean;
}

// Tipos para dashboard
export interface StudyStats {
  totalMaterials: number;
  totalFlashcards: number;
  studyHours: number;
  achievements: number;
  streak: number;
}

export interface StudySession {
  date: string;
  duration: number;
  materials_studied: number;
  flashcards_reviewed: number;
}

export interface FlashcardReview {
  question: string;
  next_review: string;
  difficulty: number;
}
