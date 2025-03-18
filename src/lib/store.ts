import { create } from 'zustand';
import { mockFlashcards, mockSubjects } from './mockData';

interface StudyState {
  // Flashcards
  flashcards: any[];
  filteredFlashcards: any[];
  currentFlashcard: number;
  favorites: string[];
  studyMode: 'test' | 'review' | 'memorize';
  
  // Materials
  materials: any[];
  currentMaterial: any | null;
  
  // Filters
  filters: {
    subject: string;
    difficulty: string;
    status: string;
    search: string;
    tags: string[];
  };
  
  // Study Progress
  progress: {
    cardsStudied: number;
    correctAnswers: number;
    studyTime: number;
    lastStudyDate: string;
    streak: number;
    experience: number;
    level: number;
    achievements: string[];
  };

  // Actions
  setFlashcards: (flashcards: any[]) => void;
  filterFlashcards: () => void;
  toggleFavorite: (id: string) => void;
  setStudyMode: (mode: 'test' | 'review' | 'memorize') => void;
  updateProgress: (correct: boolean) => void;
  setFilters: (filters: Partial<StudyState['filters']>) => void;
  setCurrentMaterial: (material: any) => void;
  setCurrentFlashcard: (index: number) => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  // Initial State
  flashcards: mockFlashcards,
  filteredFlashcards: mockFlashcards,
  currentFlashcard: 0,
  favorites: [],
  studyMode: 'review',
  materials: [],
  currentMaterial: null,
  
  filters: {
    subject: 'all',
    difficulty: 'all',
    status: 'all',
    search: '',
    tags: [],
  },
  
  progress: {
    cardsStudied: 0,
    correctAnswers: 0,
    studyTime: 0,
    lastStudyDate: new Date().toISOString(),
    streak: 0,
    experience: 0,
    level: 1,
    achievements: [],
  },

  // Actions
  setFlashcards: (flashcards) => set({ flashcards, filteredFlashcards: flashcards }),
  
  filterFlashcards: () => {
    const { flashcards, filters } = get();
    let filtered = [...flashcards];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(searchTerm) ||
        card.answer.toLowerCase().includes(searchTerm) ||
        card.material.title.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(card => 
        card.material.subject.name === filters.subject
      );
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => 
        card.difficulty === parseInt(filters.difficulty)
      );
    }

    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(card => {
        const reviewDate = new Date(card.next_review);
        switch (filters.status) {
          case 'pending':
            return reviewDate > now;
          case 'due':
            return reviewDate <= now;
          case 'completed':
            return false;
          default:
            return true;
        }
      });
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

  setStudyMode: (mode) => set({ studyMode: mode }),

  updateProgress: (correct) => {
    set((state) => {
      const newExperience = state.progress.experience + (correct ? 10 : 5);
      const experiencePerLevel = 100;
      const newLevel = Math.floor(newExperience / experiencePerLevel) + 1;
      
      return {
        progress: {
          ...state.progress,
          cardsStudied: state.progress.cardsStudied + 1,
          correctAnswers: state.progress.correctAnswers + (correct ? 1 : 0),
          lastStudyDate: new Date().toISOString(),
          experience: newExperience,
          level: newLevel,
        }
      };
    });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().filterFlashcards();
  },

  setCurrentMaterial: (material) => set({ currentMaterial: material }),
  
  setCurrentFlashcard: (index) => set({ currentFlashcard: index }),
}));