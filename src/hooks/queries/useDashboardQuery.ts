import { useQueries, useQueryClient } from '@tanstack/react-query';
import { materialsKeys } from './useMaterialsQuery';
import { flashcardsKeys } from './useFlashcardsQuery';
import * as materialService from '../../services/studyMaterial/studyMaterialService';
import * as flashcardService from '../../services/flashcards/flashcardService';
import { useState, useEffect } from 'react';
import {
  generateMockStudySessions,
  calculateTotalStudyHours,
  calculateAchievements,
  calculateStreak,
} from '../../features/dashboard/utils/dashboard.utils';
import { StudySession, FlashcardReview } from '../../types';

// Función para generar revisiones próximas basadas en los flashcards
const generateUpcomingReviews = (cards: any[]): FlashcardReview[] => {
  if (!cards || cards.length === 0) return [];

  return cards.slice(0, 5).map((card) => ({
    question: card.question || "Sin pregunta",
    next_review: new Date(
      Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    difficulty:
      typeof card.difficulty === "string"
        ? parseInt(card.difficulty)
        : typeof card.difficulty === "number"
        ? card.difficulty
        : Math.floor(Math.random() * 5) + 1,
  }));
};

/**
 * Hook para obtener datos del dashboard
 * Combina múltiples consultas en una sola respuesta
 */
export const useDashboardQuery = () => {
  const queryClient = useQueryClient();
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalFlashcards: 0,
    studyHours: 0,
    achievements: 0,
    streak: 0,
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<FlashcardReview[]>([]);

  // Utilizar useQueries para ejecutar múltiples consultas en paralelo
  const results = useQueries({
    queries: [
      {
        queryKey: materialsKeys.lists(),
        queryFn: () => materialService.getAllStudyMaterials(),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: flashcardsKeys.lists(),
        queryFn: () => flashcardService.getAllFlashcards(),
        staleTime: 5 * 60 * 1000,
      }
    ],
  });

  // Extraer resultados
  const [materialsResult, flashcardsResult] = results;
  
  // Determinar estado general
  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);
  const error = results.find(result => result.error)?.error;

  // Actualizar estadísticas cuando cambian los datos
  useEffect(() => {
    if (isLoading || isError) return;
    
    const materials = materialsResult.data?.data || [];
    const flashcards = flashcardsResult.data?.data || [];
    
    // Generar sesiones de estudio simuladas
    const mockSessions = generateMockStudySessions();
    
    setStats({
      totalMaterials: materials.length || 0,
      totalFlashcards: flashcards.length || 0,
      studyHours: calculateTotalStudyHours(mockSessions),
      achievements: calculateAchievements(
        materials.length || 0,
        flashcards.length || 0
      ),
      streak: calculateStreak(mockSessions),
    });

    setStudySessions(mockSessions);

    if (flashcards.length) {
      setUpcomingReviews(generateUpcomingReviews(flashcards));
    }
  }, [materialsResult.data, flashcardsResult.data, isLoading, isError]);

  // Función para refrescar los datos
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: materialsKeys.lists() });
    queryClient.invalidateQueries({ queryKey: flashcardsKeys.lists() });
  };

  return {
    stats,
    studySessions,
    upcomingReviews,
    isLoading,
    isError,
    error,
    refreshData,
  };
}; 