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
  tags?: string[];
  userId?: string;
}

// Tipos de entidades
export interface Tag {
  id: string;
  name: string;
  description?: string;
  userId?: string;
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
  content?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  type?: 'pdf' | 'text' | 'doc' | 'image' | 'video' | 'audio' | 'other' | string;
  tags?: string[];
  status?: 'processing' | 'completed' | 'failed' | 'pending' | string;
  source?: string;
  summary_id?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  thumbnail?: string;
  language?: string;
  page_count?: number;
  attachments?: Record<string, string | number | boolean>[];
}

// Tipo para opciones API procesamiento
export interface ApiProcessingOptions {
  generate_summary: boolean;
  generate_flashcards: boolean;
  summary_options: Record<string, unknown>;
  flashcards_options: Record<string, unknown>;
}

// Tipo para flashcards
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  material_id?: string;
  created_at?: string;
  updated_at?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  tags?: string[];
  front?: string;
  back?: string;
  metadata?: Record<string, string | number | boolean>;
}

// Tipo para resúmenes
export interface Summary {
  id: string;
  materialId?: string;
  material_id: string; // Para compatibilidad
  content: string;
  title?: string; // Para compatibilidad
  fileUrl?: string; // Para compatibilidad
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialDTO {
  title: string;
  content?: string;
  tags?: string[];
  file?: File;
  userId: string;
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
  uploadProgress: number | null;
  processingStatus: string | null;
}
