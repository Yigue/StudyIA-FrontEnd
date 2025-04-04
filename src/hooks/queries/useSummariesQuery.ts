import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as summaryService from '../../services/summary/summaryService';
import { Summary, SummaryCreateDTO, SummaryUpdateDTO } from '../../types';

// Claves de query estructuradas jerárquicamente
export const summariesKeys = {
  all: ['summaries'] as const,
  lists: () => [...summariesKeys.all, 'list'] as const,
  list: (filters = {}) => [...summariesKeys.lists(), filters] as const,
  details: () => [...summariesKeys.all, 'detail'] as const,
  detail: (id: string) => [...summariesKeys.details(), id] as const,
  byMaterial: (materialId: string) => [...summariesKeys.all, 'byMaterial', materialId] as const,
};

/**
 * Hook para obtener todos los resúmenes con paginación
 */
export const useSummariesQuery = (params?: {
  page?: number;
  limit?: number;
  materialId?: string;
}) => {
  return useQuery({
    queryKey: summariesKeys.list(params),
    queryFn: () => summaryService.getAllSummaries(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un resumen específico por ID
 */
export const useSummaryQuery = (id: string) => {
  return useQuery({
    queryKey: summariesKeys.detail(id),
    queryFn: () => summaryService.getSummaryById(id),
    select: (response) => response.data,
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

/**
 * Hook para obtener resúmenes por material
 */
export const useSummariesByMaterialQuery = (materialId: string) => {
  return useQuery({
    queryKey: summariesKeys.byMaterial(materialId),
    queryFn: () => summaryService.getSummariesByMaterial(materialId),
    select: (response) => response.data,
    enabled: !!materialId, // Solo ejecutar si hay un ID de material
  });
};

/**
 * Hook para crear un nuevo resumen
 */
export const useCreateSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summary: SummaryCreateDTO) => 
      summaryService.createSummary(summary),
    onSuccess: (response) => {
      // Invalidar todas las listas de resúmenes
      queryClient.invalidateQueries({ queryKey: summariesKeys.lists() });
      
      // Si el resumen tiene material_id, invalidar las específicas de ese material
      if (response.data.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: summariesKeys.byMaterial(response.data.material_id) 
        });
      }
      
      // Actualizar caché con el nuevo resumen
      queryClient.setQueryData(
        summariesKeys.detail(response.data.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para actualizar un resumen
 */
export const useUpdateSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; summary: SummaryUpdateDTO }) => 
      summaryService.updateSummary(data.id, data.summary),
    onSuccess: (response, variables) => {
      // Invalidar listas y actualizar detalle
      queryClient.invalidateQueries({ queryKey: summariesKeys.lists() });
      
      if (response.data.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: summariesKeys.byMaterial(response.data.material_id) 
        });
      }
      
      queryClient.setQueryData(
        summariesKeys.detail(variables.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para eliminar un resumen
 */
export const useDeleteSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => summaryService.deleteSummary(id),
    onSuccess: (_, id) => {
      // Antes de invalidar, obtener material_id para invalidar consultas específicas
      const summaryData = queryClient.getQueryData(
        summariesKeys.detail(id)
      ) as any;
      
      // Invalidar consultas y eliminar de caché
      queryClient.invalidateQueries({ queryKey: summariesKeys.lists() });
      queryClient.removeQueries({ queryKey: summariesKeys.detail(id) });
      
      if (summaryData?.data?.material_id) {
        queryClient.invalidateQueries({ 
          queryKey: summariesKeys.byMaterial(summaryData.data.material_id) 
        });
      }
    },
  });
}; 