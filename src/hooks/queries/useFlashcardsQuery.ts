import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as flashcardService from '../../services/flashcards/flashcardService';
import { ApiResponse } from '../../types/api';
import { 
  Flashcard, 
  FlashcardCreateDTO, 
  FlashcardUpdateDTO, 
  FlashcardReviewDTO,
  FlashcardStudyResponse,
  FlashcardReviewResponse 
} from '../../types/flashcards';
import { QueryParams } from '../../types/common';


// Claves de query estructuradas para flashcards
export const flashcardsKeys = {
  all: ['flashcards'] as const,
  lists: () => [...flashcardsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) => [...flashcardsKeys.lists(), filters] as const,
  details: () => [...flashcardsKeys.all, 'detail'] as const,
  detail: (id: string) => [...flashcardsKeys.details(), id] as const,
  byMaterial: (materialId: string) => [...flashcardsKeys.all, 'by-material', materialId] as const,
  study: () => [...flashcardsKeys.all, 'study'] as const,
};


export const useFlashcardsQuery = (params?: QueryParams) => {
  return useQuery<ApiResponse<Flashcard[]>, Error, Flashcard[]>({
    queryKey: flashcardsKeys.list(params || {}),
    queryFn: () => flashcardService.getAllFlashcards(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener una flashcard específica por ID
 */
export const useFlashcardQuery = (id: string) => {
  return useQuery<ApiResponse<Flashcard>, Error, Flashcard>({
    queryKey: flashcardsKeys.detail(id),
    queryFn: () => flashcardService.getFlashcardById(id),
    select: (response) => response.data,
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

/**
 * Hook para obtener flashcards para estudio
 */
export const useStudyFlashcards = () => {
  return useQuery<ApiResponse<FlashcardStudyResponse[]>, Error, FlashcardStudyResponse[]>({
    queryKey: flashcardsKeys.study(),
    queryFn: () => flashcardService.getStudyFlashcards(),
    select: (response) => response.data,
    staleTime: 1 * 60 * 1000, // 1 minuto para datos de estudio
  });
};

/**
 * Hook para obtener flashcards de un material específico
 */
export const useFlashcardsByMaterialQuery = (materialId: string) => {
  return useQuery<ApiResponse<Flashcard[]>, Error, Flashcard[]>({
    queryKey: flashcardsKeys.byMaterial(materialId),
    queryFn: () => flashcardService.getFlashcardsByMaterial(materialId),
    select: (response) => response.data,
    enabled: !!materialId,
  });
};

/**
 * Hook para crear una nueva flashcard
 */
export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Flashcard>, Error, FlashcardCreateDTO>({
    mutationFn: (data: FlashcardCreateDTO) => flashcardService.createFlashcard(data),
    onSuccess: (response) => {
      // Invalidar las listas para forzar recarga
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      // Actualizar caché con la nueva flashcard
      queryClient.setQueryData(
        flashcardsKeys.detail(response.data.id), 
        response
      );
      // Si estamos en una vista de material, actualizar esa lista también
      if (response.data.materialId) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.materialId) 
        });
      }
    },
  });
};

/**
 * Hook para actualizar una flashcard
 */
export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Flashcard>, Error, { id: string; flashcard: FlashcardUpdateDTO }>({
    mutationFn: ({ id, flashcard }) => 
      flashcardService.updateFlashcard(id, flashcard),
    onSuccess: (response, variables) => {
      // Invalidar listas y detalles específicos
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.detail(variables.id) });
      // Si tenemos el materialId, actualizar esa lista específica
      if (response.data.materialId) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.materialId) 
        });
      }
      // También actualizar flashcards pendientes si la hubiera
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.study() });
    },
  });
};

/**
 * Hook para marcar una flashcard como revisada
 */
export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<{ review: FlashcardReviewResponse; flashcard: { id: string; lastReviewed: string; } }>, Error, { id: string; review: FlashcardReviewDTO }>({
    mutationFn: ({ id, review }) => 
      flashcardService.reviewFlashcard(id, review),
    onSuccess: (_, variables) => {
      // Invalidar listas y detalles específicos
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.detail(variables.id) });
      // Actualizar lista de pendientes
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.study() });
    },
  });
};

/**
 * Hook para eliminar una flashcard
 */
export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id: string) => flashcardService.deleteFlashcard(id),
    onSuccess: (_, id) => {
      // Invalidar listas y eliminar detalles específicos
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      queryClient.removeQueries({ queryKey: flashcardsKeys.detail(id) });
      // También actualizar pendientes
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.study() });
    },
  });
};

/**
 * Hook para archivar/desarchivar una flashcard
 */
export const useToggleArchiveFlashcard = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<Flashcard>, Error, string>({
    mutationFn: (id: string) => flashcardService.toggleArchiveFlashcard(id),
    onSuccess: (response, id) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.detail(id) });
      
      // Si tenemos el materialId, actualizar esa lista específica
      if (response.data.materialId) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.materialId) 
        });
      }
      
      // También actualizar pendientes
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.study() });
    },
  });
}; 