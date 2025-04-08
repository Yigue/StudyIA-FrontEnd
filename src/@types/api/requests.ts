/**
 * Tipos para las solicitudes a la API
 */

// Tipos para autenticación
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Tipos para materiales
export interface CreateTextMaterialRequest {
  title: string;
  description?: string;
  content: string;
  tags?: string[];
}

export interface ProcessMaterialRequest {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  generate_summary?: boolean;
  generate_flashcards?: boolean;
  summary_format?: "bullet_points" | "paragraph" | "structured";
  summary_length?: "short" | "medium" | "long";
  flashcards_count?: number;
  flashcards_difficulty?: "easy" | "medium" | "hard";
}

export interface GenerateSummaryRequest {
  format?: "bullet_points" | "paragraph" | "structured";
  length?: "short" | "medium" | "long";
  complexity?: "easy" | "medium" | "hard";
}

export interface GenerateFlashcardsRequest {
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
}

// Tipos para resúmenes
export interface CreateSummaryRequest {
  material_id: string;
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
}

export interface UpdateSummaryRequest {
  content?: string;
  format?: "bullet_points" | "paragraph" | "structured";
}

// Tipos para flashcards
export interface CreateFlashcardRequest {
  material_id: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface UpdateFlashcardRequest {
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface ReviewFlashcardRequest {
  rating: number;
  notes?: string;
}

// Tipos para exámenes
export interface CreateExamRequest {
  material_ids: string[];
  difficulty?: "easy" | "medium" | "hard";
  duration_minutes?: number;
  questions_count?: number;
}

// Tipos para etiquetas
export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

// Tipos comunes para consultas
export interface QueryParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
} 