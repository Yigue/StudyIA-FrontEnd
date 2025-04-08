/**
 * Tipos relacionados con resúmenes de materiales
 */
import { SummaryFormat } from '../api';

// Entidad principal de resumen
export interface Summary {
  id: string;
  content: string;
  format: SummaryFormat;
  materialId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs para operaciones CRUD
export interface SummaryCreateDTO {
  material_id: string;
  content: string;
  format: SummaryFormat;
}

export interface SummaryUpdateDTO {
  content?: string;
  format?: SummaryFormat;
}

// Respuesta simplificada
export interface SummarySummary {
  id: string;
  content: string; // Puede ser solo un extracto
  format: SummaryFormat;
  materialId: string;
  material?: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Respuesta detallada
export interface SummaryDetailed {
  id: string;
  content: string; // Contenido completo
  format: SummaryFormat;
  material: {
    id: string;
    title: string;
    description: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

// Opciones para generación de resúmenes
export interface SummaryGenerationOptions {
  format?: SummaryFormat;
  length?: 'short' | 'medium' | 'long';
  complexity?: 'easy' | 'medium' | 'hard';
}

// Filtros para resúmenes
export interface SummaryFilters {
  search?: string;
  format?: SummaryFormat;
  materialId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
} 