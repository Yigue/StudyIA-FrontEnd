import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tagService from '../../services/tag/tagService';
import { TagCreateDTO, TagUpdateDTO } from '../../types';


// Claves de query estructuradas jerárquicamente
export const tagsKeys = {
  all: ['tags'] as const,
  lists: () => [...tagsKeys.all, 'list'] as const,
  list: (filters = {}) => [...tagsKeys.lists(), filters] as const,
  details: () => [...tagsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsKeys.details(), id] as const,
};

/**
 * Hook para obtener todas las etiquetas
 */
export const useTagsQuery = () => {
  return useQuery({
    queryKey: tagsKeys.lists(),
    queryFn: () => tagService.getAllTags(),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10 minutos (las etiquetas cambian poco)
  });
};

/**
 * Hook para crear una nueva etiqueta
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tag: TagCreateDTO) => tagService.createTag(tag),
    onSuccess: (response) => {
      // Invalidar listas y actualizar caché
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
      queryClient.setQueryData(
        tagsKeys.detail(response.data.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para actualizar una etiqueta
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; tag: TagUpdateDTO }) => 
      tagService.updateTag(data.id, data.tag),
    onSuccess: (response, variables) => {
      // Invalidar listas y actualizar detalle
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
      queryClient.setQueryData(
        tagsKeys.detail(variables.id), 
        { data: response.data }
      );
    },
  });
};

/**
 * Hook para eliminar una etiqueta
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: (_, id) => {
      // Invalidar listas y eliminar detalle
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
      queryClient.removeQueries({ queryKey: tagsKeys.detail(id) });
    },
  });
};

/**
 * Hook para buscar etiquetas por nombre localmente
 */
export const useFilterTags = () => {
  const { data: tags } = useTagsQuery();
  
  return (searchTerm: string) => {
    if (!tags || !searchTerm) return tags || [];
    
    const term = searchTerm.toLowerCase();
    return tags.filter((tag) => 
      tag.name.toLowerCase().includes(term)
    );
  };
}; 