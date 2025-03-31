import { FlashcardStats } from "../types/flashcards.types";


interface StatsPanelProps {
  stats: FlashcardStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => (
  <div className="card">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Estadísticas
    </h3>
    <div className="space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Total: {stats.total} flashcards
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Filtradas: {stats.filtered} flashcards
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Progreso: {stats.current} de {stats.total}
      </p>
    </div>
  </div>
);
