export interface ReviewDTO{
  difficulty: number;
  next_review: string;
}


export enum DifficultyLevel {
  Easy = "easy",
  Medium = "normal",
  Hard = "hard",
}

export interface FlashcardCreateDTO {
  material_id: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}

export interface FlashcardUpdateDTO {
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}

export interface FlashcardReviewDTO {
  rating: number; // Valor del 1 al 5
  notes?: string;
}