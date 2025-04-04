declare module "@/types" {
  export interface Tag {
    id: string;
    name: string;
    description?: string;
    userId?: string;
    color?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface FileAttachment {
    id: string;
    url: string;
    filename: string;
    mimetype?: string;
    size?: number;
    createdAt?: string;
  }

  export interface StudyMaterial {
    id: string;
    title: string;
    content?: string | null;
    description?: string | null;
    file_url?: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    type: string;
    status?: 'draft' | 'processing' | 'completed';
    tags: Tag[];
    attachments: FileAttachment[];
    metadata?: Record<string, unknown>;
  }

  export interface Flashcard {
    id: string;
    material_id: string;
    materialId?: string;
    question: string;
    answer: string;
    difficulty?: number;
    lastReviewed?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface Summary {
    id: string;
    material_id: string;
    materialId?: string;
    content?: string;
    summary_text?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface CreateMaterialDTO {
    title: string;
    content?: string;
    description?: string;
    tags?: string[];
    file?: File;
    userId: string;
    type: "text" | "file";
  }

  export interface ProcessingOptions {
    generateSummary: boolean;
    generateFlashcards: boolean;
  }

  export interface ProcessOptions {
    generate_summary: boolean;
    generate_flashcards: boolean;
    summary_options: Record<string, unknown>;
    flashcards_options: Record<string, unknown>;
    onProgress?: (progress: number) => void;
  }

  export interface Params {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    userId?: string;
  }

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
} 