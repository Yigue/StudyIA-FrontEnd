import React from 'react';
import { BarChart, Clock, Check } from 'lucide-react';
import { FlashcardStats } from '../../../../types/flashcards/flashcards';


interface StatsPanelProps {
  stats: FlashcardStats;
  showProgress?: boolean;
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  stats, 
  showProgress = true,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <BarChart className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        Estadísticas
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{stats.total}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Filtradas</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{stats.filtered ?? '-'}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            Pendientes
          </span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {stats.pending ?? '-'}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <Check className="w-3.5 h-3.5 inline mr-1" />
            Completadas
          </span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {stats.completed ?? '-'}
          </span>
        </div>
      </div>
      
      {showProgress && stats.current && stats.current > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progreso</span>
            <span>{stats.current} de {stats.total}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
              style={{ width: `${Math.min(100, ((stats.current || 0) / Math.max(1, stats.total)) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel; 