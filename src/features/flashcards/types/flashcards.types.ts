export interface FlashcardFilters {
  difficulty: string;
  subject: string;
  status: string;
}

export interface FlashcardStats {
  total: number;
  filtered: number;
  current: number;
}

export interface Tag {
  id: string;
  name: string;
} 