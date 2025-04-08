/**
 * Tipos relacionados con resúmenes
 */

import { StudyMaterial } from "../materials";

// Entidad principal de resumen
export interface Summary {
  id: string;

  summary_text: string;
  format: "bullet_points" | "paragraph" | "structured";
  material_id: string; // UUID del material
  user_id: string; // UUID del creador
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  material?: StudyMaterial;
}


// DTOs para operaciones CRUD
export interface SummaryCreateDTO {
  material_id: string;
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
}

export interface SummaryUpdateDTO {
  content?: string;
  format?: "bullet_points" | "paragraph" | "structured";
}

// Opciones para generación de resúmenes
export interface GenerateSummaryOptions {
  format?: "bullet_points" | "paragraph" | "structured";
  length?: "short" | "medium" | "long";
  complexity?: "easy" | "medium" | "hard";
}

// Filtros para resúmenes
export interface SummaryFilters {
  page?: number;
  limit?: number;
  materialId?: string;
}

// Tipos de visualización
export type SummaryView = 'full' | 'compact' | 'list'; 