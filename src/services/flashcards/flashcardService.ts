import { Flashcard } from "../../types";
import { httpClient } from "../api/httpClient";

// export async function createFlashcard(materialId: string | null, summaryId: string | null, question: string, answer: string) {
//   return httpClient<Flashcard>('/flashcards', {
//     method: 'POST',
//     data: {
//       material_id: materialId,
//       summary_id: summaryId,
//       question,
//       answer,
//       type: 'normal'
//     },
//   });
// }

export async function getAllFlashcards(authToken: string) {
  return httpClient<Flashcard>(`/flashcard`, {
    headers: {
      method: "GET",
      Authorization: authToken,
    },
  });
}

export async function getFlashcardById(id: string, authToken: string) {
  return httpClient<Flashcard>(`/flashcard/${id}`, {
    headers: {
      method: "GET",
      Authorization: authToken,
    },
  });
}

export async function getFlashcardsByMaterial(
  materialId: string,
  authToken: string
) {
  return httpClient<Flashcard>(`/flashcard/material/${materialId}`, {
    headers: {
      method: "GET",
      Authorization: authToken,
    },
  });
}
export async function getFlashcardsForReview(authToken: string) {
  return httpClient<Flashcard>(`/flashcard/study`, {
    headers: {
      method: "GET",
      Authorization: authToken,
    },
  });
}
export async function getFlashcardsForReviewByMaterial(
  materialId: string,
  authToken: string
) {
  return httpClient<Flashcard>(`/flashcard/study/${materialId}`, {
    headers: {
      method: "GET",
      Authorization: authToken,
    },
  });
}

export async function updateNextReview(id: string, difficulty: string) {
  return httpClient<Flashcard>(`/flashcard/review/${id}`, {
    method: "PUT",
    data: difficulty,
  });
}
export async function archivedFlashcards(id: string) {
  return httpClient<Flashcard>(`/flashcard/archived/${id}`, {
    method: "PUT",
  });
}

// export async function updateFlashcard(id: string, updates: Partial<Flashcard>) {
//   return httpClient<Flashcard>(`/flashcards/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(updates),
//   });
// }

// export async function deleteFlashcard(id: string) {
//   return httpClient<void>(`/flashcards/${id}`, {
//     method: "DELETE",
//   });
// }
