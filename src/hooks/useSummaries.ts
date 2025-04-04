import { useCallback, useMemo, useState } from 'react';
import { 
  useSummariesQuery, 
  useSummaryQuery, 
  useSummariesByMaterialQuery,
  useCreateSummary,
  useUpdateSummary,
  useDeleteSummary
} from './queries/useSummariesQuery';
import { Summary, SummaryCreateDTO, SummaryUpdateDTO, Params } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import * as summaryService from '../services/summary/summaryService';

/**
 * Hook principal para acceder a resúmenes con React Query
 * pero manteniendo la interfaz compatible con la versión Zustand
 */
export const useSummaries = () => {
  const [currentSummaryId, setCurrentSummaryId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Queries
  const { data: summariesData, isLoading, error } = useSummariesQuery();
  
  // Mutaciones
  const createSummaryMutation = useCreateSummary();
  const updateSummaryMutation = useUpdateSummary();
  const deleteSummaryMutation = useDeleteSummary();

  // Datos derivados
  const summaries = useMemo(() => summariesData || [], [summariesData]);
  
  const currentSummary = useMemo(() => {
    if (!currentSummaryId) return null;
    return summaries.find(s => s.id === currentSummaryId) || null;
  }, [currentSummaryId, summaries]);

  // Funciones con interfaz compatible con la versión anterior
  const getAllSummaries = useCallback(async (params?: Params) => {
    await queryClient.invalidateQueries({ queryKey: ['summaries', 'list'] });
    return summaries;
  }, [queryClient, summaries]);

  const getSummaryById = useCallback(async (id: string) => {
    if (!id) return null;
    
    try {
      const { data } = await queryClient.fetchQuery({
        queryKey: ['summaries', 'detail', id],
        queryFn: () => summaryService.getSummaryById(id)
      });
      return data;
    } catch (error) {
      console.error('Error al obtener resumen por ID:', error);
      return null;
    }
  }, [queryClient]);

  const getSummariesByMaterial = useCallback(async (materialId: string) => {
    if (!materialId) return [];
    
    try {
      const { data } = await queryClient.fetchQuery({
        queryKey: ['summaries', 'byMaterial', materialId],
        queryFn: () => summaryService.getSummariesByMaterial(materialId)
      });
      return data;
    } catch (error) {
      console.error('Error al obtener resúmenes por material:', error);
      return [];
    }
  }, [queryClient]);

  const createSummary = useCallback(async (summary: SummaryCreateDTO) => {
    const result = await createSummaryMutation.mutateAsync(summary);
    return result.data;
  }, [createSummaryMutation]);

  const updateSummary = useCallback(async (id: string, summary: SummaryUpdateDTO) => {
    const result = await updateSummaryMutation.mutateAsync({ id, summary });
    return result.data;
  }, [updateSummaryMutation]);

  const deleteSummary = useCallback(async (id: string) => {
    await deleteSummaryMutation.mutateAsync(id);
  }, [deleteSummaryMutation]);

  // Simulación de paginación para compatibilidad
  const pagination = useMemo(() => ({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  }), []);

  const setCurrentSummary = useCallback((id: string | null) => {
    setCurrentSummaryId(id);
  }, []);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query
  }, []);

  const searchSummaries = useCallback((searchTerm: string): Summary[] => {
    if (!searchTerm) return summaries;
    
    const term = searchTerm.toLowerCase();
    return summaries.filter(summary => 
      summary.content.toLowerCase().includes(term)
    );
  }, [summaries]);

  const refreshInBackground = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['summaries'] });
  }, [queryClient]);

  const setCurrentPage = useCallback(() => {
    // Simulación para compatibilidad
  }, []);

  return useMemo(() => ({
    // Datos
    summaries,
    currentSummary,
    
    // Estado
    loading: {
      isLoading,
      lastFetch: Date.now(),
    },
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    pagination,
    
    // Acciones
    getAllSummaries,
    getSummaryById,
    getSummariesByMaterial,
    createSummary,
    updateSummary,
    deleteSummary,
    setCurrentSummary,
    setCurrentPage,
    clearError,
    
    // Utilidades
    searchSummaries,
    refreshInBackground,
    hasMorePages: false,
    canGoToNextPage: false,
    canGoToPreviousPage: false,
  }), [
    summaries,
    currentSummary,
    isLoading,
    error,
    pagination,
    getAllSummaries,
    getSummaryById,
    getSummariesByMaterial,
    createSummary,
    updateSummary,
    deleteSummary,
    setCurrentSummary,
    setCurrentPage,
    clearError,
    searchSummaries,
    refreshInBackground
  ]);
};

/**
 * Hook para verificar si los datos están "frescos"
 */
export const useSummariesStatus = () => {
  const { isLoading, error } = useSummariesQuery();

  return useMemo(() => ({
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    clearError: () => {},
    lastFetched: Date.now(),
    isFresh: true // Siempre fresco con React Query
  }), [isLoading, error]);
};

/**
 * Hook para acceder al resumen actual
 */
export const useCurrentSummary = () => {
  const [currentSummaryId, setCurrentSummaryId] = useState<string | null>(null);
  const { data: summaries = [] } = useSummariesQuery();

  const currentSummary = useMemo(() => {
    if (!currentSummaryId) return null;
    return summaries.find(s => s.id === currentSummaryId) || null;
  }, [currentSummaryId, summaries]);

  const setCurrentSummary = useCallback((id: string | null) => {
    setCurrentSummaryId(id);
  }, []);

  return useMemo(() => ({ 
    currentSummary, 
    setCurrentSummary 
  }), [currentSummary, setCurrentSummary]);
};
