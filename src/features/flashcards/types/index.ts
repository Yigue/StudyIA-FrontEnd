export interface FlashcardFilters {
  subject: string;
  difficulty: string;
  status: string;
  search: string;
}

export interface FlashcardStats {
  totalCards: number;
  reviewedToday: number;
  masteredCards: number;
  needsReview: number;
}
