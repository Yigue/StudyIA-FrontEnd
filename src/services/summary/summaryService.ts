import { Summary } from '../../types';
import { httpClient } from '../api/httpClient';

export async function getAllStudyMaterials(authToken:string,id:string) {
  return httpClient<Summary>(`/summary/forMaterial/${id}`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    },
  });
}
export async function getDetailsSummary(authToken:string,id:string) {
  return httpClient<Summary>(`/summary/${id}`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    },
  });
}
export async function getAllSummary(authToken:string) {
  return httpClient<Summary>(`/summary`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    },
  });
}
export async function createSummary(createSummaryData:string,authToken: string) {
  return httpClient<Summary>(`/summary`, {
    method: "POST",
    data:createSummaryData,
    headers:{
      Authorization: authToken
    }

  });
}
export async function updateSummary(updateSummaryData:string,authToken: string) {
  return httpClient<Summary>(`/summary/${updateSummaryData.id}`, {
    method: "PUT",
    data:updateSummaryData,
    headers:{
      Authorization: authToken
    }

  });
}
// export async function deleteSummary(id: string) {
//   return httpClient<void>(`/summaries/${id}`, {
//     method: 'DELETE',
//   });
// }
