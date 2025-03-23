import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import { useAnalytics } from './hooks/useAnalytics';
import { BarChart, Activity, PieChart } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { analytics, isLoading, refreshAnalytics } = useAnalytics();
  
  return (
    <DashboardLayout
      title="Analíticas de Estudio"
      subtitle="Visualiza tu progreso y patrones de estudio"
      isLoading={isLoading}
      onRefresh={refreshAnalytics}
      stats={
        <div className="grid grid-cols-1 gap-6">
          <ProgressChart data={analytics.progressByTime} />
        </div>
      }
      charts={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaterialDistribution data={analytics.materialsDistribution} />
          <ActivityHeatmap data={analytics.userActivity} />
        </div>
      }
    />
  );
};

// Componente para visualizar el progreso a lo largo del tiempo
const ProgressChart: React.FC<{ data: { period: string; materialsCount: number; flashcardsCount: number }[] }> = ({ data }) => {
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.materialsCount, item.flashcardsCount)),
    10 // Valor mínimo para evitar gráficos vacíos
  );
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <BarChart className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Progreso por Mes</h3>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex items-end justify-center gap-1 h-52">
                <div
                  className="w-5 bg-blue-400 rounded-t-sm transition-all duration-1000 relative group"
                  style={{ 
                    height: `${(item.materialsCount / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                    {item.materialsCount} materiales
                  </div>
                </div>
                <div
                  className="w-5 bg-indigo-500 rounded-t-sm transition-all duration-1000 relative group"
                  style={{ 
                    height: `${(item.flashcardsCount / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                    {item.flashcardsCount} flashcards
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.period}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <span className="text-sm text-gray-600">Materiales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
            <span className="text-sm text-gray-600">Flashcards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para visualizar la distribución de materiales
const MaterialDistribution: React.FC<{ data: { label: string; value: number; percentage: number }[] }> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <PieChart className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Tipos de Materiales</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value} ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para visualizar la actividad del usuario
const ActivityHeatmap: React.FC<{ data: { date: string; activityCount: number }[] }> = ({ data }) => {
  // Función para determinar la intensidad del color según la actividad
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 3) return 'bg-green-100';
    if (count < 6) return 'bg-green-300';
    return 'bg-green-500';
  };
  
  // Organizar datos por semana para el heatmap
  const weeks = [];
  const daysInWeek = 7;
  
  for (let i = 0; i < data.length; i += daysInWeek) {
    weeks.push(data.slice(i, i + daysInWeek));
  }
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Actividad Diaria</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 mb-2">{day}</div>
        ))}
        
        {data.map((item, index) => {
          const date = new Date(item.date);
          return (
            <div 
              key={index}
              className={`h-8 w-full ${getActivityColor(item.activityCount)} rounded-sm cursor-pointer relative group`}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}: {item.activityCount} actividades
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center gap-2 mt-6">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <span className="text-xs text-gray-600">Ninguna</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
          <span className="text-xs text-gray-600">Baja</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
          <span className="text-xs text-gray-600">Media</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-xs text-gray-600">Alta</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 