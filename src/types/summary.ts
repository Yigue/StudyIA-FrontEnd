import { StudyMaterial } from "./StudyMaterial";


export interface Summary {
  id: string;
  user_id: string;
  material_id: string | null;
  summary_text: string;
  tags: string[];
  ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
  material?: StudyMaterial;
}