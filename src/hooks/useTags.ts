import { useCallback, useMemo } from 'react';
import { useTagsQuery, useCreateTag, useUpdateTag, useDeleteTag, useFilterTags } from './queries/useTagsQuery';
import { TagCreateDTO, TagUpdateDTO } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para acceder y manipular etiquetas, usando React Query internamente
 * pero manteniendo la interfaz compatible con la versión anterior.
 */
export const useTags = () => {
  const queryClient = useQueryClient();
  
  // Queries
  const { data: tagsData, isLoading, error } = useTagsQuery();
  
  // Mutaciones
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();
  
  // Filtro local
  const filterTagsFn = useFilterTags();

  // Datos derivados
  const tags = useMemo(() => tagsData || [], [tagsData]);

  // Funciones con interfaz compatible con la versión anterior
  const getAllTags = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['tags'] });
    return tags;
  }, [queryClient, tags]);

  const createTag = useCallback(async (tag: TagCreateDTO) => {
    const result = await createTagMutation.mutateAsync(tag);
    return result.data;
  }, [createTagMutation]);

  const updateTag = useCallback(async (id: string, tag: TagUpdateDTO) => {
    const result = await updateTagMutation.mutateAsync({ id, tag });
    return result.data;
  }, [updateTagMutation]);

  const deleteTag = useCallback(async (id: string) => {
    await deleteTagMutation.mutateAsync(id);
  }, [deleteTagMutation]);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query
  }, []);

  const filterTags = useCallback((searchTerm: string) => {
    return filterTagsFn(searchTerm);
  }, [filterTagsFn]);

  const getTagById = useCallback((id: string) => {
    return tags.find(tag => tag.id === id);
  }, [tags]);

  // Retornar objeto con misma estructura que el hook original
  return useMemo(() => ({
    // Datos
    tags,
    
    // Estado
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    lastFetched: Date.now(),
    
    // Acciones
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    clearError,
    
    // Utilidades
    filterTags,
    getTagById
  }), [
    tags,
    isLoading, 
    error,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    clearError,
    filterTags,
    getTagById
  ]);
};
