export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  summary: string;
  created_at: string;
  subject: {
    name: string;
  };
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
  next_review: string;
  material_id: string;
}
