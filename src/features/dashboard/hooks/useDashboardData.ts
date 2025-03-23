import { useState, useEffect } from 'react';
import { useFlashcards } from '../../../hook/useFlashcards';
import { useMaterials } from '../../../hook/useMaterials';
import { StudyStats, StudySession, FlashcardReview } from '../types/dashboard.types';
import {
  generateMockStudySessions,
  calculateTotalStudyHours,
  calculateAchievements,
  calculateStreak,
} from '../utils/dashboard.utils';
import { Flashcard } from '../../../types/flashcards/flashcards';

interface DashboardData {
  stats: StudyStats;
  studySessions: StudySession[];
  upcomingReviews: FlashcardReview[];
  isLoading: boolean;
  refreshData: () => void;
}

export const useDashboardData = (): DashboardData => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<StudyStats>({
    totalMaterials: 0,
    totalFlashcards: 0,
    studyHours: 0,
    achievements: 0,
    streak: 0,
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<FlashcardReview[]>([]);
  
  const { flashcards } = useFlashcards();
  const { materials } = useMaterials();

  // Función para generar revisiones próximas basadas en los flashcards
  const generateUpcomingReviews = (flashcards: Flashcard[]): FlashcardReview[] => {
    if (!flashcards || flashcards.length === 0) return [];
    
    // Tomar hasta 5 flashcards y convertirlos al formato de revisión
    return flashcards
      .slice(0, 5)
      .map(card => ({
        question: card.question || 'Sin pregunta',
        next_review: new Date(
          Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        difficulty: parseInt(card.difficulty) || Math.floor(Math.random() * 5) + 1
      }));
  };

  const loadData = () => {
    setIsLoading(true);
    
    try {
      const mockSessions = generateMockStudySessions();
      
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
      setUpcomingReviews(generateUpcomingReviews(flashcards || []));
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [materials, flashcards]);

  // Función para refrescar los datos manualmente
  const refreshData = () => {
    loadData();
  };

  return {
    stats,
    studySessions,
    upcomingReviews,
    isLoading,
    refreshData
  };
}; 