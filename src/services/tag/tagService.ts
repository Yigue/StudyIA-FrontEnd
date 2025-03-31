import { Tag } from '../../types/tag/tag';
import { TagCreateDTO, TagUpdateDTO } from '../../types/tag/tagRequest';
import { httpClient } from '../api/httpClient';

// Obtener todas las etiquetas
export async function getAllTags() {
  return httpClient<Tag[]>('/tags', {
    method: 'GET',
  });
}

// Crear una etiqueta
export async function createTag(tagData: TagCreateDTO) {
  return httpClient<Tag, TagCreateDTO>('/tags', {
    method: 'POST',
    data: tagData,
  });
}

// Actualizar una etiqueta
export async function updateTag(id: string, tagData: TagUpdateDTO) {
  return httpClient<Tag, TagUpdateDTO>(`/tags/${id}`, {
    method: 'PUT',
    data: tagData,
  });
}

// Eliminar una etiqueta
export async function deleteTag(id: string) {
  return httpClient<void>(`/tags/${id}`, {
    method: 'DELETE',
  });
}




