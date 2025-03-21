
import { StudyMaterial } from '../../types';
import { StudyMaterialDTO } from '../../types/studyMaterial/studyMaterialRequest';
import { httpClient } from '../api/httpClient';

export async function getAllStudyMaterials() {
  
  return  httpClient<StudyMaterial[]>('/material', {
    method: 'GET',

  });

  
}

export async function getMaterialById(id: string) {
  return httpClient<StudyMaterial>(`/material/${id}`, {
    method: 'GET'
  });
}

export async function uploadMaterial(materialData: StudyMaterialDTO) {
  const formData = new FormData();
  if (materialData.file) {
    formData.append('file', materialData.file);
  }
  formData.append('data', JSON.stringify(materialData));

  return httpClient<StudyMaterial,FormData>('/material/upload', {
    method: 'POST',
    data: formData
  }
);
}

export async function uploadAndProcess(materialData: StudyMaterialDTO) {
  const formData = new FormData();
  if (materialData.file) {
    formData.append('file', materialData.file);
  }
  formData.append('data', JSON.stringify(materialData));

  return httpClient<StudyMaterial,FormData>('/material/uploadAndProcess', {
    method: 'POST',
    data: formData
  });
}
export async function generateSummary(id:string) {
 

  return httpClient(`/material/GenerateSummary/${id}`, {
    method: 'POST',
  });
}

export async function generateFlashcard(id:string) {
 

  return httpClient(`/material/GenerateFlashcard/${id}`, {
    method: 'POST',
  });
}

// Falta un update y un delete
// export async function deleteMaterial(id: string) {
//   return httpClient<void>(`/material/${id}`, {
//     method: 'DELETE'
//   });
// }


