import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { TrendingUp, Clock, Calendar, BarChart3, Check, TimerReset, Brain, Loader2 } from 'lucide-react';
import { useFlashcardsQuery } from '../../../hooks/queries/useFlashcardsQuery';

// Simulamos gráficos simples con divs, en un proyecto real usaríamos librería de gráficos
const BarGraph = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(...data.map(item => item.value)) || 1;
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`${item.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${(item.value / max) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FlashcardsStatsOptimized: React.FC = () => {
  // Utilizamos React Query para obtener los flashcards con manejo de estado de carga y error
  const { 
    data: flashcards = [], 
    isLoading, 
    error 
  } = useFlashcardsQuery();
  
  const stats = useMemo(() => {
    if (!flashcards || flashcards.length === 0) {
      return {
        total: 0,
        due: 0,
        completed: 0,
        byDifficulty: [
          { label: 'Fácil', value: 0, color: 'bg-green-500' },
          { label: 'Normal', value: 0, color: 'bg-yellow-500' },
          { label: 'Difícil', value: 0, color: 'bg-red-500' },
        ],
        bySubject: [],
        streak: 0
      };
    }
    
    const now = new Date();
    // En muchos casos podemos tener nextReview o lastReviewed para calcular
    const due = flashcards.filter(f => {
      const reviewDate = f.nextReview ? new Date(f.nextReview) : 
                       f.lastReviewed ? new Date(f.lastReviewed) : now;
      return reviewDate <= now;
    }).length;
    
    const completed = flashcards.filter(f => {
      const reviewDate = f.nextReview ? new Date(f.nextReview) : null;
      return reviewDate && reviewDate > now;
    }).length;
    
    // Agrupar por dificultad
    const difficultyMap: Record<string, number> = {
      'easy': 0,
      'normal': 0,
      'hard': 0,
    };
    
    flashcards.forEach(f => {
      if (f.difficulty) {
        const dif = typeof f.difficulty === 'number' 
          ? (f.difficulty <= 2 ? 'easy' : f.difficulty <= 3 ? 'normal' : 'hard')
          : f.difficulty;
        difficultyMap[dif] = (difficultyMap[dif] || 0) + 1;
      }
    });
    
    const byDifficulty = [
      { label: 'Fácil', value: difficultyMap['easy'] || 0, color: 'bg-green-500' },
      { label: 'Normal', value: difficultyMap['normal'] || 0, color: 'bg-yellow-500' },
      { label: 'Difícil', value: difficultyMap['hard'] || 0, color: 'bg-red-500' },
    ];
    
    // Agrupar por materia
    const subjectMap: Record<string, number> = {};
    flashcards.forEach(f => {
      // Usar material_id o materialId según esté disponible
      const materialId = f.material_id || f.materialId;
      if (materialId) {
        subjectMap[materialId] = (subjectMap[materialId] || 0) + 1;
      }
    });
    
    const bySubject = Object.entries(subjectMap).map(([id, count], index) => {
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
      return {
        label: `Material ${id.substring(0, 6)}...`,
        value: count,
        color: colors[index % colors.length]
      };
    });
    
    // Calculamos una racha simulada (en un caso real esto vendría de la API)
    const streak = Math.max(1, Math.floor(completed / Math.max(1, flashcards.length) * 10));
    
    return {
      total: flashcards.length,
      due,
      completed,
      byDifficulty,
      bySubject,
      streak
    };
  }, [flashcards]);
  
  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="ml-2 text-indigo-600">Cargando estadísticas...</p>
      </div>
    );
  }
  
  // Estado de error
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <p className="font-medium">Error al cargar estadísticas</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Estadísticas de Flashcards</h2>
        <Link
          to="/flashcards"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver a Flashcards
        </Link>
      </div>
      
      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { 
            title: 'Total Flashcards', 
            value: stats.total, 
            icon: BarChart3, 
            color: 'bg-blue-600'
          },
          { 
            title: 'Pendientes', 
            value: stats.due, 
            icon: Clock, 
            color: 'bg-orange-600'
          },
          { 
            title: 'Completadas', 
            value: stats.completed, 
            icon: Check, 
            color: 'bg-green-600'
          },
          { 
            title: 'Racha actual', 
            value: stats.streak, 
            icon: TimerReset, 
            color: 'bg-purple-600'
          }
        ].map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className={`p-2 ${item.color} rounded-md mr-3`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.title}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por dificultad */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Por Dificultad</h3>
          </div>
          
          {stats.total > 0 ? (
            <BarGraph data={stats.byDifficulty} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No hay datos disponibles
            </p>
          )}
        </div>
        
        {/* Gráfico por materia */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Por Material</h3>
          </div>
          
          {stats.bySubject.length > 0 ? (
            <BarGraph data={stats.bySubject} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No hay datos disponibles
            </p>
          )}
        </div>
        
        {/* Rendimiento en el tiempo (simulado) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Rendimiento en el Tiempo</h3>
          </div>
          
          {stats.total > 0 ? (
            <div className="h-48 flex items-end justify-between px-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={i} className="w-1/8 flex flex-col items-center">
                    <div
                      className="w-8 bg-indigo-500 rounded-t transform transition-all duration-700 ease-in-out"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 100}ms` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-16">
              No hay datos disponibles. Comienza a estudiar para ver tu progreso.
            </p>
          )}
        </div>
      </div>
      
      {/* Mensaje motivacional */}
      {stats.total === 0 && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            ¡Aún no tienes estadísticas!
          </h3>
          <p className="text-blue-700 dark:text-blue-400 mb-4">
            Comienza a crear y estudiar flashcards para ver tus estadísticas de aprendizaje.
          </p>
          <Link 
            to="/flashcards/dashboard"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear mi primera flashcard
          </Link>
        </div>
      )}
    </div>
  );
};

export default FlashcardsStatsOptimized; 