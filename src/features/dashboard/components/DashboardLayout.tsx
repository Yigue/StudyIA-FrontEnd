import React from 'react';
import { Target, RefreshCw } from 'lucide-react';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  streak?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  stats: React.ReactNode;
  charts: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  streak = 0,
  isLoading = false,
  onRefresh,
  stats,
  charts
}) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {streak} días de racha
              </span>
            </div>
          )}
          
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-8">
        {stats}
      </div>

      {/* Gráficos y componentes adicionales */}
      <div>
        {charts}
      </div>
    </div>
  );
};

export default DashboardLayout; 