import { Tag } from '../../types';
import { tagDTO } from '../../types/tag/tagRequest';
import { httpClient } from '../api/httpClient';

export async function getAllTags() {
  return httpClient<Tag[]>('/tag', {
    method: 'GET',

  });
}

export async function createTag(tagData:tagDTO, ) {
  return httpClient<Tag,tagDTO>('/tag', {
    method: 'POST',
    data: tagData,

  });
}

export async function updateTag(id: string, tagData:tagDTO , ) {
  return httpClient<Tag, tagDTO>(`/tag/${id}`, {
    method: 'PUT',
    data: tagData,

  });
}

export async function deleteTag(id: string, ) {
  return httpClient<void>(`/tag/${id}`, {
    method: 'DELETE',

  });
}




