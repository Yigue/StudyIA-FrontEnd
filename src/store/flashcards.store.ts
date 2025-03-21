import { create } from "zustand";
import { Flashcard } from "../types";
import * as flashcardService from "../services/flashcards/flashcardService";
import { ReviewDTO } from "../types/flashcards/flashcardsRequest";

interface FlashcardsStore {
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getAllFlashcards: (token: string) => Promise<void>;
  getFlashcardsByMaterial: (materialId: string, token: string) => Promise<void>;
  getFlashcardsForReview: (token: string) => Promise<void>;
  updateFlashcardReview: (
    id: string,
    difficulty: ReviewDTO,
    token: string
  ) => Promise<void>;
  archiveFlashcard: (id: string, token: string) => Promise<void>;
  setCurrentFlashcard: (flashcard: Flashcard | null) => void;
  clearError: () => void;
}

export const useFlashcardsStore = create<FlashcardsStore>((set) => ({
  flashcards: [],
  currentFlashcard: null,
  isLoading: false,
  error: null,

  getAllFlashcards: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getAllFlashcards(token);
      set({ flashcards: response.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Error loading flashcards",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getFlashcardsByMaterial: async (materialId, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getFlashcardsByMaterial(
        materialId,
        token
      );
      set({ flashcards: response.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error loading material flashcards",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getFlashcardsForReview: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getFlashcardsForReview(token);
      set({ flashcards: response.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error loading review flashcards",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFlashcardReview: async (id, difficulty, token) => {
    try {
      set({ isLoading: true, error: null });
      await flashcardService.updateFlashcardReview(id, difficulty, token);
      // Refresh flashcards after update
      const response = await flashcardService.getAllFlashcards(token);
      set({ flashcards: response.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Error updating flashcard",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  archiveFlashcard: async (id, token) => {
    try {
      set({ isLoading: true, error: null });
      await flashcardService.archiveFlashcard(id, token);
      // Update flashcards list after archiving
      set((state) => ({
        flashcards: state.flashcards.filter((f) => f.id !== id),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Error archiving flashcard",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFlashcard: (flashcard) => set({ currentFlashcard: flashcard }),
  clearError: () => set({ error: null }),
}));
