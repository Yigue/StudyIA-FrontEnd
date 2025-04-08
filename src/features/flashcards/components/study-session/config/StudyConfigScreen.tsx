import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { StudySessionConfig, DifficultyLevel } from '../../../../../types/flashcards';
import { 
  Settings, 
  Play, 
  Tag, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Timer,
  BookOpen,
  Award
} from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  color: string;
}

interface StudyConfigScreenProps {
  config: StudySessionConfig;
  setConfig: React.Dispatch<React.SetStateAction<StudySessionConfig>>;
  availableTags: TagItem[];
  onStartSession: () => void;
}

const StudyConfigScreen: React.FC<StudyConfigScreenProps> = ({
  config,
  setConfig,
  availableTags,
  onStartSession
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  
  // Animación para el botón de iniciar
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      backgroundColor: 'rgb(79, 70, 229)',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
    },
    tap: { scale: 0.95 }
  };

  // Asegurar que reviewOrder sea del tipo correcto
  const handleSetReviewOrder = (order: 'due' | 'difficulty' | 'random') => {
    setConfig({...config, reviewOrder: order});
  };

  // Configuración por defecto para cada modo de estudio
  const setStudyMode = (mode: StudySessionConfig['studyMode']) => {
    const updatedConfig = { ...config, studyMode: mode };
    
    // Configurar valores por defecto según el modo
    switch (mode) {
      case 'pomodoro':
        updatedConfig.pomodoroConfig = {
          studyMinutes: 25,
          breakMinutes: 5,
          longBreakMinutes: 15,
          cyclesBeforeLongBreak: 4
        };
        break;
      case 'exam':
        updatedConfig.examConfig = {
          timeLimit: 30,
          questionsCount: 20,
          passingScore: 70,
          showFeedbackImmediately: false
        };
        break;
      case 'daily_challenge':
        updatedConfig.dailyChallengeConfig = {
          cardsCount: 10,
          difficulty: DifficultyLevel.Medium,
          targetStreak: 7
        };
        break;
      default:
        // Eliminar configuraciones específicas si no corresponden al modo
        delete updatedConfig.pomodoroConfig;
        delete updatedConfig.examConfig;
        delete updatedConfig.dailyChallengeConfig;
    }
    
    setConfig(updatedConfig);
  };

  // Funciones para actualizar configuraciones específicas
  const updatePomodoroConfig = (updates: Partial<StudySessionConfig['pomodoroConfig']>) => {
    if (!config.pomodoroConfig) return;
    
    setConfig({
      ...config,
      pomodoroConfig: {
        ...config.pomodoroConfig,
        ...updates
      }
    });
  };
  
  const updateExamConfig = (updates: Partial<StudySessionConfig['examConfig']>) => {
    if (!config.examConfig) return;
    
    setConfig({
      ...config,
      examConfig: {
        ...config.examConfig,
        ...updates
      }
    });
  };
  
  const updateDailyChallengeConfig = (updates: Partial<StudySessionConfig['dailyChallengeConfig']>) => {
    if (!config.dailyChallengeConfig) return;
    
    setConfig({
      ...config,
      dailyChallengeConfig: {
        ...config.dailyChallengeConfig,
        ...updates
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Configurar Sesión de Estudio
        </h3>
        
        {/* Pestañas para básico/avanzado */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'basic' 
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'advanced' 
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Avanzado
          </button>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Contenido de la pestaña básica */}
        {activeTab === 'basic' && (
          <>
            {/* Selección de modo de estudio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modo de Estudio
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {/* Modo Estándar */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStudyMode('standard')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    config.studyMode === 'standard'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  <BookOpen className={`w-8 h-8 mb-2 ${
                    config.studyMode === 'standard'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    config.studyMode === 'standard'
                      ? 'text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Estándar
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Repaso normal
                  </span>
                </motion.button>
                
                {/* Modo Pomodoro */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStudyMode('pomodoro')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    config.studyMode === 'pomodoro'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800'
                  }`}
                >
                  <Timer className={`w-8 h-8 mb-2 ${
                    config.studyMode === 'pomodoro'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    config.studyMode === 'pomodoro'
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Pomodoro
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    25min estudio + 5min descanso
                  </span>
                </motion.button>
                
                {/* Modo Examen */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStudyMode('exam')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    config.studyMode === 'exam'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800'
                  }`}
                >
                  <Clock className={`w-8 h-8 mb-2 ${
                    config.studyMode === 'exam'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    config.studyMode === 'exam'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Examen
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Con tiempo limitado
                  </span>
                </motion.button>
                
                {/* Modo Desafío Diario */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStudyMode('daily_challenge')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    config.studyMode === 'daily_challenge'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'
                  }`}
                >
                  <Award className={`w-8 h-8 mb-2 ${
                    config.studyMode === 'daily_challenge'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    config.studyMode === 'daily_challenge'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Desafío Diario
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Completa la racha diaria
                  </span>
                </motion.button>
              </div>
            </div>
            
            {/* Configuración específica según el modo seleccionado */}
            {config.studyMode === 'pomodoro' && config.pomodoroConfig && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-2 mb-4">
                  <Timer className="w-4 h-4" />
                  Configuración Pomodoro
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiempo de estudio (min)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={config.pomodoroConfig.studyMinutes}
                      onChange={(e) => updatePomodoroConfig({ studyMinutes: parseInt(e.target.value) })}
                      className="w-full p-2 border border-red-200 dark:border-red-800 rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiempo de descanso (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={config.pomodoroConfig.breakMinutes}
                      onChange={(e) => updatePomodoroConfig({ breakMinutes: parseInt(e.target.value) })}
                      className="w-full p-2 border border-red-200 dark:border-red-800 rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ciclos antes de descanso largo: {config.pomodoroConfig.cyclesBeforeLongBreak}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={config.pomodoroConfig.cyclesBeforeLongBreak}
                    onChange={(e) => updatePomodoroConfig({ cyclesBeforeLongBreak: parseInt(e.target.value) })}
                    className="w-full h-2 bg-red-200 dark:bg-red-800/50 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            
            {config.studyMode === 'exam' && config.examConfig && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" />
                  Configuración de Examen
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiempo límite (min)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={config.examConfig.timeLimit}
                      onChange={(e) => updateExamConfig({ timeLimit: parseInt(e.target.value) })}
                      className="w-full p-2 border border-amber-200 dark:border-amber-800 rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de preguntas
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={config.examConfig.questionsCount}
                      onChange={(e) => updateExamConfig({ questionsCount: parseInt(e.target.value) })}
                      className="w-full p-2 border border-amber-200 dark:border-amber-800 rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Puntaje para aprobar: {config.examConfig.passingScore}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={config.examConfig.passingScore}
                    onChange={(e) => updateExamConfig({ passingScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-amber-200 dark:bg-amber-800/50 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="showFeedback"
                    checked={config.examConfig.showFeedbackImmediately}
                    onChange={(e) => updateExamConfig({ showFeedbackImmediately: e.target.checked })}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="showFeedback" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mostrar resultado inmediatamente después de cada pregunta
                  </label>
                </div>
              </div>
            )}
            
            {config.studyMode === 'daily_challenge' && config.dailyChallengeConfig && (
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4" />
                  Configuración de Desafío Diario
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de tarjetas
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={config.dailyChallengeConfig.cardsCount}
                      onChange={(e) => updateDailyChallengeConfig({ cardsCount: parseInt(e.target.value) })}
                      className="w-full p-2 border border-green-200 dark:border-green-800 rounded-md bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dificultad
                    </label>
                    <select
                      value={config.dailyChallengeConfig.difficulty}
                      onChange={(e) => updateDailyChallengeConfig({ difficulty: e.target.value as DifficultyLevel })}
                      className="w-full p-2 border border-green-200 dark:border-green-800 rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Medio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Racha objetivo: {config.dailyChallengeConfig.targetStreak} días
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={config.dailyChallengeConfig.targetStreak}
                    onChange={(e) => updateDailyChallengeConfig({ targetStreak: parseInt(e.target.value) })}
                    className="w-full h-2 bg-green-200 dark:bg-green-800/50 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            
            {/* Continuar con las tarjetas diarias y revisiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tarjetas nuevas por día
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={config.newCardsPerDay}
                    onChange={(e) => setConfig({...config, newCardsPerDay: parseInt(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {config.newCardsPerDay}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Menos</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Más</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Repasos máximos por día
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={config.maxReviewsPerDay}
                    onChange={(e) => setConfig({...config, maxReviewsPerDay: parseInt(e.target.value)})}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {config.maxReviewsPerDay}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Menos</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Más</span>
                </div>
              </div>
            </div>
            
            {/* Selección de orden de estudio */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Orden de repaso
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  { id: 'due', label: 'Por vencimiento' },
                  { id: 'difficulty', label: 'Por dificultad' },
                  { id: 'random', label: 'Aleatorio' }
                ].map((order) => (
                  <motion.button
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSetReviewOrder(order.id as 'due' | 'difficulty' | 'random')}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                      config.reviewOrder === order.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                  >
                    <span className={`font-medium ${
                      config.reviewOrder === order.id
                        ? 'text-indigo-700 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {order.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Contenido de la pestaña avanzada */}
        {activeTab === 'advanced' && (
          <>
            {/* Selección de etiquetas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Etiquetas a incluir
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 min-h-[100px] bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                {availableTags.length > 0 ? (
                  availableTags.map(tag => (
                    <motion.button
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const tagIds = config.includeTags || [];
                        if (tagIds.includes(tag.id)) {
                          setConfig({
                            ...config,
                            includeTags: tagIds.filter(id => id !== tag.id)
                          });
                        } else {
                          setConfig({
                            ...config,
                            includeTags: [...tagIds, tag.id]
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium 
                        ${config.includeTags?.includes(tag.id) 
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-2 border-indigo-300 dark:border-indigo-700' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}
                    >
                      {tag.name}
                    </motion.button>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    No hay etiquetas disponibles
                  </p>
                )}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Selecciona las etiquetas para filtrar tarjetas específicas. Si no seleccionas ninguna, se incluirán todas.
              </p>
            </div>
            
            {/* Configuración de pasos de aprendizaje */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pasos de aprendizaje (minutos)
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {config.learningSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...config.learningSteps];
                        newSteps[index] = parseInt(e.target.value);
                        setConfig({...config, learningSteps: newSteps});
                      }}
                      className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-center"
                    />
                    {index < config.learningSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 mx-1 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Intervalos en minutos entre repasos para tarjetas en aprendizaje
              </p>
            </div>
          </>
        )}
        
        <div className="pt-6 flex justify-end space-x-3 mt-4">
          <Link
            to="/flashcards"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </Link>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onStartSession}
            className="flex items-center gap-2 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Comenzar Sesión</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyConfigScreen; 