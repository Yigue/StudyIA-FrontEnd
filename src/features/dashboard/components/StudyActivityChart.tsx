import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StudySession } from '../types/dashboard.types';

interface StudyActivityChartProps {
  sessions: StudySession[];
}

export const StudyActivityChart: React.FC<StudyActivityChartProps> = ({ sessions }) => {
  // Encontrar la duración máxima para escalar correctamente
  const maxDuration = Math.max(...sessions.map(session => session.duration), 120);
  
  // Formatear la fecha para mostrar el día
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Actividad de Estudio</h3>
        </div>
      </div>
      
      <div className="space-y-3 mt-6">
        {sessions.length > 0 ? (
          sessions.map((session, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatDate(session.date)}
              </div>
              <div className="flex-grow h-9 flex items-center">
                <div 
                  className="h-7 bg-indigo-100 dark:bg-indigo-900/30 rounded-md relative"
                  style={{ 
                    width: `${Math.max((session.duration / maxDuration) * 100, 5)}%`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                      {session.duration} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No hay datos de actividad disponibles
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400">Total esta semana</div>
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {sessions.reduce((total, session) => total + session.duration, 0)} min
          </div>
        </div>
      </div>
    </div>
  );
};
