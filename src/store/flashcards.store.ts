import { create } from "zustand";
import { Flashcard } from "../types";
import { ReviewDTO } from "../types/flashcards/flashcardsRequest";
import * as flashcardService from "../services/flashcards/flashcardService";

interface FlashcardsStore {
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getAllFlashcards: () => Promise<void>;
  getFlashcardsByMaterial: (materialId: string) => Promise<void>;
  getFlashcardsForReview: () => Promise<void>;
  updateFlashcardReview: (
    id: string,
    difficulty: ReviewDTO
  ) => Promise<void>;
  archiveFlashcard: (id: string) => Promise<void>;
  setCurrentFlashcard: (flashcard: Flashcard | null) => void;
  clearError: () => void;
}

export const useFlashcardsStore = create<FlashcardsStore>((set) => ({
  flashcards: [],
  currentFlashcard: null,
  isLoading: false,
  error: null,

  getAllFlashcards: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getAllFlashcards();
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

  getFlashcardsByMaterial: async (materialId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getFlashcardsByMaterial(
        materialId
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

  getFlashcardsForReview: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.getFlashcardsForReview();
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

  updateFlashcardReview: async (id, difficulty) => {
    try {
      set({ isLoading: true, error: null });
      const response = await flashcardService.updateFlashcardReview(
        id,
        difficulty
      );
      set((state) => ({
        flashcards: state.flashcards.map((flashcard) =>
          flashcard.id === id ? response.data : flashcard
        ),
        currentFlashcard:
          state.currentFlashcard?.id === id ? response.data : state.currentFlashcard,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error updating flashcard review",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  archiveFlashcard: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await flashcardService.archiveFlashcard(id);
      set((state) => ({
        flashcards: state.flashcards.filter((f) => f.id !== id),
        currentFlashcard: state.currentFlashcard?.id === id ? null : state.currentFlashcard,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error archiving flashcard",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFlashcard: (flashcard) => set({ currentFlashcard: flashcard }),
  clearError: () => set({ error: null }),
}));
