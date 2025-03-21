import { httpClient } from '../../../services/api/httpClient';
import { Flashcard } from '../../../types';

export const flashcardService = {
  getFlashcards: async (token: string) => {
    const response = await httpClient<Flashcard[]>('/flashcards', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>, token: string) => {
    const response = await httpClient<Flashcard, Partial<Flashcard>>(`/flashcards/${id}`, {
      method: 'PUT',
      data: updates,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  createFlashcard: async (flashcard: Partial<Flashcard>, token: string) => {
    const response = await httpClient<Flashcard, Partial<Flashcard>>('/flashcards', {
      method: 'POST',
      data: flashcard,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};