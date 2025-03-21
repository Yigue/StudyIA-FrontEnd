import { Tag } from '../../types';
import { tagDTO } from '../../types/tag/tagRequest';
import { httpClient } from '../api/httpClient';

export async function getAllTags(authToken: string) {
  return httpClient<Tag[]>('/tag', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function createTag(tagData:tagDTO, authToken: string) {
  return httpClient<Tag,tagDTO>('/tag', {
    method: 'POST',
    data: tagData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function updateTag(id: string, tagData:tagDTO , authToken: string) {
  return httpClient<Tag, tagDTO>(`/tag/${id}`, {
    method: 'PUT',
    data: tagData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function deleteTag(id: string, authToken: string) {
  return httpClient<void>(`/tag/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}




