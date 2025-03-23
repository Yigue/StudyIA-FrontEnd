import { useFlashcardsStore } from "../store/flashcards.store";
import { useMemo } from "react";

export const useFlashcards = () => {
  const { flashcards, currentFlashcard, isLoading, error } = useFlashcardsStore();
  
  return {
    flashcards,
    currentFlashcard,
    isLoading,
    error,
  };
};

export const useFlashcardsActions = () => {
  const { 
    getAllFlashcards, 
    getFlashcardsByMaterial, 
    getFlashcardsForReview,
    getFlashcardsForReviewMaterial,
    updateFlashcardReview,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    archiveFlashcard,
    setCurrentFlashcard,
    clearError 
  } = useFlashcardsStore();
  
  return {
    getAllFlashcards,
    getFlashcardsByMaterial,
    getFlashcardsForReview,
    getFlashcardsForReviewMaterial,
    updateFlashcardReview,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    archiveFlashcard,
    setCurrentFlashcard,
    clearError,
  };
};

export const useFlashcardsStatus = () => {
  const isLoading = useFlashcardsStore(state => state.isLoading);
  const currentFlashcard = useFlashcardsStore(state => state.currentFlashcard);
  
  return useMemo(() => ({
    isLoading,
    currentFlashcard
  }), [isLoading, currentFlashcard]);
};
