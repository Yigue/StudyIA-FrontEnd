/**
 * Tipos relacionados con la API
 */

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiError {
  status: "error";
  message: string;
  code: number;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "BAD_REQUEST"
  | "UNKNOWN_ERROR";

// Opciones para el procesamiento de materiales en la API
export interface ApiProcessingOptions {
  generate_summary?: boolean;
  generate_flashcards?: boolean;
  summary_format?: "bullet_points" | "paragraph" | "structured";
  summary_length?: "short" | "medium" | "long";
  flashcards_count?: number;
  flashcards_difficulty?: 'easy' | 'medium' | 'hard';
}

// Parámetros para consultas a la API
export interface ApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[] | string;
  sort?: string;
  order?: 'asc' | 'desc';
  difficulty?: 'easy' | 'medium' | 'hard';
  archived?: boolean;
} 