import { useState, useEffect, useCallback, useMemo } from 'react';
import { StudyStats, StudySession, FlashcardReview } from '../types/dashboard.types';
import {
  generateMockStudySessions,
  calculateTotalStudyHours,
  calculateAchievements,
  calculateStreak,
} from '../utils/dashboard.utils';
import { Flashcard } from '../../../types/flashcards/flashcards';
import useApp from '../../../hooks/useApp';

interface DashboardData {
  stats: StudyStats;
  studySessions: StudySession[];
  upcomingReviews: FlashcardReview[];
  isLoading: boolean;
  refreshData: () => void;
}

export const useDashboardData = (): DashboardData => {
  // Usar una sola instancia de useApp para evitar ciclos
  const { 
    isLoading, 
    materials, 
    flashcards,
    fetchData,
    onRefresh 
  } = useApp();

  // Estado local para dashboard
  const [stats, setStats] = useState<StudyStats>({
    totalMaterials: 0,
    totalFlashcards: 0,
    studyHours: 0,
    achievements: 0,
    streak: 0,
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<FlashcardReview[]>([]);

  // Función para generar revisiones próximas basadas en los flashcards
  const generateUpcomingReviews = useCallback((cards: Flashcard[]): FlashcardReview[] => {
    if (!cards || cards.length === 0) return [];
    
    return cards
      .slice(0, 5)
      .map(card => ({
        question: card.question || 'Sin pregunta',
        next_review: new Date(
          Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        difficulty: parseInt(card.difficulty) || Math.floor(Math.random() * 5) + 1
      }));
  }, []);

  // Actualizar estadísticas cuando cambian los datos
  useEffect(() => {
    const mockSessions = generateMockStudySessions();
    fetchData();
    if (materials || flashcards) {
      setStats({
        totalMaterials: materials?.length || 0,
        totalFlashcards: flashcards?.length || 0,
        studyHours: calculateTotalStudyHours(mockSessions),
        achievements: calculateAchievements(
          materials?.length || 0,
          flashcards?.length || 0
        ),
        streak: calculateStreak(mockSessions),
      });
      
      setStudySessions(mockSessions);
      
      if (flashcards?.length) {
        setUpcomingReviews(generateUpcomingReviews(flashcards));
      }
    }
  }, []);

  // Función para refrescar los datos
  const refreshData = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  // Memoizar los datos para evitar re-renderizados innecesarios
  return useMemo(() => ({
    stats,
    studySessions,
    upcomingReviews,
    isLoading,
    refreshData
  }), [stats, studySessions, upcomingReviews, isLoading, refreshData]);
}; 