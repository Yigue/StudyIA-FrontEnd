import { Tag } from "../tag/tag";

export interface ReviewDTO {
  difficulty: "again" | "hard" | "good" | "easy";
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
  type: "text" | "image";
  difficulty?: "easy" | "medium" | "hard";
  tags?: Tag[]; // Array de IDs de etiquetas
}

export interface FlashcardUpdateDTO {
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: Tag[]; // Array de IDs de etiquetas // Array de IDs de etiquetas
}

export interface FlashcardReviewDTO {
  rating: number; // Valor del 1 al 5
  notes?: string;
}
