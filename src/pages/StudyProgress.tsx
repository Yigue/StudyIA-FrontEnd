import React from 'react';
import { Trophy, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useStudyStore } from '../lib/store';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const StudyProgress = () => {
  const { progress, flashcards } = useStudyStore();
  
  const stats = [
    {
      icon: Trophy,
      label: 'Tarjetas Estudiadas',
      value: progress.cardsStudied,
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Precisión',
      value: `${Math.round((progress.correctAnswers / progress.cardsStudied) * 100 || 0)}%`,
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Tiempo de Estudio',
      value: `${Math.round(progress.studyTime / 60)} hrs`,
      color: 'purple'
    },
    {
      icon: Calendar,
      label: 'Última Sesión',
      value: formatDistanceToNow(new Date(progress.lastStudyDate), { 
        addSuffix: true,
        locale: es 
      }),
      color: 'yellow'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Progreso de Estudio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full"
            style={{ 
              width: `${(progress.cardsStudied / flashcards.length) * 100}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{progress.cardsStudied} tarjetas estudiadas</span>
          <span>{flashcards.length} total</span>
        </div>
      </div>
    </div>
  );
};

export default StudyProgress;