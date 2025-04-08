import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Settings, 
  ArrowLeft,
  Check,
  X,
  Tag
} from 'lucide-react';
import { 
  Flashcard, 
  ResponseQuality,
  StudySessionConfig,
  ReviewResult
} from '../../../../types/flashcards/flashcards';
import FlashcardPlayer from '../ui/FlashcardPlayer';

// Componente para configurar la sesión de estudio
interface StudySessionConfigScreenProps {
  defaultConfig: StudySessionConfig;
  availableTags: Array<{ id: string; name: string; color: string }>;
  onStartSession: (config: StudySessionConfig) => void;
  onCancel: () => void;
}

const StudySessionConfigScreen: React.FC<StudySessionConfigScreenProps> = ({
  defaultConfig,
  availableTags,
  onStartSession,
  onCancel
}) => {
  const [config, setConfig] = useState<StudySessionConfig>(defaultConfig);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleConfigChange = (key: keyof StudySessionConfig, value: number | string | number[]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Configurar Sesión de Estudio
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Configuración General
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Nuevas tarjetas por día
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={config.newCardsPerDay}
                onChange={(e) => handleConfigChange('newCardsPerDay', parseInt(e.target.value))}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Revisiones máximas por día
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={config.maxReviewsPerDay}
                onChange={(e) => handleConfigChange('maxReviewsPerDay', parseInt(e.target.value))}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Orden de revisión
              </label>
              <select
                value={config.reviewOrder}
                onChange={(e) => handleConfigChange('reviewOrder', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="due">Por fecha de revisión</option>
                <option value="random">Aleatorio</option>
                <option value="difficulty">Por dificultad</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Modo de estudio
              </label>
              <select
                value={config.studyMode}
                onChange={(e) => handleConfigChange('studyMode', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="standard">Estándar</option>
                <option value="hardOnly">Solo difíciles</option>
                <option value="spaced">Repetición espaciada</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Materias a Estudiar
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {availableTags.map(tag => (
              <div 
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-indigo-50 dark:bg-indigo-900 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className={`text-sm ${
                    selectedTags.includes(tag.id)
                      ? 'font-medium text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {tag.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => onStartSession(config)}
          className="px-6 py-2 bg-indigo-600 border border-indigo-600 text-white rounded-md hover:bg-indigo-700 hover:border-indigo-700 transition-colors flex items-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

// Componente para mostrar el resumen de la sesión
interface StudySessionSummaryProps {
  stats: {
    total: number;
    correct: number;
    incorrect: number;
    timeSpent: number;
  };
  onNewSession: () => void;
  onClose: () => void;
}

const StudySessionSummary: React.FC<StudySessionSummaryProps> = ({
  stats,
  onNewSession,
  onClose
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center rounded-full">
          <Brain size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          ¡Sesión Completada!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Has completado tu sesión de estudio. Tus resultados han sido guardados y las tarjetas
          han sido reprogramadas según tu rendimiento.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-left">
          <div className="text-gray-500 dark:text-gray-400">Tarjetas revisadas:</div>
          <div className="font-medium text-gray-800 dark:text-white">{stats.total}</div>
          
          <div className="text-gray-500 dark:text-gray-400">Correctas:</div>
          <div className="font-medium text-green-600 dark:text-green-400">{stats.correct}</div>
          
          <div className="text-gray-500 dark:text-gray-400">Incorrectas:</div>
          <div className="font-medium text-red-600 dark:text-red-400">{stats.incorrect}</div>
          
          <div className="text-gray-500 dark:text-gray-400">Tiempo total:</div>
          <div className="font-medium text-gray-800 dark:text-white">
            {Math.round(stats.timeSpent / 60)} minutos
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onNewSession} 
            className="flex-1 px-4 py-2 border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            Nueva Sesión
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Terminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Tipo para el estado de la sesión
type StudySessionState = 'config' | 'study' | 'complete';

// Componente principal de sesión de estudio
interface StudySessionProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  availableTags: Array<{ id: string; name: string; color: string }>;
  onComplete: (results: { total: number; correct: number; incorrect: number; timeSpent: number }) => void;
  onClose: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({
  flashcards,
  isLoading,
  availableTags,
  onComplete,
  onClose
}) => {
  // Estado de la sesión
  const [sessionState, setSessionState] = useState<StudySessionState>('config');
  const [currentConfig, setCurrentConfig] = useState<StudySessionConfig>({
    duration: 30,      // Duración en minutos
    cardLimit: 20,     // Límite de tarjetas a estudiar
    difficulty: [],    // Sin filtro de dificultad
    tagIds: [],        // Sin filtro de tags
    randomize: true,   // Aleatorizar tarjetas
    // Propiedades adicionales
    newCardsPerDay: 20,
    maxReviewsPerDay: 100,
    learningSteps: [1, 10, 60, 360],
    reviewOrder: 'due',
    studyMode: 'standard'
  });
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    timeSpent: 0
  });
  
  // Iniciar stats al comenzar la sesión
  useEffect(() => {
    if (sessionState === 'study') {
      setSessionStats({
        total: flashcards.length,
        correct: 0,
        incorrect: 0,
        timeSpent: 0
      });
    }
  }, [sessionState, flashcards.length]);
  
  // Manejadores de eventos
  const handleStartSession = (config: StudySessionConfig) => {
    setCurrentConfig(config);
    setSessionState('study');
  };
  
  const handleCompleteSession = () => {
    onComplete(sessionStats);
    setSessionState('complete');
  };
  
  const handleCardReviewed = (result: { 
    flashcardId: string;
    correct: boolean;
    responseQuality: ReviewResult;
    timeTaken: number;
  }) => {
    // Actualizar estadísticas locales
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (result.correct ? 1 : 0),
      incorrect: prev.incorrect + (result.correct ? 0 : 1),
      timeSpent: prev.timeSpent + result.timeTaken
    }));
  };
  
  const handleBackToConfig = () => {
    setSessionState('config');
  };
  
  // Renderizar contenido según el estado de la sesión
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }
  
  // Si no hay tarjetas para estudiar
  if (flashcards.length === 0 && sessionState === 'config') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sesión de Estudio
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            ¡No hay tarjetas para estudiar!
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            En este momento no tienes tarjetas pendientes para revisar. Puedes crear nuevas tarjetas
            o esperar a que las tarjetas existentes estén listas para revisión.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {sessionState === 'config' && (
        <StudySessionConfigScreen
          defaultConfig={currentConfig}
          availableTags={availableTags}
          onStartSession={handleStartSession}
          onCancel={onClose}
        />
      )}
      
      {sessionState === 'study' && (
        <FlashcardPlayer
          cards={flashcards}
          onComplete={handleCompleteSession}
          onCardReviewed={handleCardReviewed}
          onClose={handleBackToConfig}
        />
      )}
      
      {sessionState === 'complete' && (
        <StudySessionSummary
          stats={sessionStats}
          onNewSession={handleBackToConfig}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default StudySession; 