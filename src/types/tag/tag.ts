export interface Tag {
  id: string;
  name: string;
  color: string; // Código hexadecimal ej: "#FF5733"
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  count?: number;
}
