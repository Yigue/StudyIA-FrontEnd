import React from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  GraduationCap,
  ArrowRight,
  Timer,
  Award,
  AlertTriangle
} from 'lucide-react';
import { StudySessionConfig } from '../../../../../types/flashcards';

interface StudyStats {
  total: number;
  correct: number;
  incorrect: number;
  timeSpent: number;
  currentStreak: number;
  bestStreak: number;
  cardsCompleted: number;
}

interface CompletionSummaryProps {
  stats: StudyStats;
  formatTime: (seconds: number) => string;
  onNewSession: () => void;
  studyMode: StudySessionConfig['studyMode'];
  // Propiedades para modo examen
  examPassed?: boolean;
  examScore?: number;
  examPassingScore?: number;
  // Propiedades para desafío diario
  dailyGoalReached?: boolean;
  dailyStreak?: number;
  dailyTargetStreak?: number;
  // Total de tarjetas
  totalCards: number;
}

const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  stats,
  formatTime,
  onNewSession,
  studyMode,
  examPassed,
  examScore,
  examPassingScore,
  dailyGoalReached,
  dailyStreak,
  dailyTargetStreak,
  totalCards
}) => {
  // Calcular la tasa de acierto
  const accuracy = stats.cardsCompleted > 0
    ? Math.round((stats.correct / stats.cardsCompleted) * 100)
    : 0;
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' },
    tap: { scale: 0.98 }
  };
  
  // Determinar mensaje basado en el rendimiento
  const getMessage = () => {
    if (studyMode === 'exam') {
      if (examPassed) return "¡Felicidades! Has aprobado el examen.";
      return "No has alcanzado la puntuación necesaria, ¡sigue practicando!";
    }
    
    if (studyMode === 'daily_challenge') {
      if (dailyGoalReached) return "¡Has completado el desafío diario! Mantén la racha.";
      return "No has completado el desafío hoy, ¡inténtalo de nuevo mañana!";
    }
    
    if (studyMode === 'pomodoro') {
      return "¡Has completado tu sesión Pomodoro! El estudio con descansos mejora la retención.";
    }
    
    // Mensaje estándar basado en el rendimiento
    if (accuracy >= 90) return "¡Excelente trabajo! Dominas este tema.";
    if (accuracy >= 70) return "¡Muy bien! Estás progresando rápidamente.";
    if (accuracy >= 50) return "Buen esfuerzo. Sigue practicando para mejorar.";
    return "Continúa practicando. La constancia es clave para el aprendizaje.";
  };
  
  // Determinar reconocimiento basado en el streak
  const getStreakMessage = () => {
    if (stats.bestStreak >= 15) return "¡Impresionante concentración!";
    if (stats.bestStreak >= 10) return "¡Gran racha!";
    if (stats.bestStreak >= 5) return "¡Buena racha!";
    return "Sigue mejorando tu racha.";
  };
  
  // Render el título y el icono según el modo de estudio
  const renderTitleSection = () => {
    let icon = <Trophy className="w-12 h-12 text-white" />;
    let title = "¡Sesión Completada!";
    let bgColorClass = "from-amber-400 to-amber-600";
    
    if (studyMode === 'exam') {
      icon = examPassed 
        ? <Trophy className="w-12 h-12 text-white" /> 
        : <AlertTriangle className="w-12 h-12 text-white" />;
      title = examPassed 
        ? "¡Examen Aprobado!" 
        : "Examen Completado";
      bgColorClass = examPassed 
        ? "from-green-400 to-green-600" 
        : "from-amber-400 to-amber-600";
    } else if (studyMode === 'daily_challenge') {
      icon = dailyGoalReached 
        ? <Award className="w-12 h-12 text-white" /> 
        : <Calendar className="w-12 h-12 text-white" />;
      title = dailyGoalReached 
        ? "¡Desafío Completado!" 
        : "Desafío Intentado";
      bgColorClass = dailyGoalReached 
        ? "from-emerald-400 to-emerald-600" 
        : "from-blue-400 to-blue-600";
    } else if (studyMode === 'pomodoro') {
      icon = <Timer className="w-12 h-12 text-white" />;
      title = "¡Sesión Pomodoro Completada!";
      bgColorClass = "from-red-400 to-red-600";
    }
    
    return (
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.div
          initial={{ rotate: -5, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3
          }}
          className={`w-24 h-24 bg-gradient-to-br ${bgColorClass} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg`}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {getMessage()}
        </p>
      </motion.div>
    );
  };
  
  // Renderizar estadísticas específicas para cada modo
  const renderModeSpecificStats = () => {
    if (studyMode === 'exam' && examScore !== undefined && examPassingScore !== undefined) {
      const examPercentage = Math.round((examScore / totalCards) * 100);
      return (
        <motion.div 
          className={`p-4 rounded-lg mb-8 text-left ${
            examPassed 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30' 
              : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30'
          }`}
          variants={itemVariants}
        >
          <h4 className={`font-semibold ${
            examPassed 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-amber-700 dark:text-amber-300'
          } mb-2`}>
            Resultados del Examen
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Puntuación:</span>
              <span className="font-medium text-gray-800 dark:text-white">{examScore}/{totalCards} ({examPercentage}%)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Puntuación para aprobar:</span>
              <span className="font-medium text-gray-800 dark:text-white">{examPassingScore}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Estado:</span>
              <span className={`font-medium ${
                examPassed 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {examPassed ? 'Aprobado' : 'No aprobado'}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className={`h-2.5 rounded-full ${
                  examPassed 
                    ? 'bg-green-500 dark:bg-green-600' 
                    : 'bg-amber-500 dark:bg-amber-600'
                }`}
                style={{ width: `${examPercentage}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (studyMode === 'daily_challenge' && dailyStreak !== undefined && dailyTargetStreak !== undefined) {
      const streakPercentage = Math.min(Math.round((dailyStreak / dailyTargetStreak) * 100), 100);
      return (
        <motion.div 
          className={`p-4 rounded-lg mb-8 text-left ${
            dailyGoalReached 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30' 
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30'
          }`}
          variants={itemVariants}
        >
          <h4 className={`font-semibold ${
            dailyGoalReached 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : 'text-blue-700 dark:text-blue-300'
          } mb-2`}>
            Progreso del Desafío Diario
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Racha actual:</span>
              <span className="font-medium text-gray-800 dark:text-white">{dailyStreak}/{dailyTargetStreak}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Estado:</span>
              <span className={`font-medium ${
                dailyGoalReached 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {dailyGoalReached ? '¡Meta alcanzada!' : 'En progreso'}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className={`h-2.5 rounded-full ${
                  dailyGoalReached 
                    ? 'bg-emerald-500 dark:bg-emerald-600' 
                    : 'bg-blue-500 dark:bg-blue-600'
                }`}
                style={{ width: `${streakPercentage}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (studyMode === 'pomodoro') {
      return (
        <motion.div 
          className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 mb-8 text-left"
          variants={itemVariants}
        >
          <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
            Resumen Pomodoro
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tiempo total de estudio:</span>
              <span className="font-medium text-gray-800 dark:text-white">{formatTime(stats.timeSpent)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tarjetas por minuto:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {stats.timeSpent > 0 
                  ? (stats.cardsCompleted / (stats.timeSpent / 60)).toFixed(1) 
                  : '0'}
              </span>
            </div>
            
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Recordatorio: El método Pomodoro recomienda un descanso más largo cada 4 ciclos de estudio.
            </p>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {renderTitleSection()}
      
      {/* Estadísticas específicas para el modo */}
      {renderModeSpecificStats()}
      
      {/* Estadísticas generales */}
      <motion.div 
        className="grid grid-cols-2 gap-y-6 gap-x-8 max-w-md mx-auto mb-10 text-left"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Tarjetas estudiadas</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">{stats.cardsCompleted}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Tiempo estudiado</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">{formatTime(stats.timeSpent)}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Respuestas correctas</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">{stats.correct}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Respuestas incorrectas</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">{stats.incorrect}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Mejor racha</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">
              {stats.bestStreak}
              <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">{getStreakMessage()}</span>
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ x: 5 }}
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Tasa de acierto</p>
            <p className="font-semibold text-gray-800 dark:text-white text-lg">
              {accuracy}%
            </p>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Consejo de estudio personalizado según el modo */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-8 text-left"
        variants={itemVariants}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Consejo de estudio</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {studyMode === 'pomodoro' 
                ? "Los descansos cortos entre periodos de estudio intenso ayudan a consolidar la memoria. Recuerda hidratarte y descansar la vista."
                : studyMode === 'exam'
                  ? "Analiza las preguntas que te resultaron difíciles. Puedes crear una nueva sesión de estudio enfocada en estos temas."
                  : studyMode === 'daily_challenge'
                    ? "Mantener una racha diaria de estudio es clave para el aprendizaje a largo plazo. Incluso 5-10 minutos al día marcan la diferencia."
                    : "Para mejorar tu retención, intenta repasar las tarjetas que te resultaron difíciles en los próximos días. La repetición espaciada es clave para la memoria a largo plazo."
              }
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Botones de acción */}
      <motion.div className="flex flex-col sm:flex-row justify-center gap-3 mt-8" variants={itemVariants}>
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={onNewSession}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Nueva Sesión</span>
        </motion.button>
        <Link
          to="/flashcards"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Volver al Explorador
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default CompletionSummary; 