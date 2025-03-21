import { Flashcard } from "../../types";
import {  ReviewDTO } from "../../types/flashcards/flashcardsRequest";
import { httpClient } from "../api/httpClient";

export async function getAllFlashcards(authToken: string) {
  return httpClient<Flashcard[]>('/flashcard', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function getFlashcardById(id: string, authToken: string) {
  return httpClient<Flashcard>(`/flashcard/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function getFlashcardsByMaterial(materialId: string, authToken: string) {
  return httpClient<Flashcard[]>(`/flashcard/material/${materialId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function getFlashcardsForReview(authToken: string) {
  return httpClient<Flashcard[]>('/flashcard/study', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function updateFlashcardReview(id: string, difficulty: ReviewDTO, authToken: string) {
  return httpClient<Flashcard,ReviewDTO>(`/flashcard/review/${id}`, {
    method: 'PUT',
    data: difficulty ,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}

export async function archiveFlashcard(id: string, authToken: string) {
  return httpClient<Flashcard>(`/flashcard/archive/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}
