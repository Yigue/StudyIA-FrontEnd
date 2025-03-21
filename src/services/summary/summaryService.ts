import { Summary } from '../../types';
import { summaryCreatedDTO } from '../../types/summary/summaryRequest';
import { httpClient } from '../api/httpClient';

export async function getAllSummaries() {
  return httpClient<Summary[]>('/summary', {
    method: 'GET',
  });
}

export async function getSummaryById(id: string, ) {

  return httpClient<Summary>(`/summary/${id}`, {
    method: 'GET',
  });
}

export async function getSummariesByMaterial(materialId: string, ) {
  return httpClient<Summary[]>(`/summary/forMaterial/${materialId}`, {
    method: 'GET',
  });
}

export async function createSummary(summaryData:summaryCreatedDTO, ) {
  return httpClient<Summary,summaryCreatedDTO>('/summary', {
    method: 'POST',
    data: summaryData,

  });
}

export async function updateSummary(id: string, summaryData: summaryCreatedDTO, ) {
  return httpClient<Summary,summaryCreatedDTO>(`/summary/${id}`, {
    method: 'PUT',
    data: summaryData,
  });
}
// Falta delete
// export async function deleteSummary(id: string, ) {
//   return httpClient<void>(`/summary/${id}`, {
//     method: 'DELETE',
//   });
// }
