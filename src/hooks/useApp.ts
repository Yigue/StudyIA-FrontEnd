import { useState, useCallback, useMemo } from "react";
import { useMaterialsQuery } from "./queries/useMaterialsQuery";
import { useFlashcardsQuery } from "./queries/useFlashcardsQuery";
import { useSummariesQuery } from "./queries/useSummariesQuery";
import { useTagsQuery } from "./queries/useTagsQuery";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook que centraliza el acceso a los datos principales de la aplicación
 * Usando React Query internamente pero manteniendo compatibilidad
 */
const useApp = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Usar hooks de React Query directamente
  const { data: materials = [], isLoading: materialsLoading } = useMaterialsQuery();
  const { data: flashcards = [], isLoading: flashcardsLoading } = useFlashcardsQuery();
  const { data: summaries = [], isLoading: summariesLoading } = useSummariesQuery();
  const { data: tags = [], isLoading: tagsLoading } = useTagsQuery();
  
  // Determinar estado de carga general
  const isLoading = materialsLoading || flashcardsLoading || summariesLoading || tagsLoading;
  
  // Función de carga unificada
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      // Refrescar las consultas principales
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['materials'] }),
        queryClient.invalidateQueries({ queryKey: ['flashcards'] }),
        queryClient.invalidateQueries({ queryKey: ['summaries'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] })
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    }
  }, [queryClient]);

  // Función para refrescar los datos (alias)
  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Devolver un objeto memoizado para evitar re-renderizados innecesarios
  return useMemo(() => ({
    isLoading,
    error,
    setError,
    fetchData,
    onRefresh,
    materials,
    flashcards,
    summaries,
    tags
  }), [
    isLoading, 
    error, 
    fetchData, 
    onRefresh, 
    materials, 
    flashcards, 
    summaries,
    tags
  ]);
};

export default useApp;
