import { useCallback, useMemo } from 'react';
import { useSummariesStore } from '../store/summaries.store';
import { Summary } from '../types/summary/summary';

// Hook principal para acceder a resúmenes con selección optimizada y memoización
export const useSummaries = () => {
  // Selectores optimizados de datos del store
  const state = useSummariesStore();
  const { 
    entities,
    ids, 
    currentSummaryId, 
    status, 
    pagination,
  } = state;

  // Acciones más utilizadas del store
  const actions = {
    getAllSummaries: state.getAllSummaries,
    getSummaryById: state.getSummaryById,
    getSummariesByMaterial: state.getSummariesByMaterial,
    createSummary: state.createSummary,
    updateSummary: state.updateSummary,
    deleteSummary: state.deleteSummary,
    setCurrentSummary: state.setCurrentSummary,
    clearError: state.clearError,
    setCurrentPage: state.setCurrentPage,
    searchSummaries: state.searchSummaries,
    refreshInBackground: state.refreshInBackground,
  };

  // Datos derivados memoizados
  const summaries = useMemo(
    () => ids.map((id) => entities[id]).filter(Boolean),
    [ids, entities]
  );

  const currentSummary = useMemo(
    () => (currentSummaryId ? entities[currentSummaryId] : null),
    [currentSummaryId, entities]
  );

  // Acciones envueltas en useCallback para evitar renderizados innecesarios
  const getAllSummaries = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      materialId?: string;
    }) => {
      try {
        await actions.getAllSummaries(params);
      } catch (error) {
        console.error('Error al obtener resúmenes:', error);
        throw error;
      }
    },
    [actions.getAllSummaries]
  );

  const getSummaryById = useCallback(
    async (id: string) => {
      await actions.getSummaryById(id);
      return entities[id] || null;
    },
    [actions.getSummaryById, entities]
  );

  const searchSummaries = useCallback(
    (searchTerm: string): Summary[] => {
      return actions.searchSummaries(searchTerm);
    },
    [actions.searchSummaries]
  );

  return {
    // Datos
    summaries,
    currentSummary,
    
    // Estado
    loading: {
      isLoading: status.isLoading,
      lastFetch: status.lastFetch,
    },
    error: status.error,
    pagination,
    
    // Acciones
    getAllSummaries,
    getSummaryById,
    getSummariesByMaterial: actions.getSummariesByMaterial,
    createSummary: actions.createSummary,
    updateSummary: actions.updateSummary,
    deleteSummary: actions.deleteSummary,
    setCurrentSummary: actions.setCurrentSummary,
    setCurrentPage: actions.setCurrentPage,
    clearError: actions.clearError,
    
    // Utilidades
    searchSummaries,
    refreshInBackground: actions.refreshInBackground,
    hasMorePages: pagination.currentPage < pagination.totalPages,
    canGoToNextPage: pagination.currentPage < pagination.totalPages,
    canGoToPreviousPage: pagination.currentPage > 1,
  };
};

// Hook para verificar si los datos están "frescos"
export const useSummariesStatus = () => {
  const status = useSummariesStore(state => state.status);
  const clearError = useSummariesStore(state => state.clearError);

  return {
    isLoading: status.isLoading,
    error: status.error,
    clearError,
    lastFetched: status.lastFetch,
    isFresh: Boolean(status.lastFetch && (Date.now() - status.lastFetch) < 5 * 60 * 1000) // 5 minutos
  };
};

// Hook para acceder al resumen actual
export const useCurrentSummary = () => {
  const entities = useSummariesStore(state => state.entities);
  const currentSummaryId = useSummariesStore(state => state.currentSummaryId);
  const setCurrentSummary = useSummariesStore(state => state.setCurrentSummary);

  const currentSummary = useMemo(
    () => (currentSummaryId ? entities[currentSummaryId] : null),
    [currentSummaryId, entities]
  );

  return { 
    currentSummary, 
    setCurrentSummary 
  };
};
