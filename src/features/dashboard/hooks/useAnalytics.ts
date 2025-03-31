import { useEffect, useState } from 'react';
import { useFlashcards } from '../../../hooks/useFlashcards';
import { useMaterials } from '../../../hooks/useMaterials';

interface AnalyticsData {
  progressByTime: {
    period: string;
    materialsCount: number;
    flashcardsCount: number;
  }[];
  materialsDistribution: {
    label: string;
    value: number;
    percentage: number;
  }[];
  userActivity: {
    date: string;
    activityCount: number;
  }[];
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    progressByTime: [],
    materialsDistribution: [],
    userActivity: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Usar los hooks modernizados con estructura normalizada
  const { materials, loading: materialsLoading } = useMaterials();
  const { flashcards, loading: flashcardsLoading } = useFlashcards();
  
  // Determinar el estado de carga combinado
  const isDataLoading = materialsLoading.isLoading || flashcardsLoading.isLoading;
  
  // Función para generar datos de análisis basados en materiales y flashcards
  const generateAnalyticsData = () => {
    setIsLoading(true);
    
    try {
      // Generar datos de progreso por tiempo (últimos 6 meses)
      const progressByTime = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 5 + i);
        
        return {
          period: date.toLocaleDateString('es-ES', { month: 'long' }),
          materialsCount: Math.floor(Math.random() * (materials.length || 10)),
          flashcardsCount: Math.floor(Math.random() * (flashcards.length || 20))
        };
      });
      
      // Generar distribución de materiales por tipo (simulado)
      const materialTypes = ['PDF', 'Texto', 'Código', 'Imagen', 'Otro'];
      const totalMaterials = materials.length || 10;
      
      let remaining = 100;
      const materialsDistribution = materialTypes.map((label, index) => {
        const isLast = index === materialTypes.length - 1;
        const percentage = isLast ? remaining : Math.floor(Math.random() * Math.min(remaining, 40));
        
        if (!isLast) {
          remaining -= percentage;
        }
        
        return {
          label,
          value: Math.floor((percentage / 100) * totalMaterials),
          percentage
        };
      });
      
      // Generar actividad del usuario (últimos 14 días)
      const userActivity = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 13 + i);
        
        return {
          date: date.toISOString().split('T')[0],
          activityCount: Math.floor(Math.random() * 10)
        };
      });
      
      setAnalytics({
        progressByTime,
        materialsDistribution,
        userActivity
      });
    } catch (error) {
      console.error('Error al generar datos de analíticas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar datos cuando se montan los componentes o cambian los datos
  useEffect(() => {
    // Evitar ejecutar si los datos están cargando
    if (isDataLoading) return;
    
    generateAnalyticsData();
  }, [materials, flashcards, isDataLoading]);
  
  return {
    analytics,
    isLoading: isLoading || isDataLoading,
    refreshAnalytics: generateAnalyticsData
  };
}; 