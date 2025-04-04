import { StudyMaterial } from "../../types/studyMaterial/studyMaterial";
import {
  GenerateSummaryDTO,
  GenerateFlashcardsDTO,
  CreateMaterialDTO,
} from "../../types/studyMaterial/studyMaterialRequest";
import { Summary } from "../../types/summary/summary";
import { Flashcard } from "../../types/flashcards/flashcards";
import { httpClient } from "../api/httpClient";
import { Params } from "../../types";

// Obtener todos los materiales con paginación y filtros
export async function getAllStudyMaterials(params?: Params) {
  return await httpClient<StudyMaterial[]>("/materials", {
    method: "GET",
    params: params,
  });
}

// Obtener un material específico por ID
export async function getMaterialById(id: string) {
  return await httpClient<StudyMaterial>(`/materials/${id}`, {
    method: "GET",
  });
}

// Obtener estado de procesamiento
export async function getMaterialStatus(id: string) {
  return await httpClient<{ processingStatus: string; message: string }>(
    `/materials/${id}/status`,
    {
      method: "GET",
    }
  );
}

// Crear material de texto

// Crear material desde archivo
export async function uploadMaterial(materialData: CreateMaterialDTO) {
  const formData = new FormData();
  formData.append("file", materialData.file || "");
  formData.append("title", materialData.title);
  formData.append("type", materialData.type);
  formData.append("content", materialData.content || "");

  if (materialData.description) {
    formData.append("description", materialData.description);
  }

  if (materialData.tags && materialData.tags.length > 0) {
    formData.append("tags", JSON.stringify(materialData.tags));
  }

  return await httpClient<StudyMaterial, FormData>("/materials/", {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Generar resumen para un material
export async function generateSummary(
  id: string,
  options?: GenerateSummaryDTO
) {
  return await httpClient<Summary, GenerateSummaryDTO>(
    `/materials/${id}/summary`,
    {
      method: "POST",
      data: options,
    }
  );
}

// Generar flashcards para un material
export async function generateFlashcards(
  id: string,
  options?: GenerateFlashcardsDTO
) {
  return await httpClient<Flashcard[], GenerateFlashcardsDTO>(
    `/materials/${id}/flashcards`,
    {
      method: "POST",
      data: options,
    }
  );
}

// Eliminar un material
export async function deleteMaterial(id: string) {
  return await httpClient<void>(`/materials/${id}`, {
    method: "DELETE",
  });
}
