import { useState, useCallback } from "react";
import { useMaterials } from "./useMaterials";
import { useFlashcards } from "./useFlashcards";
import { useSummaries } from "./useSummaries";
import { useTagsActions } from "./useTags";


const useApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchMaterials, materials } = useMaterials();
  const { getAllFlashcards, flashcards } = useFlashcards();
  const { getAllSummaries, summaries } = useSummaries();
  const { getAllTags } = useTagsActions();
  // Función de carga unificada
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cargar datos en paralelo
      await Promise.all([
        fetchMaterials(),
        getAllFlashcards(),
        getAllSummaries(),
        getAllTags()
    
      ]);
    } catch (err: unknown) {
      // Manejar el error de forma segura
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMaterials, getAllFlashcards, getAllSummaries,getAllTags]);

  // Función para refrescar los datos
  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

 

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchData,
    onRefresh,
    materials,
    flashcards,
    summaries
  };
};

export default useApp;
