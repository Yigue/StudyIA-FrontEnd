import { FlashcardStats } from '../types/flashcards.types';

interface StatsPanelProps {
  stats: FlashcardStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Estadísticas</h3>
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Total: {stats.total} flashcards
      </p>
      <p className="text-sm text-gray-600">
        Filtradas: {stats.filtered} flashcards
      </p>
      <p className="text-sm text-gray-600">
        Progreso: {stats.current} de {stats.total}
      </p>
    </div>
  </div>
);
