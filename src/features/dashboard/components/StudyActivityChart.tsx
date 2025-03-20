import { TrendingUp } from 'lucide-react';
import { StudySession } from '../types/dashboard.types';

interface StudyActivityChartProps {
  sessions: StudySession[];
}

export const StudyActivityChart = ({ sessions }: StudyActivityChartProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Actividad de Estudio</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-gray-600">
            {new Date(session.date).toLocaleDateString('es-ES', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-2">
            <div 
              className="bg-indigo-100 h-4 rounded"
              style={{ width: `${(session.duration / 150) * 100}px` }}
            ></div>
            <span className="text-sm text-gray-600">{session.duration} min</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
