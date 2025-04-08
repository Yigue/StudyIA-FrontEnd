import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Trophy, 
  Clock, 
  Timer,
  Bell
} from 'lucide-react';
import { useFlashcards } from '../../../hooks/useFlashcards';
import { useTags } from '../../../hooks/useTags';
import { FlashcardViewState } from '../../../types/flashcards/ui';
import { ResponseQuality, StudySessionConfig } from '../../../types/flashcards/spaced-repetition';
import confetti from 'canvas-confetti';

// Componentes
import StudyConfigScreen from '../components/study-session/config/StudyConfigScreen';
import FlashcardPlayer from '../components/study-session/study/FlashcardPlayer';
import CompletionSummary from '../components/study-session/summary/CompletionSummary';

// Estados de la sesión de estudio
type StudySessionState = 'config' | 'study' | 'break' | 'complete';

// Estado para estadísticas de estudio
interface StudyStats {
  total: number;
  correct: number;
  incorrect: number;
  timeSpent: number;
  currentStreak: number;
  bestStreak: number;
  cardsCompleted: number;
}

const StudySessionPage: React.FC = () => {
  // Obtener parámetros de URL
  const searchParams = new URLSearchParams(window.location.search);
  const modeFromUrl = searchParams.get('mode') as StudySessionConfig['studyMode'] | null;
  
  // Estados
  const [sessionState, setSessionState] = useState<StudySessionState>('config');
  const [flashcardState, setFlashcardState] = useState<FlashcardViewState>(FlashcardViewState.Question);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [config, setConfig] = useState<StudySessionConfig>({
    newCardsPerDay: 10,
    maxReviewsPerDay: 50,
    learningSteps: [1, 10, 60, 360],
    reviewOrder: 'due',
    studyMode: modeFromUrl || 'standard',
    includeTags: [],
    excludeTags: [],
  });
  const [stats, setStats] = useState<StudyStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
    timeSpent: 0,
    currentStreak: 0,
    bestStreak: 0,
    cardsCompleted: 0
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Estados para Pomodoro
  const [pomodoroState, setPomodoroState] = useState<'study' | 'break' | 'longBreak'>('study');
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState<number>(0);
  const [pomodoroCompletedCycles, setPomodoroCompletedCycles] = useState<number>(0);
  
  // Estados para Examen
  const [examTimeLeft, setExamTimeLeft] = useState<number>(0);
  const [examScore, setExamScore] = useState<number>(0);
  const [examPassed, setExamPassed] = useState<boolean>(false);
  
  // Estados para Desafío Diario
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [dailyGoalReached, setDailyGoalReached] = useState<boolean>(false);
  
  // Referencias para temporizadores
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Obtener datos
  const { flashcards, getStudyFlashcards, reviewFlashcard } = useFlashcards();
  const { tags } = useTags();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      await getStudyFlashcards();
      if (sessionState === 'study' && flashcards && flashcards.length > 0) {
        setStartTime(new Date());
      }
    };
    
    fetchData();
  }, [getStudyFlashcards, sessionState]);

  // Actualizar estadísticas cuando cambian las flashcards
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setStats(prev => ({
        ...prev,
        total: flashcards.length
      }));
    }
  }, [flashcards]);
  
  // Gestionar temporizador para los modos Pomodoro y Examen
  useEffect(() => {
    if (sessionState === 'study' && config.studyMode === 'pomodoro' && config.pomodoroConfig) {
      // Iniciar temporizador Pomodoro
      if (pomodoroState === 'study') {
        setPomodoroTimeLeft(config.pomodoroConfig.studyMinutes * 60);
      } else if (pomodoroState === 'break') {
        setPomodoroTimeLeft(config.pomodoroConfig.breakMinutes * 60);
      } else if (pomodoroState === 'longBreak') {
        setPomodoroTimeLeft(config.pomodoroConfig.longBreakMinutes * 60);
      }
    } else if (sessionState === 'study' && config.studyMode === 'exam' && config.examConfig) {
      // Iniciar temporizador Examen
      setExamTimeLeft(config.examConfig.timeLimit * 60);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionState, config.studyMode, pomodoroState]);
  
  // Iniciar temporizador global
  useEffect(() => {
    if (sessionState === 'study') {
      timerRef.current = setInterval(() => {
        // Actualizar tiempo de estudio para todos los modos
        setStats(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1
        }));
        
        // Modo Pomodoro: decrementar tiempo y cambiar estado si es necesario
        if (config.studyMode === 'pomodoro' && pomodoroTimeLeft > 0) {
          setPomodoroTimeLeft(prev => {
            if (prev <= 1) {
              // Tiempo agotado, cambiar de estado
              handlePomodoroStateChange();
              return 0;
            }
            return prev - 1;
          });
        }
        
        // Modo Examen: decrementar tiempo y finalizar si es necesario
        if (config.studyMode === 'exam' && examTimeLeft > 0) {
          setExamTimeLeft(prev => {
            if (prev <= 1) {
              // Tiempo agotado, finalizar examen
              handleCompleteSession();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionState, pomodoroTimeLeft, examTimeLeft, config.studyMode]);

  // Configurar valores predeterminados según el modo
  useEffect(() => {
    if (modeFromUrl && sessionState === 'config') {
      const updatedConfig = { ...config, studyMode: modeFromUrl };
      
      switch (modeFromUrl) {
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
            difficulty: 'medium',
            targetStreak: 7
          };
          break;
      }
      
      setConfig(updatedConfig);
    }
  }, [modeFromUrl]);

  // Tarjeta actual
  const currentCard = flashcards && flashcards.length > 0 ? 
    flashcards[currentIndex] : null;

  // Manejadores
  const handleStartSession = () => {
    setSessionState('study');
    setStartTime(new Date());
    
    // Inicializar estado según el modo de estudio
    if (config.studyMode === 'pomodoro' && config.pomodoroConfig) {
      setPomodoroState('study');
      setPomodoroTimeLeft(config.pomodoroConfig.studyMinutes * 60);
      setPomodoroCompletedCycles(0);
    } else if (config.studyMode === 'exam' && config.examConfig) {
      setExamTimeLeft(config.examConfig.timeLimit * 60);
      setExamScore(0);
    } else if (config.studyMode === 'daily_challenge' && config.dailyChallengeConfig) {
      setDailyStreak(0);
      setDailyGoalReached(false);
    }
  };

  const handleShowAnswer = () => {
    setFlashcardState(FlashcardViewState.Answer);
  };
  
  const handlePomodoroStateChange = () => {
    playNotificationSound();
    
    if (!config.pomodoroConfig) return;
    
    if (pomodoroState === 'study') {
      // Finalizar periodo de estudio
      const newCompletedCycles = pomodoroCompletedCycles + 1;
      setPomodoroCompletedCycles(newCompletedCycles);
      
      // Verificar si toca descanso largo
      if (newCompletedCycles % config.pomodoroConfig.cyclesBeforeLongBreak === 0) {
        setPomodoroState('longBreak');
        setPomodoroTimeLeft(config.pomodoroConfig.longBreakMinutes * 60);
      } else {
        setPomodoroState('break');
        setPomodoroTimeLeft(config.pomodoroConfig.breakMinutes * 60);
      }
      
      // Cambiar el estado de la sesión
      setSessionState('break');
    } else {
      // Finalizar descanso (corto o largo)
      setPomodoroState('study');
      setPomodoroTimeLeft(config.pomodoroConfig.studyMinutes * 60);
      setSessionState('study');
    }
  };
  
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play();
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
    }
  };

  const handleCardResponse = async (quality: ResponseQuality) => {
    if (!currentCard) return;

    const endTime = new Date();
    const startTimeValue = startTime || endTime;
    const timeSpent = Math.floor((endTime.getTime() - startTimeValue.getTime()) / 1000);
    
    const isCorrect = quality >= ResponseQuality.Easy; // 4 (Easy) o superior se considera correcto
    
    // Feedback visual
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    // Si fue correcto y el streak actual es 5 o 10, mostrar confetti
    if (isCorrect && (stats.currentStreak + 1) % 5 === 0) {
      triggerConfetti();
    }
    
    // Actualizar estadísticas
    setStats(prev => {
      const newStats = {
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        timeSpent: prev.timeSpent + timeSpent,
        currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
        bestStreak: isCorrect ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
        cardsCompleted: prev.cardsCompleted + 1
      };
      return newStats;
    });
    
    // Actualizar según el modo de estudio
    if (config.studyMode === 'exam' && config.examConfig) {
      const points = isCorrect ? 1 : 0;
      const newScore = examScore + points;
      setExamScore(newScore);
      
      // Calcular si pasó el examen (solo si está por finalizar)
      if (currentIndex >= flashcards.length - 1) {
        const percentage = Math.round((newScore / flashcards.length) * 100);
        setExamPassed(percentage >= config.examConfig.passingScore);
      }
    } else if (config.studyMode === 'daily_challenge' && config.dailyChallengeConfig) {
      if (isCorrect) {
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        
        // Verificar si alcanzó la meta de racha
        if (newStreak >= config.dailyChallengeConfig.targetStreak) {
          setDailyGoalReached(true);
          triggerConfetti();
        }
      } else {
        setDailyStreak(0); // Reiniciar racha en caso de error
      }
    }
    
    // Enviar resultado al servidor
    try {
      await reviewFlashcard(currentCard.id, {
        rating: quality,
        notes: isCorrect ? "Respuesta correcta" : "Necesita repaso"
      });
    } catch (error) {
      console.error("Error al guardar revisión:", error);
    }
    
    // Mostrar feedback y luego avanzar a la siguiente tarjeta
    setTimeout(() => {
      setShowFeedback(false);
      
      // Avanzar a la siguiente tarjeta o finalizar la sesión
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setFlashcardState(FlashcardViewState.Question);
        setStartTime(new Date());
      } else {
        // Finalizar la sesión si es la última tarjeta
        handleCompleteSession();
      }
    }, 1500);
  };

  const handleCompleteSession = () => {
    setSessionState('complete');
    
    // Limpiar cualquier temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleBackToConfig = () => {
    setSessionState('config');
    setCurrentIndex(0);
    setFlashcardState(FlashcardViewState.Question);
    setStats({
      total: 0,
      correct: 0,
      incorrect: 0,
      timeSpent: 0,
      currentStreak: 0,
      bestStreak: 0,
      cardsCompleted: 0
    });
    
    // Reiniciar estados específicos de los modos
    setPomodoroState('study');
    setPomodoroCompletedCycles(0);
    setExamScore(0);
    setExamPassed(false);
    setDailyStreak(0);
    setDailyGoalReached(false);
  };

  // Funciones auxiliares
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const getProgressPercentage = () => {
    if (!flashcards || flashcards.length === 0) return 0;
    return Math.round((stats.cardsCompleted / flashcards.length) * 100);
  };
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Mapear etiquetas para filtros
  const availableTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color || 'indigo'
  }));

  // Renderizado condicional basado en el estado de la sesión
  const renderContent = () => {
    switch (sessionState) {
      case 'config':
        return (
          <StudyConfigScreen 
            config={config}
            setConfig={setConfig}
            availableTags={availableTags}
            onStartSession={handleStartSession}
          />
        );
      case 'study':
        return (
          <div>
            {/* Información adicional según el modo de estudio */}
            {config.studyMode === 'pomodoro' && (
              <div className="mb-4 flex items-center justify-center p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <Timer className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-red-700 dark:text-red-400">
                  Tiempo restante: {formatTime(pomodoroTimeLeft)} | Ciclo: {pomodoroCompletedCycles + 1}
                </span>
              </div>
            )}
            
            {config.studyMode === 'exam' && (
              <div className="mb-4 flex items-center justify-center p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500 mr-2" />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Tiempo restante: {formatTime(examTimeLeft)} | Puntuación: {examScore}/{flashcards?.length || 0}
                </span>
              </div>
            )}
            
            {config.studyMode === 'daily_challenge' && (
              <div className="mb-4 flex items-center justify-center p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <Trophy className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium text-green-700 dark:text-green-400">
                  Racha actual: {dailyStreak}/{config.dailyChallengeConfig?.targetStreak || 0} | 
                  {dailyGoalReached ? ' ¡Meta alcanzada!' : ' Meta pendiente'}
                </span>
              </div>
            )}
            
            <FlashcardPlayer
              currentCard={currentCard}
              flashcardState={flashcardState}
              stats={stats}
              currentIndex={currentIndex}
              totalCards={flashcards?.length || 0}
              timeSpent={stats.timeSpent}
              showFeedback={showFeedback}
              feedbackType={feedbackType}
              onShowAnswer={handleShowAnswer}
              onCardResponse={handleCardResponse}
              getProgressPercentage={getProgressPercentage}
              formatTime={formatTime}
            />
          </div>
        );
      case 'break':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-lg max-w-lg mx-auto text-center"
          >
            <Bell className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">
              Tiempo de Descanso
            </h2>
            <p className="text-blue-600 dark:text-blue-400 mb-6">
              {pomodoroState === 'longBreak' ? 'Descanso largo' : 'Descanso corto'}
            </p>
            
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-6">
              {formatTime(pomodoroTimeLeft)}
            </div>
            
            <div className="relative h-4 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-500"
                initial={{ width: '100%' }}
                animate={{ 
                  width: `${pomodoroTimeLeft / (pomodoroState === 'longBreak' 
                    ? (config.pomodoroConfig?.longBreakMinutes || 15) * 60 
                    : (config.pomodoroConfig?.breakMinutes || 5) * 60) * 100}%` 
                }}
                transition={{ duration: 1 }}
              />
            </div>
            
            <div className="mb-4 text-blue-600 dark:text-blue-400">
              <p>Aprovecha para estirarte, hidratarte o descansar la vista.</p>
              <p className="text-sm mt-2">La sesión continuará automáticamente.</p>
            </div>
            
            <button
              onClick={handlePomodoroStateChange}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
            >
              Omitir descanso
            </button>
          </motion.div>
        );
      case 'complete':
        return (
          <CompletionSummary
            stats={stats}
            formatTime={formatTime}
            onNewSession={handleBackToConfig}
            studyMode={config.studyMode}
            examPassed={examPassed}
            examScore={examScore}
            examPassingScore={config.examConfig?.passingScore}
            dailyGoalReached={dailyGoalReached}
            dailyStreak={dailyStreak}
            dailyTargetStreak={config.dailyChallengeConfig?.targetStreak}
            totalCards={flashcards?.length || 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      {sessionState !== 'config' && (
        <div className="flex items-center mb-4">
          <button
            onClick={handleBackToConfig}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Volver a Configuración</span>
          </button>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default StudySessionPage; 