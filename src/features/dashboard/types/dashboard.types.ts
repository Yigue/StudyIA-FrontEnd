export interface StudyStats {
  totalMaterials: number;
  totalFlashcards: number;
  studyHours: number;
  achievements: number;
  streak: number;
}

export interface StudySession {
  date: string;
  duration: number;
}

export interface FlashcardReview {
  question: string;
  next_review: string;
  difficulty: number;
}
