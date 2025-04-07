import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Brain, ArrowLeft, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import StudySessionConfigScreen from '../../components/flashcards/StudySessionConfig';
import FlashcardPlayer from '../../components/flashcards/FlashcardPlayer';
import { 
  StudySessionConfig, 
  FlashcardWithSpacedRepetition,
  ResponseQuality,
  SpacedRepetitionState
} from '../../types/flashcards/spaced-repetition';
import { useStudyFlashcards } from '../../hooks/queries/useFlashcardsQuery';
import { Tag } from '../../types/common';

// Datos de ejemplo (en una aplicación real, vendrían de una API)
const mockAvailableTags: Tag[] = [
  { id: 'math', name: 'Matemáticas', color: '#4F46E5' },
  { id: 'history', name: 'Historia', color: '#DC2626' },
  { id: 'science', name: 'Ciencias', color: '#16A34A' },
  { id: 'languages', name: 'Idiomas', color: '#F59E0B' },
  { id: 'programming', name: 'Programación', color: '#8B5CF6' },
  { id: 'geography', name: 'Geografía', color: '#0EA5E9' },
  { id: 'literature', name: 'Literatura', color: '#EC4899' },
  { id: 'physics', name: 'Física', color: '#10B981' },
  { id: 'chemistry', name: 'Química', color: '#6366F1' },
  { id: 'biology', name: 'Biología', color: '#84CC16' }
];

// Ejemplo de configuración inicial
const defaultConfig: StudySessionConfig = {
  newCardsPerDay: 20,
  maxReviewsPerDay: 100,
  learningSteps: [1, 10, 60, 360],
  reviewOrder: 'due',
  studyMode: 'standard'
};

type StudySessionState = 'config' | 'study' | 'complete';

const StudySessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionState, setSessionState] = useState<StudySessionState>('config');
  const [currentConfig, setCurrentConfig] = useState<StudySessionConfig>(defaultConfig);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    timeSpent: 0
  });
  
  // Obtener datos de flashcards para estudio
  const { data: flashcards = [], isLoading } = useStudyFlashcards();
  
  // Convertir al formato necesario para el FlashcardPlayer
  const flashcardsWithSpacing: FlashcardWithSpacedRepetition[] = React.useMemo(() => {
    return flashcards.map(card => {
      // Crear un objeto de estado de repetición espaciada por defecto
      const spacedRepetition: SpacedRepetitionState = {
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date(),
        knowledgeLevel: 0,
        streak: 0
      };
      
      return {
        id: card.id,
        materialId: card.material?.id || '',
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        lastReviewed: card.lastReviewed,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        spacedRepetition
      };
    });
  }, [flashcards]);
  
  // Iniciar stats al comenzar la sesión
  useEffect(() => {
    if (sessionState === 'study') {
      setSessionStats({
        total: flashcardsWithSpacing.length,
        correct: 0,
        incorrect: 0,
        timeSpent: 0
      });
    }
  }, [sessionState, flashcardsWithSpacing.length]);
  
  const handleStartSession = (config: StudySessionConfig) => {
    setCurrentConfig(config);
    setSessionState('study');
  };
  
  const handleCompleteSession = () => {
    setSessionState('complete');
  };
  
  const handleCardReviewed = (result: { 
    flashcardId: string;
    correct: boolean;
    responseQuality: ResponseQuality;
    timeTaken: number;
  }) => {
    // Actualizar estadísticas locales
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (result.correct ? 1 : 0),
      incorrect: prev.incorrect + (result.correct ? 0 : 1),
      timeSpent: prev.timeSpent + result.timeTaken
    }));
    
    // En una implementación real, también enviaríamos los resultados al servidor
    console.log('Tarjeta revisada:', result);
  };
  
  const handleBackToConfig = () => {
    setSessionState('config');
  };
  
  const handleBackToHome = () => {
    navigate({ to: '/flashcards' });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }
  
  // Si no hay tarjetas para estudiar
  if (flashcardsWithSpacing.length === 0 && sessionState === 'config') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sesión de Estudio
          </h1>
        </div>
        
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Info className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
            <Button variant="outline" onClick={handleBackToHome}>
              Volver al Inicio
            </Button>
            <Button onClick={() => navigate({ to: '/flashcards/dashboard' })}>
              Crear Tarjetas
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {sessionState === 'config' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToHome}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sesión de Estudio
            </h1>
          </div>
          
          <Card className="overflow-hidden p-0">
            <StudySessionConfigScreen
              defaultConfig={currentConfig}
              availableTags={mockAvailableTags}
              onStartSession={handleStartSession}
              onCancel={handleBackToHome}
            />
          </Card>
        </>
      )}
      
      {sessionState === 'study' && (
        <FlashcardPlayer
          cards={flashcardsWithSpacing}
          onComplete={handleCompleteSession}
          onCardReviewed={handleCardReviewed}
          onClose={handleBackToConfig}
        />
      )}
      
      {sessionState === 'complete' && (
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
              <div className="font-medium text-gray-800 dark:text-white">{sessionStats.total}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Correctas:</div>
              <div className="font-medium text-green-600 dark:text-green-400">{sessionStats.correct}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Incorrectas:</div>
              <div className="font-medium text-red-600 dark:text-red-400">{sessionStats.incorrect}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Tiempo total:</div>
              <div className="font-medium text-gray-800 dark:text-white">
                {Math.round(sessionStats.timeSpent / 60)} minutos
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBackToConfig} className="flex-1">
                Nueva Sesión
              </Button>
              <Button variant="default" onClick={handleBackToHome} className="flex-1">
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionPage; 