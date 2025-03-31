import React, { useState } from 'react';
import { LayoutGrid, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Flashcard } from '../../../types';

interface FlashcardReviewProps {
  flashcard?: Flashcard | null;
  flashcards?: Flashcard[];
  totalFlashcards?: number;
  currentIndex?: number;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  onUpdateDifficulty?: (difficulty: number) => void;
  onDifficultyChange?: (flashcardId: string, difficulty: number) => Promise<void>;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  flashcard: propFlashcard,
  flashcards = [],
  totalFlashcards: propTotalFlashcards,
  currentIndex: propCurrentIndex = 0,
  showAnswer: propShowAnswer,
  onToggleAnswer,
  onUpdateDifficulty,
  onDifficultyChange,
}) => {
  // Estados locales para modo de array de flashcards
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Determinar el modo: flashcard individual o array
  const isArrayMode = flashcards.length > 0;
  
  // Obtener flashcard actual según el modo
  const flashcard = isArrayMode 
    ? flashcards[currentIndex] 
    : propFlashcard;
    
  // Total de flashcards
  const totalFlashcards = isArrayMode 
    ? flashcards.length 
    : propTotalFlashcards || 1;
    
  // Usar estado local o props para showAnswer
  const isShowingAnswer = isArrayMode 
    ? showAnswer 
    : propShowAnswer;
    
  // Manejadores de eventos
  const handleToggleAnswer = () => {
    if (isArrayMode) {
      setShowAnswer(true);
    } else if (onToggleAnswer) {
      onToggleAnswer();
    }
  };
  
  const handleUpdateDifficulty = (difficulty: number) => {
    if (isArrayMode && flashcard && onDifficultyChange) {
      onDifficultyChange(flashcard.id, difficulty)
        .then(() => {
          if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
          }
        })
        .catch(err => console.error('Error al actualizar flashcard:', err));
    } else if (onUpdateDifficulty) {
      onUpdateDifficulty(difficulty);
    }
  };
  
  const navigateToNextCard = () => {
    if (currentIndex < totalFlashcards - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };
  
  const navigateToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };
  
  if (!flashcard) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400">No hay flashcards disponibles para revisar</p>
      </div>
    );
  }
  
  // Índice actual para mostrar
  const displayIndex = isArrayMode ? currentIndex : propCurrentIndex;
  
  // Helper para obtener el color según dificultad
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) {
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        hover: 'hover:bg-green-200 dark:hover:bg-green-900/50',
        text: 'text-green-600 dark:text-green-400'
      };
    } else if (difficulty === 3) {
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
        text: 'text-yellow-600 dark:text-yellow-400'
      };
    } else {
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        hover: 'hover:bg-red-200 dark:hover:bg-red-900/50',
        text: 'text-red-600 dark:text-red-400'
      };
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Flashcards ({displayIndex + 1} de {totalFlashcards})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Próxima revisión: {new Date(flashcard.lastReviewed || flashcard.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {isArrayMode && (
        <div className="flex justify-between mb-4">
          <button 
            onClick={navigateToPrevCard}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg ${
              currentIndex === 0 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={navigateToNextCard}
            disabled={currentIndex === totalFlashcards - 1}
            className={`p-2 rounded-lg ${
              currentIndex === totalFlashcards - 1 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-4">
        <p className="font-medium text-gray-800 dark:text-gray-100 mb-4">{flashcard.question}</p>
        {isShowingAnswer ? (
          <p className="text-gray-600 dark:text-gray-300">{flashcard.answer}</p>
        ) : (
          <button
            onClick={handleToggleAnswer}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Mostrar respuesta
          </button>
        )}
      </div>

      {isShowingAnswer && (
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((difficulty) => {
            const colors = getDifficultyColor(difficulty);
            return (
              <button
                key={difficulty}
                onClick={() => handleUpdateDifficulty(difficulty)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`p-3 rounded-lg transition-colors ${colors.bg} ${colors.hover}`}>
                  <Star className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {difficulty === 1 ? 'Muy Fácil' :
                  difficulty === 2 ? 'Fácil' :
                  difficulty === 3 ? 'Normal' :
                  difficulty === 4 ? 'Difícil' :
                  'Muy Difícil'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
