export interface Summary {
  id: string;
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  material?: {
    id: string;
    title: string;
    description: string;
  };
}