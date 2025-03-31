import { Tag } from "../tag/tag";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: Tag[];
  archived: boolean;
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  lastReviewed: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  material?: {
    id: string;
    title: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    notes: string;
    createdAt: string;
  }>;
}

export interface FlashcardReview {
  id: string;
  rating: number; // 1-5
  notes: string | null;
  flashcardId: string;
  userId: string;
  createdAt: string; // ISO 8601
}

