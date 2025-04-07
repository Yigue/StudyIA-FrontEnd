import React, { useMemo } from 'react';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CalendarClock, Brain, BookOpen, Clock, Award, BarChart3, Scale, AlertTriangle } from 'lucide-react';
import { 
  SpacedRepetitionStats, 
  CategoryPerformance, 
  StudyTimeData,
  WeakArea,
} from '../../types/flashcards';
import { calculateForgettingCurve } from '../../services/flashcards/spacedRepetitionService';
import { FlashcardWithSpacedRepetition } from '../../types/flashcards';

interface AnalyticsProps {
  stats: SpacedRepetitionStats;
  categoryPerformance: CategoryPerformance[];
  studyTimeData: StudyTimeData[];
  weakAreas: WeakArea[];
  selectedCard?: FlashcardWithSpacedRepetition;
}

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#fb7185', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf'];

// Formato de fechas para gráficos
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Calcula la eficiencia relativa
const calculateEfficiency = (stats: SpacedRepetitionStats): number => {
  const { totalReviews, correctResponses, averageTimePerCard } = stats;
  if (totalReviews === 0) return 0;
  
  const correctRate = correctResponses / totalReviews;
  const timeEfficiency = Math.min(1, 10 / (averageTimePerCard || 10)); // Normalizado a 0-1
  
  return Math.round((correctRate * 0.7 + timeEfficiency * 0.3) * 100);
};

const FlashcardAnalytics: React.FC<AnalyticsProps> = ({
  stats,
  categoryPerformance,
  studyTimeData,
  weakAreas,
  selectedCard
}) => {
  // Ordenar categorías por rendimiento para mostrar las áreas más débiles primero
  const sortedCategories = useMemo(() => (
    [...categoryPerformance].sort((a, b) => a.averageCorrectRate - b.averageCorrectRate)
  ), [categoryPerformance]);
  
  // Calcular curva de olvido para la tarjeta seleccionada
  const forgettingCurve = useMemo(() => {
    if (!selectedCard) return [];
    return calculateForgettingCurve(selectedCard, 30, 10).map(point => ({
      date: point.date.toLocaleDateString(),
      retention: Math.round(point.retention * 100)
    }));
  }, [selectedCard]);
  
  // Calcular la eficiencia de estudio
  const efficiency = useMemo(() => calculateEfficiency(stats), [stats]);
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Análisis de Estudio
      </h2>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Tarjeta de estadísticas generales */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center mb-3">
            <BookOpen className="text-blue-500 dark:text-blue-400 mr-2" size={20} />
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">Progreso</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Totales:</span>
              <span className="font-medium">{stats.totalReviews} tarjetas</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Dominadas:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {stats.masteredCards} ({Math.round((stats.masteredCards / (stats.totalReviews || 1)) * 100)}%)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">En aprendizaje:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {stats.learningCards}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tarjeta de retención */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center mb-3">
            <Brain className="text-purple-500 dark:text-purple-400 mr-2" size={20} />
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">Retención</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.retentionRate * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Tasa de retención estimada
            </div>
          </div>
        </div>
        
        {/* Tarjeta de racha */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
          <div className="flex items-center mb-3">
            <CalendarClock className="text-orange-500 dark:text-orange-400 mr-2" size={20} />
            <h3 className="font-semibold text-orange-700 dark:text-orange-300">Constancia</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.streakDays}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Días consecutivos estudiando
            </div>
          </div>
        </div>
        
        {/* Tarjeta de eficiencia */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center mb-3">
            <Award className="text-green-500 dark:text-green-400 mr-2" size={20} />
            <h3 className="font-semibold text-green-700 dark:text-green-300">Eficiencia</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {efficiency}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Índice de eficacia de estudio
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico de tiempo de estudio */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Clock size={18} className="mr-2" />
          Tiempo de Estudio
        </h3>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={studyTimeData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tickFormatter={(value) => `${value}m`} 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                formatter={(value) => [`${value} minutos`, 'Tiempo']}
                labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
              />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                stroke="#38bdf8" 
                strokeWidth={2}
                dot={{ stroke: '#38bdf8', strokeWidth: 2, r: 4, fill: 'white' }}
                activeDot={{ r: 6, stroke: '#0284c7', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Rendimiento por categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <BarChart3 size={18} className="mr-2" />
            Rendimiento por Categoría
          </h3>
          <div className="space-y-3">
            {sortedCategories.map((category, index) => (
              <div key={category.categoryId} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{category.categoryName}</span>
                  <span className={`text-sm font-medium ${
                    category.averageCorrectRate >= 0.8 ? 'text-green-500' : 
                    category.averageCorrectRate >= 0.6 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {Math.round(category.averageCorrectRate * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{
                      width: `${Math.round(category.averageCorrectRate * 100)}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{category.masteredCount} dominadas</span>
                  <span>{category.learningCount} aprendiendo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Scale size={18} className="mr-2" />
            Distribución de Conocimiento
          </h3>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Dominadas', value: stats.masteredCards },
                    { name: 'Aprendiendo', value: stats.learningCards },
                    { name: 'Revisión', value: stats.reviewCards },
                    { name: 'Nuevas', value: stats.newCards },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {[
                    { name: 'Dominadas', color: '#4ade80' },
                    { name: 'Aprendiendo', color: '#fb923c' },
                    { name: 'Revisión', color: '#818cf8' },
                    { name: 'Nuevas', color: '#94a3b8' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Cantidad']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {[
                { name: 'Dominadas', color: '#4ade80' },
                { name: 'Aprendiendo', color: '#fb923c' },
                { name: 'Revisión', color: '#818cf8' },
                { name: 'Nuevas', color: '#94a3b8' },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Áreas débiles */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <AlertTriangle size={18} className="mr-2" />
          Áreas que necesitan atención
        </h3>
        <div className="space-y-3">
          {weakAreas.map((area, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{area.areaName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{area.description}</p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  area.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  area.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {area.priority === 'high' ? 'Alta' : 
                   area.priority === 'medium' ? 'Media' : 'Baja'}
                </div>
              </div>
              
              <div className="mt-3">
                <h5 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Acción Recomendada</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{area.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Curva de olvido */}
      {selectedCard && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Brain size={18} className="mr-2" />
            Predicción de Retención
          </h3>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
              Tarjeta seleccionada: <span className="font-medium text-gray-800 dark:text-gray-200">
                {selectedCard.question.substring(0, 40)}...
              </span>
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={forgettingCurve}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Retención']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#c084fc" 
                  strokeWidth={2}
                  dot={{ stroke: '#c084fc', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardAnalytics; 