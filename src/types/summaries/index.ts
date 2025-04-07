/**
 * Tipos relacionados con resúmenes
 */

// Entidad principal de resumen
export interface Summary {
  id: string;
  materialId: string;
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
  createdAt: string;
  updatedAt: string;
}

// Resumen con detalles del material
export interface SummaryWithMaterial extends Summary {
  material: {
    id: string;
    title: string;
    description?: string | null;
  };
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