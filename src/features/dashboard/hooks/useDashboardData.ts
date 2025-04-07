import { useCallback } from "react";
import {
  StudyStats,
  StudySession,
  FlashcardReview,
} from "../types/dashboard.types";
import { useDashboardQuery } from "../../../hooks/queries/useDashboardQuery";

interface DashboardData {
  stats: StudyStats;
  studySessions: StudySession[];
  upcomingReviews: FlashcardReview[];
  isLoading: boolean;
  refreshData: () => void;
}

/**
 * Hook para gestionar los datos del dashboard
 * Utilizando React Query internamente
 */
export const useDashboardData = (): DashboardData => {
  // Utilizar el hook de React Query
  const {
    stats,
    studySessions,
    upcomingReviews,
    isLoading,
    refreshData
  } = useDashboardQuery();

  // Función de refresco con manejo de errores
  const refreshDataWithErrorHandling = useCallback(() => {
    try {
      refreshData();
    } catch (error) {
      console.error("Error al actualizar datos del dashboard:", error);
    }
  }, [refreshData]);

  return {
    stats,
    studySessions,
    upcomingReviews,
    isLoading,
    refreshData: refreshDataWithErrorHandling
  };
};
