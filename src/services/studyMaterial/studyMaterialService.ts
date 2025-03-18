import { StudyMaterial } from '../../types';
import { httpClient } from '../api/httpClient';


export async function getAllStudyMaterials(authToken:string) {
  return httpClient<StudyMaterial>(`/materials`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    },
  });
}
export async function getMaterialById(id: string,authToken:string) {
  return httpClient<StudyMaterial>(`/materials/${id}`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    },
  });
}
export async function uploadMaterial(file: File,authToken:string) {
  const formData = new FormData();
  formData.append('file', file);

  return httpClient<FormData>('/materials/upload', {
    method: 'POST',
    data:formData,
    headers: {
      Authorization:authToken
    },
  });
}
export async function uploadAndProcess(file: File,authToken:string) {
  const formData = new FormData();
  formData.append('file', file);

  return httpClient<FormData>('/materials/uploadAndProcess', {
    method: 'POST',
    data:formData,
    headers: {
      Authorization:authToken
    },
  });
}
export async function materialGenerateSummary(file: File,authToken:string,id:string) {
  const formData = new FormData();
  formData.append('file', file);

  return httpClient<FormData>(`/materials/GenerateSummary/${id}` , {
    method: 'POST',
    data:formData,
    headers: {
      Authorization:authToken
    },
  });
}
export async function materialGenerateFlashcard(file: File,authToken:string,id:string) {
  const formData = new FormData();
  formData.append('file', file);

  return httpClient<FormData>(`/materials/GenerateFlashcard/${id}`, {
    method: 'POST',
    data:formData,
    headers: {
      Authorization:authToken
    },
  });
}


