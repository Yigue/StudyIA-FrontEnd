/**
 * Tipos relacionados con etiquetas (tags)
 */

// Entidad principal de tag
export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

// DTOs para operaciones CRUD
export interface TagCreateDTO {
  name: string;
  color?: string;
}

export interface TagUpdateDTO {
  name?: string;
  color?: string;
}

// Respuesta simplificada
export interface TagSummary {
  id: string;
  name: string;
  color: string;
} 