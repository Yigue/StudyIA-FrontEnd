/**
 * Tipos relacionados con materiales de estudio
 */
import { ProcessStatus } from '../common';
import { Tag } from '../tag';

// Entidad principal de material de estudio
export interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  file_url: string | null;
  userId: string;
  processingStatus: ProcessStatus | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// DTOs para operaciones CRUD
export interface CreateTextMaterialDTO {
  title: string;
  description?: string;
  content: string;
  tags?: string[];
}

export interface CreateFileMaterialDTO {
  title: string;
  description?: string;
  file: File;
  tags?: string[];
}

export interface UpdateMaterialDTO {
  title?: string;
  description?: string;
  tags?: string[];
}

// Opciones para procesamiento de materiales
export interface ProcessMaterialDTO {
  generate_summary?: boolean;
  generate_flashcards?: boolean;
  summary_format?: "bullet_points" | "paragraph" | "structured";
  summary_length?: "short" | "medium" | "long";
  flashcards_count?: number;
  flashcards_difficulty?: "easy" | "medium" | "hard";
}

// DTO para generar resumen para un material
export interface GenerateSummaryDTO {
  format?: "bullet_points" | "paragraph" | "structured";
  length?: "short" | "medium" | "long";
  complexity?: "easy" | "medium" | "hard";
}

// DTO para generar flashcards para un material
export interface GenerateFlashcardsDTO {
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
}

// Respuesta de estado de procesamiento
export interface ProcessingStatusResponse {
  processingStatus: "pending" | "completed" | "failed";
  message: string;
}

// Filtros para materiales
export interface MaterialFilters {
  search?: string;
  tags?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 