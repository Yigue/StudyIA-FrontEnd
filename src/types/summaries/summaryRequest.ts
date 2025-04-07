export interface SummaryCreateDTO {
  material_id: string;
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
}

export interface SummaryUpdateDTO {
  content?: string;
  format?: "bullet_points" | "paragraph" | "structured";
}
