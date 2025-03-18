export interface Flashcard {
  id: string;
  user_id: string;
  material_id: string | null;
  summary_id: string | null;
  question: string;
  answer: string;
  difficulty: string;
  active: boolean;
  next_review: Date;
  created_at: Date;
  updated_at: Date;
  type: 'code' | 'normal' | 'multioption';
}