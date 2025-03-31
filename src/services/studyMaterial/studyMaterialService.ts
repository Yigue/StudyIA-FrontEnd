import { StudyMaterial } from '../../types/studyMaterial/studyMaterial';
import { TextMaterialDTO, FileMaterialDTO, ProcessMaterialDTO, GenerateSummaryDTO, GenerateFlashcardsDTO } from '../../types/studyMaterial/studyMaterialRequest';
import { Summary } from '../../types/summary/summary';
import { Flashcard } from '../../types/flashcards/flashcards';
import { httpClient } from '../api/httpClient';
import { Params } from '../../types';



// Obtener todos los materiales con paginación y filtros
export async function getAllStudyMaterials(params?: Params) {
  return await httpClient<StudyMaterial[]>('/materials', {
    method: 'GET',
    params: params
  });
}

// Obtener un material específico por ID
export async function getMaterialById(id: string) {
  return await httpClient<StudyMaterial>(`/materials/${id}`, {
    method: 'GET'
  });
}

// Obtener estado de procesamiento
export async function getMaterialStatus(id: string) {
  return await httpClient<{ processingStatus: string; message: string }>(`/materials/${id}/status`, {
    method: 'GET'
  });
}

// Crear material de texto
export async function createTextMaterial(materialData: TextMaterialDTO) {
  const res= await httpClient<StudyMaterial, TextMaterialDTO>('/materials/text', {
    method: 'POST',
    data: materialData
  });
  return res
}

// Crear material desde archivo
export async function createFileMaterial(materialData: FileMaterialDTO) {
  const formData = new FormData();
  formData.append('file', materialData.file);
  formData.append('title', materialData.title);
  
  if (materialData.description) {
    formData.append('description', materialData.description);
  }
  
  if (materialData.tags && materialData.tags.length > 0) {
    materialData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
  }

  return await httpClient<StudyMaterial, FormData>('/materials/file', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Procesar material completo
export async function processCompleteMaterial(materialData: ProcessMaterialDTO) {
  const formData = new FormData();
  formData.append('file', materialData.file);
  formData.append('title', materialData.title);
  
  if (materialData.description) {
    formData.append('description', materialData.description);
  }
  
  if (materialData.tags && materialData.tags.length > 0) {
    materialData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
  }
  
  if (materialData.generate_summary !== undefined) {
    formData.append('generate_summary', String(materialData.generate_summary));
  }
  
  if (materialData.generate_flashcards !== undefined) {
    formData.append('generate_flashcards', String(materialData.generate_flashcards));
  }
  
  if (materialData.summary_format) {
    formData.append('summary_format', materialData.summary_format);
  }
  
  if (materialData.summary_length) {
    formData.append('summary_length', materialData.summary_length);
  }
  
  if (materialData.flashcards_count) {
    formData.append('flashcards_count', String(materialData.flashcards_count));
  }
  
  if (materialData.flashcards_difficulty) {
    formData.append('flashcards_difficulty', materialData.flashcards_difficulty);
  }

  return await httpClient<StudyMaterial, FormData>('/materials/process', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// Generar resumen para un material
export async function generateSummary(id: string, options?: GenerateSummaryDTO) {
  return await httpClient<Summary, GenerateSummaryDTO>(`/materials/${id}/summary`, {
    method: 'POST',
    data: options
  });
}

// Generar flashcards para un material
export async function generateFlashcards(id: string, options?: GenerateFlashcardsDTO) {
  return await httpClient<Flashcard[], GenerateFlashcardsDTO>(`/materials/${id}/flashcards`, {
    method: 'POST',
    data: options
  });
}

// Eliminar un material
export async function deleteMaterial(id: string) {
  return await httpClient<void>(`/materials/${id}`, {
    method: 'DELETE'
  });
}


