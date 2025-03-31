import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import StatGrid from "./components/StatGrid";
import ChartsGrid from "./components/ChartsGrid";
import { useDashboardData } from "./hooks/useDashboardData";


const DashboardPage: React.FC = () => {
  const { stats, studySessions, upcomingReviews, refreshData, isLoading } = useDashboardData();

  return (
    <DashboardLayout
      title="¡Bienvenido de vuelta!"
      subtitle="Aquí tienes un resumen de tu progreso de estudio"
      streak={stats.streak}
      isLoading={isLoading}
      onRefresh={refreshData}
      stats={<StatGrid stats={stats} />}
      charts={<ChartsGrid studySessions={studySessions} upcomingReviews={upcomingReviews} />}
    />
  );
};

export default DashboardPage;
