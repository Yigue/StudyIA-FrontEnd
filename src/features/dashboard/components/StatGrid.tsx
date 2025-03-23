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
        label="Materiales"
        value={stats.totalMaterials}
        bgColor="bg-green-50"
        iconColor="text-green-600"
      />
      <StatsCard
        icon={Brain}
        label="Flashcards"
        value={stats.totalFlashcards}
        bgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatsCard
        icon={Clock}
        label="Horas de Estudio"
        value={stats.studyHours}
        bgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <StatsCard
        icon={Trophy}
        label="Logros"
        value={stats.achievements}
        bgColor="bg-yellow-50"
        iconColor="text-yellow-600"
      />
    </div>
  );
};

export default StatGrid; 