import { Flashcard } from "../../types/flashcards/flashcards";
import { FlashcardCreateDTO, FlashcardUpdateDTO, FlashcardReviewDTO } from "../../types/flashcards/flashcardsRequest";
import { httpClient } from "../api/httpClient";

// Obtener todas las flashcards
export async function getAllFlashcards(params?: {
  page?: number;
  limit?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string;
  archived?: boolean;
}) {
  return httpClient<Flashcard[]>('/flashcards', {
    method: 'GET',
    params
  });
}

// Obtener una flashcard por ID
export async function getFlashcardById(id: string) {
  return httpClient<Flashcard>(`/flashcards/${id}`, {
    method: 'GET'
  });
}

// Obtener flashcards por material
export async function getFlashcardsByMaterial(materialId: string) {
  return httpClient<Flashcard[]>(`/flashcards/material/${materialId}`, {
    method: 'GET'
  });
}

// Obtener flashcards para estudio

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
  return httpClient<Flashcard>(`/flashcards/${id}/archive`, {
    method: 'PUT'
  });
}

// Crear flashcard
export async function createFlashcard(flashcard: FlashcardCreateDTO) {
  return httpClient<Flashcard, FlashcardCreateDTO>('/flashcards', {
    method: 'POST',
    data: flashcard
  });
}

// Actualizar flashcard
export async function updateFlashcard(id: string, flashcard: FlashcardUpdateDTO) {
  return httpClient<Flashcard, FlashcardUpdateDTO>(`/flashcards/${id}`, {
    method: 'PUT',
    data: flashcard
  });
}

// Registrar revisión de flashcard
export async function reviewFlashcard(id: string, review: FlashcardReviewDTO) {
  return httpClient<Flashcard, FlashcardReviewDTO>(`/flashcards/${id}/review`, {
    method: 'PUT',
    data: review
  });
}

// Eliminar flashcard
export async function deleteFlashcard(id: string) {
  return httpClient<void>(`/flashcards/${id}`, {
    method: 'DELETE'
  });
}
