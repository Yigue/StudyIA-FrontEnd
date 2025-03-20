export interface FlashcardFilters {
  difficulty: string;
  subject: string;
  status: string;
}

export interface FlashcardStats {
  total: number;
  filtered: number;
  current: number;
  total: number;
}

export interface ReviewFlashcard {
  id: string;
  question: string;
  answer: string;
  material: {
    title: string;
    subject: {
      name: string;
    }
  };
  next_review: string;
  difficulty: number;
}
