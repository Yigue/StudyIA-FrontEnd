import { Flashcard } from "../../types";
import {  ReviewDTO } from "../../types/flashcards/flashcardsRequest";
import { httpClient } from "../api/httpClient";

export async function getAllFlashcards() {
  return httpClient<Flashcard[]>('/flashcard', {
    method: 'GET'
  });
}

export async function getFlashcardById(id: string) {
  return httpClient<Flashcard>(`/flashcard/details/${id}`, {
    method: 'GET'
  });
}

export async function getFlashcardsByMaterial(materialId: string) {
  return httpClient<Flashcard[]>(`/flashcard/listMaterial/${materialId}`, {
    method: 'GET'
  });
}

export async function getFlashcardsForReview() {
  return httpClient<Flashcard[]>('/flashcard/study', {
    method: 'GET'
  });
}
export async function getFlashcardsForReviewMaterial(id: string) {
  return httpClient<Flashcard[]>(`/flashcard/study/${id}`, {
    method: 'GET'
  });
}

export async function updateFlashcardReview(id: string, difficulty: ReviewDTO) {
  return httpClient<Flashcard,ReviewDTO>(`/flashcard/review/${id}`, {
    method: 'PUT',
    data: difficulty
  });
}

export async function archiveFlashcard(id: string) {
  return httpClient<Flashcard>(`/flashcard/archive/${id}`, {
    method: 'PUT'
  });
}

export async function createFlashcard(flashcard: Partial<Flashcard>) {
  return httpClient<Flashcard, Partial<Flashcard>>('/flashcard', {
    method: 'POST',
    data: flashcard
  });
}

export async function updateFlashcard(id: string, flashcard: Partial<Flashcard>) {
  return httpClient<Flashcard, Partial<Flashcard>>(`/flashcard/${id}`, {
    method: 'PUT',
    data: flashcard
  });
}

export async function deleteFlashcard(id: string) {
  return httpClient<void>(`/flashcard/${id}`, {
    method: 'DELETE'
  });
}
