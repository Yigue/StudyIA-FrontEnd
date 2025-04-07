import { ApiResponse } from "../../types/api";
import { 
  Flashcard, 
  FlashcardCreateDTO, 
  FlashcardUpdateDTO, 
  FlashcardReviewDTO,
  FlashcardStudyResponse,
  FlashcardReviewResponse
} from "../../types/flashcards";
import { QueryParams } from "../../types/common";
import { httpClient } from "../api/httpClient";

// Obtener todas las flashcards
export async function getAllFlashcards(params?: QueryParams) {
  return httpClient<ApiResponse<Flashcard[]>>('/flashcards', {
    method: 'GET',
    params
  });
}

// Obtener flashcards para estudio
export async function getStudyFlashcards(params?: QueryParams) {
  return httpClient<ApiResponse<FlashcardStudyResponse[]>>('/flashcards/study', {
    method: 'GET',
    params
  });
}

// Obtener una flashcard por ID
export async function getFlashcardById(id: string) {
  return httpClient<ApiResponse<Flashcard>>(`/flashcards/${id}`, {
    method: 'GET'
  });
}

// Obtener flashcards por material
export async function getFlashcardsByMaterial(materialId: string, params?: QueryParams) {
  return httpClient<ApiResponse<Flashcard[]>>(`/materials/${materialId}/flashcards`, {
    method: 'GET',
    params
  });
}

// Obtener flashcards para estudio por material
export async function getFlashcardsForReviewMaterial(materialId: string, params?: {
  limit?: number;
  difficulty?: "easy" | "medium" | "hard";
}) {
  return httpClient<Flashcard[]>(`/flashcards/study/material/${materialId}`, {
    method: 'GET',
    params
  });
}

// Archivar/desarchivar flashcard
export async function toggleArchiveFlashcard(id: string) {
  return httpClient<ApiResponse<Flashcard>>(`/flashcards/${id}/archive`, {
    method: 'PUT'
  });
}

// Crear flashcard
export async function createFlashcard(flashcard: FlashcardCreateDTO) {
  return httpClient<ApiResponse<Flashcard>, FlashcardCreateDTO>('/flashcards', {
    method: 'POST',
    data: flashcard
  });
}

// Actualizar flashcard
export async function updateFlashcard(id: string, flashcard: FlashcardUpdateDTO) {
  return httpClient<ApiResponse<Flashcard>, FlashcardUpdateDTO>(`/flashcards/${id}`, {
    method: 'PUT',
    data: flashcard
  });
}

// Registrar revisión de flashcard
export async function reviewFlashcard(id: string, review: FlashcardReviewDTO) {
  return httpClient<ApiResponse<{
    review: FlashcardReviewResponse;
    flashcard: {
      id: string;
      lastReviewed: string;
    }
  }>, FlashcardReviewDTO>(`/flashcards/${id}/review`, {
    method: 'PUT',
    data: review
  });
}

// Eliminar flashcard
export async function deleteFlashcard(id: string) {
  return httpClient<ApiResponse<null>>(`/flashcards/${id}`, {
    method: 'DELETE'
  });
}
