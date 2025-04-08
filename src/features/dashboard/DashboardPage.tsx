import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import StatGrid from "./components/StatGrid";
import ChartsGrid from "./components/ChartsGrid";
import QuickActions from "./components/QuickActions";
import StudyOverview from "./components/StudyOverview";
import { useDashboardData } from "./hooks/useDashboardData";

const DashboardPage: React.FC = () => {
  const { stats, studySessions, upcomingReviews, refreshData, isLoading } = useDashboardData();

  // Datos de ejemplo para StudyOverview (en un dashboard real, estos vendrían de la API)
  const studyStats = {
    todayMinutes: 45,
    weekMinutes: 210,
    monthCards: 352,
    cardsToReview: 24,
    streak: stats.streak || 5,
    bestStreak: 14,
    completionRate: 78,
    upcomingReviewsCount: upcomingReviews?.length || 12
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Aquí tienes un resumen de tu progreso de estudio
        </p>

        {/* Acciones rápidas */}
        <QuickActions />
        
        {/* Resumen de estudio */}
        <StudyOverview studyStats={studyStats} />
        
        {/* Componentes originales */}
        <StatGrid stats={stats} />
        <div className="mt-8">
          <ChartsGrid studySessions={studySessions} upcomingReviews={upcomingReviews} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
