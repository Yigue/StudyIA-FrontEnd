import { StudyMaterial } from '../../types';
import { StudyMaterialDTO } from '../../types/studyMaterial/studyMaterialRequest';
import { httpClient } from '../api/httpClient';

export async function getAllStudyMaterials(authToken: string) {
  const res=await httpClient<StudyMaterial[]>('/materials', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log(res)
  return res
}

export async function getMaterialById(id: string, authToken: string) {
  return httpClient<StudyMaterial>(`/materials/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function uploadMaterial(materialData: StudyMaterialDTO, authToken: string) {
  const formData = new FormData();
  if (materialData.file) {
    formData.append('file', materialData.file);
  }
  formData.append('data', JSON.stringify(materialData));

  return httpClient<StudyMaterial,FormData>('/materials/upload', {
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function uploadAndProcess(materialData: StudyMaterialDTO, authToken: string) {
  const formData = new FormData();
  if (materialData.file) {
    formData.append('file', materialData.file);
  }
  formData.append('data', JSON.stringify(materialData));

  return httpClient<StudyMaterial,FormData>('/materials/uploadAndProcess', {
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function deleteMaterial(id: string, authToken: string) {
  return httpClient<void>(`/materials/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}


