import { create } from 'zustand';
import { mockFlashcards } from '../../../lib/mockData';
import { Flashcard } from '../../../types';
import { flashcardService } from '../services/flashcardService';

interface FlashcardsState {
  flashcards: Flashcard[];
  filteredFlashcards: Flashcard[];
  currentFlashcard: number;
  favorites: string[];
  studyMode: 'test' | 'review' | 'memorize';
  loading: boolean;
  error: string | null;
  
  // Actions
  setFlashcards: (flashcards: Flashcard[]) => void;
  filterFlashcards: () => void;
  toggleFavorite: (id: string) => void;
  setStudyMode: (mode: 'test' | 'review' | 'memorize') => void;
  setCurrentFlashcard: (index: number) => void;
  fetchFlashcards: () => Promise<void>;
}

export const useFlashcardsStore = create<FlashcardsState>((set, get) => ({
  flashcards: mockFlashcards,
  filteredFlashcards: mockFlashcards,
  currentFlashcard: 0,
  favorites: [],
  studyMode: 'review',
  loading: false,
  error: null,

  setFlashcards: (flashcards) => set({ flashcards, filteredFlashcards: flashcards }),
  
  filterFlashcards: () => {
    const { flashcards, favorites, studyMode } = get();
    let filtered = [...flashcards];

    // Implementar lógica de filtrado según el modo de estudio
    switch (studyMode) {
      case 'test':
        filtered = filtered.sort(() => Math.random() - 0.5);
        break;
      case 'review':
        filtered = filtered.sort((a, b) => 
          new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
        );
        break;
      case 'memorize':
        filtered = filtered.filter(card => favorites.includes(card.id));
        break;
    }

    set({ filteredFlashcards: filtered });
  },

  toggleFavorite: (id) => {
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter(fid => fid !== id)
        : [...state.favorites, id]
    }));
  },

  setStudyMode: (mode) => {
    set({ studyMode: mode });
    get().filterFlashcards();
  },

  setCurrentFlashcard: (index) => set({ currentFlashcard: index }),

  fetchFlashcards: async () => {
    set({ loading: true, error: null });
    try {
      const flashcards = await flashcardService.getFlashcards();
      set({ flashcards, filteredFlashcards: flashcards });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error fetching flashcards' });
    } finally {
      set({ loading: false });
    }
  },
}));
