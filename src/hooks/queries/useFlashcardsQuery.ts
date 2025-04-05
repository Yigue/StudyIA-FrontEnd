import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as flashcardService from '../../services/flashcards/flashcardService';
import { FlashcardCreateDTO, FlashcardUpdateDTO, FlashcardReviewDTO } from '../../types';

// Claves de query estructuradas jerárquicamente
export const flashcardsKeys = {
  all: ['flashcards'] as const,
  lists: () => [...flashcardsKeys.all, 'list'] as const,
  list: (filters = {}) => [...flashcardsKeys.lists(), filters] as const,
  details: () => [...flashcardsKeys.all, 'detail'] as const,
  detail: (id: string) => [...flashcardsKeys.details(), id] as const,
  byMaterial: (materialId: string) => [...flashcardsKeys.all, 'byMaterial', materialId] as const,
  forReview: (params = {}) => [...flashcardsKeys.all, 'forReview', params] as const,
};

/**
 * Hook para obtener todas las flashcards con filtros
 */
export const useFlashcardsQuery = (params?: {
  page?: number;
  limit?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string;
  archived?: boolean;
}) => {
  return useQuery({
    queryKey: flashcardsKeys.list(params),
    queryFn: () => flashcardService.getAllFlashcards(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un flashcard específico por ID
 */
export const useFlashcardQuery = (id: string) => {
  return useQuery({
    queryKey: flashcardsKeys.detail(id),
    queryFn: () => flashcardService.getFlashcardById(id),
    select: (response) => response.data,
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

/**
 * Hook para obtener flashcards por material
 */
export const useFlashcardsByMaterialQuery = (materialId: string) => {
  return useQuery({
    queryKey: flashcardsKeys.byMaterial(materialId),
    queryFn: () => flashcardService.getFlashcardsByMaterial(materialId),
    select: (response) => response.data,
    enabled: !!materialId, // Solo ejecutar si hay un ID de material
  });
};

/**
 * Hook para obtener flashcards para repaso
 */
export const useStudyFlashcards = () => {
  return useQuery({
    queryKey: flashcardsKeys.forReview(),
    queryFn: () => flashcardService.getStudyFlashcards(),
    select: (response) => response.data,
  });
};

/**
 * Hook para obtener flashcards para repaso por material
 */
export const useFlashcardsForReviewMaterialQuery = (
  materialId: string,
  params?: {
    limit?: number;
    difficulty?: "easy" | "medium" | "hard";
  }
) => {
  return useQuery({
    queryKey: [...flashcardsKeys.byMaterial(materialId), 'forReview', params],
    queryFn: () => flashcardService.getFlashcardsForReviewMaterial(materialId, params),
    select: (response) => response.data,
    enabled: !!materialId,
  });
};

/**
 * Hook para crear una nueva flashcard
 */
export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flashcard: FlashcardCreateDTO) => 
      flashcardService.createFlashcard(flashcard),
    onSuccess: (response) => {
      // Invalidar todas las listas de flashcards
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      
      // Si la flashcard tiene material_id, invalidar las específicas de ese material
      if (response.data.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.material_id) 
        });
      }
      
      // Actualizar caché con la nueva flashcard
      queryClient.setQueryData(
        flashcardsKeys.detail(response.data.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para actualizar una flashcard
 */
export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; flashcard: FlashcardUpdateDTO }) => 
      flashcardService.updateFlashcard(data.id, data.flashcard),
    onSuccess: (response, variables) => {
      // Invalidar listas y actualizar detalle
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      
      if (response.data.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.material_id) 
        });
      }
      
      queryClient.setQueryData(
        flashcardsKeys.detail(variables.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para registrar revisión de flashcard con actualización optimista
 */
export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; review: FlashcardReviewDTO }) => 
      flashcardService.reviewFlashcard(data.id, data.review),
    // Actualización optimista
    onMutate: async (variables) => {
      // Cancelar queries en curso para este flashcard
      await queryClient.cancelQueries({ 
        queryKey: flashcardsKeys.detail(variables.id) 
      });
      
      // Guardar estado anterior
      const previousFlashcard = queryClient.getQueryData(
        flashcardsKeys.detail(variables.id)
      );
      
      // Actualizar optimistamente
      queryClient.setQueryData(
        flashcardsKeys.detail(variables.id), 
        (old: any) => ({
          ...old,
          data: {
            ...old.data,
            lastReviewed: new Date().toISOString(),
            difficulty: variables.review.difficulty,
          }
        })
      );
      
      // Retornar contexto para rollback
      return { previousFlashcard };
    },
    onError: (_, variables, context) => {
      // Revertir en caso de error
      if (context?.previousFlashcard) {
        queryClient.setQueryData(
          flashcardsKeys.detail(variables.id),
          context.previousFlashcard
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Revalidar datos después de la mutación
      queryClient.invalidateQueries({ 
        queryKey: flashcardsKeys.detail(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: flashcardsKeys.forReview() 
      });
      
      if (variables.id) {
        const flashcardData = queryClient.getQueryData(
          flashcardsKeys.detail(variables.id)
        ) as any;
        
        if (flashcardData?.data?.material_id) {
          queryClient.invalidateQueries({ 
            queryKey: flashcardsKeys.byMaterial(flashcardData.data.material_id) 
          });
        }
      }
    },
  });
};

/**
 * Hook para eliminar una flashcard
 */
export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flashcardService.deleteFlashcard(id),
    onSuccess: (_, id) => {
      // Antes de invalidar, obtener material_id para invalidar consultas específicas
      const flashcardData = queryClient.getQueryData(
        flashcardsKeys.detail(id)
      ) as any;
      
      // Invalidar consultas y eliminar de caché
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      queryClient.removeQueries({ queryKey: flashcardsKeys.detail(id) });
      
      if (flashcardData?.data?.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(flashcardData.data.material_id) 
        });
      }
    },
  });
};

/**
 * Hook para archivar/desarchivar flashcard
 */
export const useToggleArchiveFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flashcardService.toggleArchiveFlashcard(id),
    onSuccess: (response, id) => {
      // Invalidar consultas y actualizar caché
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
      
      if (response.data.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: flashcardsKeys.byMaterial(response.data.material_id) 
        });
      }
      
      queryClient.setQueryData(
        flashcardsKeys.detail(id), 
        { data: response.data }
      );
    },
  });
}; 