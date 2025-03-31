import React from 'react';
import { BookOpen, Brain, Clock, Trophy } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { StudyStats } from '../types/dashboard.types';

interface StatGridProps {
  stats: StudyStats;
}

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        icon={BookOpen}
        title="Materiales"
        value={stats.totalMaterials}
        color="green"
      />
      <StatsCard
        icon={Brain}
        title="Flashcards"
        value={stats.totalFlashcards}
        color="blue"
      />
      <StatsCard
        icon={Clock}
        title="Horas de Estudio"
        value={stats.studyHours}
        color="purple"
      />
      <StatsCard
        icon={Trophy}
        title="Logros"
        value={stats.achievements}
        color="yellow"
      />
    </div>
  );
};

export default StatGrid; 