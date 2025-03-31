import { useCallback, useMemo } from 'react';
import { useFlashcardsStore } from '../store/flashcards.store';
import { Flashcard } from '../types/flashcards/flashcards';

// Hook principal para acceder a flashcards con selección optimizada y memoización
export const useFlashcards = () => {
  // Selectores optimizados de datos del store
  const state = useFlashcardsStore();
  const { 
    entities,
    ids, 
    currentFlashcardId, 
    status, 
    pagination,
  } = state;

  // Acciones más utilizadas del store
  const actions = {
    getAllFlashcards: state.getAllFlashcards,
    getFlashcardById: state.getFlashcardById,
    getFlashcardsByMaterial: state.getFlashcardsByMaterial,
    getFlashcardsForReview: state.getFlashcardsForReview,
    getFlashcardsForReviewMaterial: state.getFlashcardsForReviewMaterial,
    reviewFlashcard: state.reviewFlashcard,
    createFlashcard: state.createFlashcard,
    updateFlashcard: state.updateFlashcard,
    deleteFlashcard: state.deleteFlashcard,
    toggleArchiveFlashcard: state.toggleArchiveFlashcard,
    setCurrentFlashcard: state.setCurrentFlashcard,
    clearError: state.clearError,
    setCurrentPage: state.setCurrentPage,
    filterByDifficulty: state.filterByDifficulty,
    searchFlashcards: state.searchFlashcards,
    refreshInBackground: state.refreshInBackground,
  };

  // Datos derivados memoizados
  const flashcards = useMemo(
    () => ids.map((id) => entities[id]).filter(Boolean),
    [ids, entities]
  );

  const currentFlashcard = useMemo(
    () => (currentFlashcardId ? entities[currentFlashcardId] : null),
    [currentFlashcardId, entities]
  );

  // Acciones envueltas en useCallback para evitar renderizados innecesarios
  const getAllFlashcards = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      difficulty?: "easy" | "medium" | "hard";
      tags?: string;
      archived?: boolean;
    }) => {
      try {
        await actions.getAllFlashcards(params);
      } catch (error) {
        console.error('Error al obtener flashcards:', error);
        throw error;
      }
    },
    [actions.getAllFlashcards]
  );

  const getFlashcardById = useCallback(
    async (id: string) => {
      await actions.getFlashcardById(id);
      return entities[id] || null;
    },
    [actions.getFlashcardById, entities]
  );

  const searchFlashcards = useCallback(
    (searchTerm: string): Flashcard[] => {
      return actions.searchFlashcards(searchTerm);
    },
    [actions.searchFlashcards]
  );

  const filterByDifficulty = useCallback(
    (difficulty: "easy" | "medium" | "hard" | null): Flashcard[] => {
      return actions.filterByDifficulty(difficulty);
    },
    [actions.filterByDifficulty]
  );

  return {
    // Datos
    flashcards,
    currentFlashcard,
    
    // Estado
    loading: {
      isLoading: status.isLoading,
      lastFetch: status.lastFetch,
    },
    error: status.error,
    pagination,
    
    // Acciones
    getAllFlashcards,
    getFlashcardById,
    getFlashcardsByMaterial: actions.getFlashcardsByMaterial,
    getFlashcardsForReview: actions.getFlashcardsForReview,
    getFlashcardsForReviewMaterial: actions.getFlashcardsForReviewMaterial,
    reviewFlashcard: actions.reviewFlashcard,
    createFlashcard: actions.createFlashcard,
    updateFlashcard: actions.updateFlashcard,
    deleteFlashcard: actions.deleteFlashcard,
    toggleArchiveFlashcard: actions.toggleArchiveFlashcard,
    setCurrentFlashcard: actions.setCurrentFlashcard,
    setCurrentPage: actions.setCurrentPage,
    clearError: actions.clearError,
    
    // Utilidades
    searchFlashcards,
    filterByDifficulty,
    refreshInBackground: actions.refreshInBackground,
    hasMorePages: pagination.currentPage < pagination.totalPages,
    canGoToNextPage: pagination.currentPage < pagination.totalPages,
    canGoToPreviousPage: pagination.currentPage > 1,
  };
};

// Hook para verificar si los datos están "frescos"
export const useFlashcardsStatus = () => {
  const status = useFlashcardsStore(state => state.status);
  const clearError = useFlashcardsStore(state => state.clearError);

  return {
    isLoading: status.isLoading,
    error: status.error,
    clearError,
    lastFetched: status.lastFetch,
    isFresh: Boolean(status.lastFetch && (Date.now() - status.lastFetch) < 5 * 60 * 1000) // 5 minutos
  };
};

// Hook para acceder al flashcard actual
export const useCurrentFlashcard = () => {
  const entities = useFlashcardsStore(state => state.entities);
  const currentFlashcardId = useFlashcardsStore(state => state.currentFlashcardId);
  const setCurrentFlashcard = useFlashcardsStore(state => state.setCurrentFlashcard);

  const currentFlashcard = useMemo(
    () => (currentFlashcardId ? entities[currentFlashcardId] : null),
    [currentFlashcardId, entities]
  );

  return { 
    currentFlashcard, 
    setCurrentFlashcard 
  };
};
