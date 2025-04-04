export interface Summary {
  id: string;

  summary_text: string;
  format: "bullet_points" | "paragraph" | "structured";
  material_id: string; // UUID del material
  user_id: string; // UUID del creador
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  material?: {
    id: string;
    title: string;
    description: string;
  };
}
