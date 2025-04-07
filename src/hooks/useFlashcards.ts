import { useCallback, useMemo } from 'react';
import { 
  useFlashcardsQuery, 
  useCreateFlashcard, 
  useUpdateFlashcard, 
  useDeleteFlashcard, 
  useReviewFlashcard,
  useStudyFlashcards,
  useToggleArchiveFlashcard,
} from './queries/useFlashcardsQuery';
import { FlashcardCreateDTO, FlashcardUpdateDTO, FlashcardReviewDTO } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as flashcardService from '../services/flashcards/flashcardService';

/**
 * Hook compatible que proporciona la misma interfaz que la versión anterior
 * pero utiliza React Query internamente.
 */
export const useFlashcards = () => {
  const [currentFlashcardId, setCurrentFlashcardId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Queries
  const { data: flashcardsData, isLoading, error } = useFlashcardsQuery();
  const { data: studyFlashcardsData } = useStudyFlashcards();
  // Mutaciones
  const createFlashcardMutation = useCreateFlashcard();
  const updateFlashcardMutation = useUpdateFlashcard();
  const deleteFlashcardMutation = useDeleteFlashcard();
  const reviewFlashcardMutation = useReviewFlashcard();
  const toggleArchiveFlashcardMutation = useToggleArchiveFlashcard();

  // Datos derivados
  const flashcards = useMemo(() => flashcardsData || [], [flashcardsData]);
  
  const currentFlashcard = useMemo(() => {
    if (!currentFlashcardId) return null;
    return flashcards.find(card => card.id === currentFlashcardId) || null;
  }, [currentFlashcardId, flashcards]);

  // Funciones con interfaz compatible con la versión anterior
  const getAllFlashcards = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['flashcards', 'list'] });
    return flashcards;
  }, [queryClient, flashcards]);


  const getStudyFlashcards = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['flashcards', 'study'] });
    
    return studyFlashcardsData;
  }, [queryClient, studyFlashcardsData]);

  const getFlashcardById = useCallback(async (id: string) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['flashcards', 'detail', id],
      queryFn: () => flashcardService.getFlashcardById(id)
    });
    return data;
  }, [queryClient]);

  const getFlashcardsByMaterial = useCallback(async (materialId: string) => {
    const { data: materialFlashcards } = await queryClient.fetchQuery({
      queryKey: ['flashcards', 'byMaterial', materialId],
      queryFn: () => flashcardService.getFlashcardsByMaterial(materialId)
    });
    return materialFlashcards;
  }, [queryClient]);

  const createFlashcard = useCallback(async (flashcard: FlashcardCreateDTO) => {
    const result = await createFlashcardMutation.mutateAsync(flashcard);
    return result.data;
  }, [createFlashcardMutation]);

  const updateFlashcard = useCallback(async (id: string, flashcard: FlashcardUpdateDTO) => {
    const result = await updateFlashcardMutation.mutateAsync({ id, flashcard });
    return result.data;
  }, [updateFlashcardMutation]);

  const deleteFlashcard = useCallback(async (id: string) => {
    await deleteFlashcardMutation.mutateAsync(id);
  }, [deleteFlashcardMutation]);

  const reviewFlashcard = useCallback(async (id: string, review: FlashcardReviewDTO) => {
    const result = await reviewFlashcardMutation.mutateAsync({ id, review });
    return result.data;
  }, [reviewFlashcardMutation]);

  const toggleArchiveFlashcard = useCallback(async (id: string) => {
    const result = await toggleArchiveFlashcardMutation.mutateAsync(id);
    return result.data;
  }, [toggleArchiveFlashcardMutation]);

  // Simulación de paginación para compatibilidad
  const pagination = useMemo(() => ({
    currentPage: 1,
    totalPages: 1,
    pageSize: flashcards.length,
    totalItems: flashcards.length
  }), [flashcards]);

  const setCurrentFlashcard = useCallback((id: string | null) => {
    setCurrentFlashcardId(id);
  }, []);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query, pero podemos dejar esta función
    // vacía para mantener compatibilidad
  }, []);

  // Funciones para compatibilidad
  const filterByDifficulty = useCallback((difficulty: string | number) => {
    return flashcards.filter(card => 
      card.difficulty === difficulty || 
      (typeof card.difficulty === 'string' && typeof difficulty === 'number' && parseInt(card.difficulty) === difficulty) ||
      (typeof card.difficulty === 'number' && typeof difficulty === 'string' && card.difficulty === parseInt(difficulty))
    );
  }, [flashcards]);

  const searchFlashcards = useCallback((searchTerm: string) => {
    if (!searchTerm) return flashcards;
    const term = searchTerm.toLowerCase();
    return flashcards.filter(card => 
      card.question.toLowerCase().includes(term) || 
      card.answer.toLowerCase().includes(term)
    );
  }, [flashcards]);

  // Retornar objeto con misma estructura que el hook original
  return useMemo(() => ({
    // Datos
    flashcards,
    currentFlashcard,
    
    // Estado
    loading: {
      isLoading,
    },
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    pagination,
    
    // Acciones
    getAllFlashcards,
    getFlashcardById,
    getFlashcardsByMaterial,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    toggleArchiveFlashcard,
    setCurrentFlashcard,
    clearError,
    getStudyFlashcards,
    
    // Utilidades
    filterByDifficulty,
    searchFlashcards,
    hasMorePages: false, // Simulado para compatibilidad
    refreshInBackground: getAllFlashcards
  }), [
    flashcards,
    currentFlashcard,
    isLoading,
    error,
    pagination,
    getAllFlashcards,
    getFlashcardById,
    getFlashcardsByMaterial,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    toggleArchiveFlashcard,
    setCurrentFlashcard,
    clearError,
    filterByDifficulty,
    searchFlashcards,
    getStudyFlashcards
  ]);
};

/**
 * Hook para verificar si los datos están "frescos"
 */
export const useFlashcardsStatus = () => {
  const { isLoading, error } = useFlashcardsQuery();

  return useMemo(() => ({
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    clearError: () => {},
    lastFetched: Date.now(),
    isFresh: true // Siempre fresco con React Query
  }), [isLoading, error]);
};

/**
 * Hook para acceder al flashcard actual
 */
export const useCurrentFlashcard = () => {
  const [currentFlashcardId, setCurrentFlashcardId] = useState<string | null>(null);
  const { data: flashcards = [] } = useFlashcardsQuery();

  const currentFlashcard = useMemo(() => {
    if (!currentFlashcardId) return null;
    return flashcards.find(card => card.id === currentFlashcardId) || null;
  }, [currentFlashcardId, flashcards]);

  const setCurrentFlashcard = useCallback((id: string | null) => {
    setCurrentFlashcardId(id);
  }, []);

  return useMemo(() => ({ 
    currentFlashcard, 
    setCurrentFlashcard 
  }), [currentFlashcard, setCurrentFlashcard]);
};
