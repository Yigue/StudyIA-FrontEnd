import { GenerateSummaryDTO } from './../../types/materials/index';

import { ApiResponse } from "../../types/api";
import { 
  StudyMaterial, 
  CreateTextMaterialDTO, 
  CreateFileMaterialDTO,
  UpdateMaterialDTO,
  ProcessMaterialDTO 
} from "../../types/materials";
import { 
  Summary,
} from "../../types/summaries";
import { Flashcard } from "../../types/flashcards";
import { httpClient } from "../api/httpClient";
import { QueryParams } from "../../types/common";

// Obtener todos los materiales con paginación y filtros
export async function getAllStudyMaterials(params?: QueryParams) {
  return await httpClient<ApiResponse<StudyMaterial[]>>("/materials", {
    method: "GET",
    params
  });
}

// Obtener un material específico por ID
export async function getMaterialById(id: string) {
  return await httpClient<ApiResponse<StudyMaterial>>(`/materials/${id}`, {
    method: "GET"
  });
}

// Obtener estado de procesamiento
export async function getMaterialStatus(id: string) {
  return await httpClient<ApiResponse<{ 
    processingStatus: "pending" | "completed" | "failed";
    message: string; 
  }>>(`/materials/${id}/status`, {
    method: "GET"
  });
}

// Crear material de texto
export async function createTextMaterial(data: CreateTextMaterialDTO) {
  return await httpClient<ApiResponse<StudyMaterial>, CreateTextMaterialDTO>("/materials/text", {
    method: "POST",
    data
  });
}

// Crear material desde archivo
export async function createFileMaterial(data: CreateFileMaterialDTO, onUploadProgress?: (progress: number) => void) {
  const formData = new FormData();
  
  formData.append("file", data.file);
  formData.append("title", data.title);
  
  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.tags && data.tags.length > 0) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  const axiosConfig = {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  };

  if (onUploadProgress) {
    axiosConfig.onUploadProgress = (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onUploadProgress(progress);
    };
  }

  return await httpClient<ApiResponse<StudyMaterial>, FormData>("/materials/file", axiosConfig);
}

// Procesar material completo (subir + generar resumen y flashcards)
export async function processMaterial(data: ProcessMaterialDTO, onUploadProgress?: (progress: number) => void) {
  const formData = new FormData();
  
  formData.append("file", data.file);
  formData.append("title", data.title);
  
  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.tags && data.tags.length > 0) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  // Opciones de procesamiento
  if (data.generate_summary !== undefined) {
    formData.append("generate_summary", String(data.generate_summary));
  }
  
  if (data.generate_flashcards !== undefined) {
    formData.append("generate_flashcards", String(data.generate_flashcards));
  }
  
  if (data.summary_format) {
    formData.append("summary_format", data.summary_format);
  }
  
  if (data.summary_length) {
    formData.append("summary_length", data.summary_length);
  }
  
  if (data.flashcards_count) {
    formData.append("flashcards_count", String(data.flashcards_count));
  }
  
  if (data.flashcards_difficulty) {
    formData.append("flashcards_difficulty", data.flashcards_difficulty);
  }

  const axiosConfig: any = {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  };

  if (onUploadProgress) {
    axiosConfig.onUploadProgress = (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onUploadProgress(progress);
    };
  }

  return await httpClient<ApiResponse<StudyMaterial>, FormData>("/materials/process", axiosConfig);
}

// Actualizar un material
export async function updateMaterial(id: string, data: UpdateMaterialDTO) {
  return await httpClient<ApiResponse<StudyMaterial>, UpdateMaterialDTO>(`/materials/${id}`, {
    method: "PUT",
    data
  });
}

// Generar resumen para un material
export async function generateSummary(id: string, options?: GenerateSummaryDTO) {
  return await httpClient<ApiResponse<Summary>, GenerateSummaryDTO>(`/materials/${id}/summary`, {
    method: "POST",
    data: options
  });
}

// Generar flashcards para un material
export async function generateFlashcards(id: string, options?: { 
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
}) {
  return await httpClient<ApiResponse<Flashcard[]>>(`/materials/${id}/flashcards`, {
    method: "POST",
    data: options
  });
}

// Eliminar un material
export async function deleteMaterial(id: string) {
  return await httpClient<ApiResponse<null>>(`/materials/${id}`, {
    method: "DELETE"
  });
}
