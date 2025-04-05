import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as materialService from '../../services/studyMaterial/studyMaterialService';
import { StudyMaterial, Params, CreateMaterialDTO, ApiProcessingOptions } from '../../types';

// Claves de query estructuradas jerárquicamente
export const materialsKeys = {
  all: ['materials'] as const,
  lists: () => [...materialsKeys.all, 'list'] as const,
  list: (filters: Params = {}) => [...materialsKeys.lists(), filters] as const,
  details: () => [...materialsKeys.all, 'detail'] as const,
  detail: (id: string) => [...materialsKeys.details(), id] as const,
};

/**
 * Hook mejorado para obtener materiales con filtros y búsqueda
 */
export const useMaterialsQuery = (params?: Params) => {
  return useQuery({
    queryKey: materialsKeys.list(params),
    queryFn: () => materialService.getAllStudyMaterials(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras se carga
  });
};

/**
 * Hook para obtener un material específico por ID
 */
export const useMaterialQuery = (id: string) => {
  return useQuery({
    queryKey: materialsKeys.detail(id),
    queryFn: () => materialService.getMaterialById(id),
    select: (response) => response.data,
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

/**
 * Hook para crear un nuevo material
 */
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { materialDto: CreateMaterialDTO, options: any }) => 
      materialService.uploadMaterial(data.materialDto, data.options),
    onSuccess: (response) => {
      // Invalidar queries de lista para forzar recarga
      queryClient.invalidateQueries({ queryKey: materialsKeys.lists() });
      // Actualizar caché con el nuevo material
      queryClient.setQueryData(
        materialsKeys.detail(response.data.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para procesar un material (generar resumen y flashcards)
 */
export const useProcessMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { material: StudyMaterial, options: ApiProcessingOptions }) => 
      materialService.generateSummary(data.material.id, data.options.summary_options)
        .then(async (summaryResponse) => {
          // Si se solicitan flashcards, generarlas también
          let flashcardsResponse = null;
          if (data.options.generate_flashcards) {
            flashcardsResponse = await materialService.generateFlashcards(
              data.material.id, 
              data.options.flashcards_options
            );
          }
          return {
            summary: summaryResponse.data,
            flashcards: flashcardsResponse?.data || null
          };
        }),
    onSuccess: (_, variables) => {
      // Invalidar queries relevantes después del procesamiento
      queryClient.invalidateQueries({ queryKey: materialsKeys.detail(variables.material.id) });
      queryClient.invalidateQueries({ queryKey: ['summaries', 'byMaterial', variables.material.id] });
      queryClient.invalidateQueries({ queryKey: ['flashcards', 'byMaterial', variables.material.id] });
    },
  });
};

/**
 * Hook para eliminar un material
 */
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => materialService.deleteMaterial(id),
    onSuccess: (_, id) => {
      // Invalidar listas y eliminar el detalle específico
      queryClient.invalidateQueries({ queryKey: materialsKeys.lists() });
      queryClient.removeQueries({ queryKey: materialsKeys.detail(id) });
    },
  });
}; 