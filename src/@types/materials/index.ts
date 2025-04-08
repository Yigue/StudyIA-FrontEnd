/**
 * Tipos relacionados con materiales de estudio
 */
import { Tag } from '../tags';
import { ProcessingStatus } from '../api';

// Entidad principal de material de estudio
export interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  content: string | null;
  processingStatus: ProcessingStatus | null;
  userId: string;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// DTOs para operaciones CRUD
export interface MaterialCreateDTO {
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
}

export interface MaterialUpdateDTO {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
}

// Respuesta simplificada
export interface MaterialSummary {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  processingStatus: ProcessingStatus | null;
  createdAt: string;
}

// Estado de procesamiento
export interface ProcessingStatusResponse {
  processingStatus: ProcessingStatus | null;
  message: string;
}

// Filtros para materiales
export interface MaterialFilters {
  search?: string;
  tags?: string[];
  status?: ProcessingStatus;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Estadísticas de materiales
export interface MaterialStats {
  total: number;
  processed: number;
  failed: number;
  pending: number;
  withFlashcards: number;
  withSummaries: number;
}

// Tipos de carga
export enum MaterialUploadType {
  Text = 'text',
  File = 'file',
  URL = 'url'
}

// Estado de carga de archivos
export interface FileUploadState {
  progress: number;
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  fileName: string | null;
} 