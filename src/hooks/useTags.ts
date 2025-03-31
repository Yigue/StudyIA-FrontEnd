import { useCallback } from 'react';
import { useTagsStore } from '../store/tags.store';
import { Tag } from '../types/tag/tag';

// Hook para acceder a las etiquetas
export const useTags = () => {
  const tags = useTagsStore((state) => state.tags);
  const isLoading = useTagsStore((state) => state.isLoading);
  const error = useTagsStore((state) => state.error);
  const lastFetched = useTagsStore((state) => state.lastFetched);

  return {
    tags,
    isLoading,
    error,
    lastFetched
  };
};

// Hook para acceder a las acciones de etiquetas
export const useTagsActions = () => {
  const getAllTags = useTagsStore((state) => state.getAllTags);
  const createTag = useTagsStore((state) => state.createTag);
  const updateTag = useTagsStore((state) => state.updateTag);
  const deleteTag = useTagsStore((state) => state.deleteTag);
  const clearError = useTagsStore((state) => state.clearError);
  const filterTags = useTagsStore((state) => state.filterTags);
  const getTagById = useTagsStore((state) => state.getTagById);

  // Función para buscar etiquetas por nombre (ahora usa la implementación del store)
  const searchTags = useCallback(
    (searchTerm: string): Tag[] => {
      return filterTags(searchTerm);
    },
    [filterTags]
  );

  return {
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    clearError,
    searchTags,
    getTagById
  };
};

// Hook para acceder al estado de carga de etiquetas
export const useTagsStatus = () => {
  const isLoading = useTagsStore((state) => state.isLoading);
  const error = useTagsStore((state) => state.error);
  const clearError = useTagsStore((state) => state.clearError);
  const lastFetched = useTagsStore((state) => state.lastFetched);

  return {
    isLoading,
    error,
    clearError,
    lastFetched,
    // Función para comprobar si los datos están "frescos"
    isFresh: Boolean(lastFetched && (Date.now() - lastFetched) < 5 * 60 * 1000) // 5 minutos
  };
};
