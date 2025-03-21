import { useFlashcardsStore } from "../store/flashcards.store";

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
    updateFlashcardReview,
    archiveFlashcard,
    setCurrentFlashcard,
    clearError 
  } = useFlashcardsStore();
  
  return {
    getAllFlashcards,
    getFlashcardsByMaterial,
    getFlashcardsForReview,
    updateFlashcardReview,
    archiveFlashcard,
    setCurrentFlashcard,
    clearError,
  };
};

export const useFlashcardsStatus = () => useFlashcardsStore(state => ({
  isLoading: state.isLoading,
  currentFlashcard: state.currentFlashcard
}));
