import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StudySession } from '../types/dashboard.types';

interface StudyActivityChartProps {
  sessions: StudySession[];
}

export const StudyActivityChart: React.FC<StudyActivityChartProps> = ({ sessions }) => {
  // Encontrar la duración máxima para escalar correctamente
  const maxDuration = Math.max(...sessions.map(session => session.duration), 120);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-indigo-100">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Actividad de Estudio</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session, index) => {
          // Calcular ancho relativo para la barra (40% del máximo como mínimo para barras pequeñas)
          const width = Math.max(40, (session.duration / maxDuration) * 200);
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between animate-fadeIn"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: 0, // Comienza invisible pero la animación lo mostrará
                animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`
              }}
            >
              <span className="text-gray-600 font-medium">
                {new Date(session.date).toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric'
                })}
              </span>
              <div className="flex items-center gap-2 min-w-[150px]">
                <div className="relative w-full">
                  <div className="bg-gray-100 h-2 rounded-full w-full absolute"></div>
                  <div 
                    className="bg-indigo-400 h-2 rounded-full absolute left-0 transition-all duration-1000"
                    style={{ width: `${width}px`, transitionDelay: `${index * 100}ms` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 min-w-[60px] text-right">
                  {session.duration} min
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};
