import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card } from '../../../components/ui/Card';
import { BarChart, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/tabs';
import { TimeRange, StudyTimeData } from '../../../types/flashcards/analytics';
import { useFlashcards } from '../../../hooks/useFlashcards';

const FlashcardsAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // En una implementación real, estos datos vendrían de la API
  // Aquí los calculamos en base a los flashcards disponibles
  const stats = React.useMemo(() => {
    const total = flashcards.length;
    const today = new Date();
    const reviewedToday = flashcards.filter(card => {
      if (!card.lastReviewed) return false;
      const lastReviewDate = new Date(card.lastReviewed);
      return (
        lastReviewDate.getDate() === today.getDate() &&
        lastReviewDate.getMonth() === today.getMonth() &&
        lastReviewDate.getFullYear() === today.getFullYear()
      );
    }).length;
    
    // Tarjetas "dominadas" (simplificado: las revisadas al menos una vez)
    const mastered = flashcards.filter(card => card.lastReviewed).length;
    
    // En una implementación real, estos valores vendrían del análisis en el backend
    return {
      totalCards: total,
      reviewedToday,
      masteredCards: mastered,
      retentionRate: total > 0 ? Math.round((mastered / total) * 100) : 0,
      streakDays: 8 // Este valor es simulado
    };
  }, [flashcards]);
  
  // Simular datos de estudio por día para el gráfico
  const studyTimeData: StudyTimeData[] = React.useMemo(() => {
    // En una implementación real, estos datos vendrían de la API
    const daysToGenerate = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    
    return Array.from({ length: daysToGenerate }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (daysToGenerate - index - 1));
      
      return {
        date: date.toISOString(),
        minutes: Math.floor(Math.random() * 60) + 10, // 10-70 minutos
        cardsReviewed: Math.floor(Math.random() * 30) + 5, // 5-35 tarjetas
        newCards: Math.floor(Math.random() * 10), // 0-10 tarjetas nuevas
        reviewCards: Math.floor(Math.random() * 25) + 5 // 5-30 tarjetas de repaso
      };
    });
  }, [timeRange]);
  
  const handleNavigateToDashboard = () => {
    navigate({ to: '/flashcards/dashboard' });
  };
  
  const handleChangeTimeRange = (value: string) => {
    setTimeRange(value as TimeRange);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Análisis de Flashcards
        </h1>
        <Button onClick={handleNavigateToDashboard} variant="outline" size="sm">
          Ver Dashboard
        </Button>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
              <BarChart className="text-indigo-600 dark:text-indigo-400 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Tarjetas</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalCards}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <Activity className="text-green-600 dark:text-green-400 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revisadas Hoy</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.reviewedToday}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <TrendingUp className="text-blue-600 dark:text-blue-400 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasa de Retención</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.retentionRate}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
              <Calendar className="text-amber-600 dark:text-amber-400 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Racha de Estudio</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.streakDays} días</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Contenido principal */}
      <Card className="p-6">
        <div className="mb-4">
          <Tabs 
            tabs={[
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mes' },
              { id: 'three-month', label: 'Trimestre' }
            ]}
            value={timeRange}
            onChange={handleChangeTimeRange}
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Progreso de Aprendizaje
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          En esta versión de demostración, mostramos datos simulados. En una implementación real,
          aquí se mostrarían gráficos detallados de tu progreso de aprendizaje basados en 
          {studyTimeData.length} días de datos.
        </p>
        
        {/* Simulación de un gráfico */}
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Aquí iría un gráfico detallado mostrando {studyTimeData.reduce((sum, day) => sum + day.cardsReviewed, 0)} tarjetas revisadas
            en los últimos {studyTimeData.length} días
          </p>
        </div>
      </Card>
      
      {/* Información sobre próximas revisiones */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Próximas Revisiones
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Hoy</span>
            <span className="font-medium text-gray-800 dark:text-white">12 tarjetas</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Mañana</span>
            <span className="font-medium text-gray-800 dark:text-white">18 tarjetas</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Próximos 7 días</span>
            <span className="font-medium text-gray-800 dark:text-white">45 tarjetas</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FlashcardsAnalyticsPage; 