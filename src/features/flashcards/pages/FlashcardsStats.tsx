import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Calendar, BarChart3, Check, TimerReset, Brain } from 'lucide-react';
import { useFlashcards } from '../../../hooks/useFlashcards';

// Simulamos gráficos simples con divs, en un proyecto real usaríamos librería de gráficos
const BarGraph = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(...data.map(item => item.value)) || 1;
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`${item.color} h-2 rounded-full`}
              style={{ width: `${(item.value / max) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FlashcardsStats: React.FC = () => {
  const { flashcards } = useFlashcards();
  
  const stats = useMemo(() => {
    if (!flashcards || flashcards.length === 0) {
      return {
        total: 0,
        due: 0,
        completed: 0,
        byDifficulty: [
          { label: 'Muy Fácil', value: 0, color: 'bg-green-400' },
          { label: 'Fácil', value: 0, color: 'bg-green-600' },
          { label: 'Normal', value: 0, color: 'bg-yellow-500' },
          { label: 'Difícil', value: 0, color: 'bg-red-500' },
          { label: 'Muy Difícil', value: 0, color: 'bg-red-700' }
        ],
        bySubject: [],
        streak: Math.floor(Math.random() * 10) // Simulación
      };
    }
    
    const now = new Date();
    const due = flashcards.filter(f => new Date(f.next_review) <= now).length;
    const completed = flashcards.filter(f => new Date(f.next_review) > now).length;
    
    // Agrupar por dificultad
    const difficultyMap: Record<string, number> = {
      'easy': 0,
      'normal': 0,
      'hard': 0,
    };
    
    flashcards.forEach(f => {
      if (f.difficulty) {
        difficultyMap[f.difficulty] = (difficultyMap[f.difficulty] || 0) + 1;
      }
    });
    
    const byDifficulty = [
      { label: 'Fácil', value: difficultyMap['easy'] || 0, color: 'bg-green-500' },
      { label: 'Normal', value: difficultyMap['normal'] || 0, color: 'bg-yellow-500' },
      { label: 'Difícil', value: difficultyMap['hard'] || 0, color: 'bg-red-500' },
    ];
    
    // Agrupar por materia (usamos el material_id como referencia)
    const subjectMap: Record<string, number> = {};
    flashcards.forEach(f => {
      if (f.material_id) {
        subjectMap[f.material_id] = (subjectMap[f.material_id] || 0) + 1;
      }
    });
    
    const bySubject = Object.entries(subjectMap).map(([id, count], index) => {
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
      return {
        label: `Material ${id.substring(0, 6)}...`, // En producción, usar el nombre real
        value: count,
        color: colors[index % colors.length]
      };
    });
    
    return {
      total: flashcards.length,
      due,
      completed,
      byDifficulty,
      bySubject,
      streak: Math.floor(Math.random() * 10) // Simulación
    };
  }, [flashcards]);
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Estadísticas de Flashcards</h2>
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
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className={`p-2 ${item.color} rounded-md mr-3`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600">{item.title}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por dificultad */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Por Dificultad</h3>
          </div>
          
          {stats.total > 0 ? (
            <BarGraph data={stats.byDifficulty} />
          ) : (
            <p className="text-gray-500 text-center py-6">
              No hay datos disponibles
            </p>
          )}
        </div>
        
        {/* Gráfico por materia */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Por Material</h3>
          </div>
          
          {stats.bySubject.length > 0 ? (
            <BarGraph data={stats.bySubject} />
          ) : (
            <p className="text-gray-500 text-center py-6">
              No hay datos disponibles
            </p>
          )}
        </div>
        
        {/* Rendimiento en el tiempo (simulado) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Rendimiento en el Tiempo</h3>
          </div>
          
          {stats.total > 0 ? (
            <div className="h-48 flex items-end justify-between px-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={i} className="w-1/8 flex flex-col items-center">
                    <div
                      className="w-8 bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-16">
              No hay datos disponibles. Comienza a estudiar para ver tu progreso.
            </p>
          )}
        </div>
      </div>
      
      {/* Mensaje motivacional */}
      {stats.total === 0 && (
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            ¡Aún no tienes estadísticas!
          </h3>
          <p className="text-blue-700 mb-4">
            Comienza a crear y estudiar flashcards para ver tus estadísticas de aprendizaje.
          </p>
          <Link 
            to="/flashcards/dashboard?create=true"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear mi primera flashcard
          </Link>
        </div>
      )}
    </div>
  );
};

export default FlashcardsStats; 