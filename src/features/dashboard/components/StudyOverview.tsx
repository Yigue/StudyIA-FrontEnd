import React from 'react';
import { 
  Clock,
  Brain,
  Calendar,
  ArrowUpRight,
  Trophy,
  Calendar as CalendarIcon,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StudyOverviewProps {
  studyStats: {
    todayMinutes: number;
    weekMinutes: number;
    monthCards: number;
    cardsToReview: number;
    streak: number;
    bestStreak: number;
    completionRate: number;
    upcomingReviewsCount: number;
  };
}

const StudyOverview: React.FC<StudyOverviewProps> = ({ studyStats }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Resumen de Estudio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tiempo de estudio hoy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo hoy</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {studyStats.todayMinutes} min
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-500 font-medium mr-1">+12%</span>
            vs. la semana pasada
          </div>
        </div>
        
        {/* Racha actual */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Racha actual</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {studyStats.streak} días
              </h3>
            </div>
            <motion.div 
              className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                repeatDelay: 5,
                duration: 0.5 
              }}
            >
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </motion.div>
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 mr-1 text-gray-500" />
            Record: {studyStats.bestStreak} días
          </div>
        </div>
        
        {/* Tarjetas pendientes hoy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Por revisar hoy</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {studyStats.cardsToReview} tarjetas
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <ArrowUpRight className="w-4 h-4 mr-1 text-indigo-500" />
            <span className="text-indigo-500 font-medium mr-1">{studyStats.upcomingReviewsCount}</span>
            próximas revisiones
          </div>
        </div>
        
        {/* Tasa de completado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasa de completado</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {studyStats.completionRate}%
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                style={{ width: `${studyStats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyOverview; 