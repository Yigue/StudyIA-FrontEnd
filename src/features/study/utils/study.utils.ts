import { AnalysisResult } from '../types/study.types';
import { httpClient } from '../../../services/api/httpClient';

interface Subject {
  id: string;
  name: string;
}

export const fetchSubjectsFromDB = async (token: string) => {
  const response = await httpClient<Subject[]>('/subjects', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data || [];
};

export const createNewSubjectInDB = async (name: string, token: string) => {
  const response = await httpClient<Subject, {name: string}>('/subjects', {
    method: 'POST',
    data: { name },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const saveMaterialAndFlashcardsInDB = async (
  text: string,
  result: AnalysisResult,
  selectedSubject: string,
  title: string,
  token: string
) => {
  // Crear material
  const response = await httpClient<any, any>('/materials/create-with-flashcards', {
    method: 'POST',
    data: {
      title,
      content: text,
      summary: result.summary,
      subject_id: selectedSubject,
      flashcards: result.flashcards.map(fc => ({
        question: fc.question,
        answer: fc.answer,
        difficulty: 3,
        next_review: new Date().toISOString()
      }))
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
