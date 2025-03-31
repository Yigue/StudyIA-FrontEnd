import React from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, FolderOpen } from 'lucide-react';
import { Flashcard } from '../../../types';

interface FlashcardsReviewComponentProps {
  flashcard: Flashcard;
  showAnswer: boolean;
  currentIndex: number;
  totalCards: number;
  onToggleAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onUpdateDifficulty: (difficulty: number) => void;
}

const FlashcardsReviewComponent: React.FC<FlashcardsReviewComponentProps> = ({
  flashcard,
  showAnswer,
  currentIndex,
  totalCards,
  onToggleAnswer,
  onNext,
  onPrevious,
  onUpdateDifficulty,
}) => {
  // Determinar el color de dificultad
  const getDifficultyColor = (level: number): string => {
    const colors = {
      1: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      4: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      5: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  // Si no hay flashcards, mostrar un mensaje
  if (!flashcard) {
    return (
      <div className="h-96 flex items-center justify-center flex-col gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <FolderOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No hay flashcards para revisar</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Parece que no hay tarjetas disponibles para revisar en este momento. Intenta ajustar los filtros o crea nuevas flashcards.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Cabecera */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tarjeta {currentIndex + 1} de {totalCards}
        </div>
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(parseInt(flashcard.difficulty))}`}>
          Dificultad: {flashcard.difficulty}
        </div>
      </div>

      {/* Pregunta */}
      <div className="px-6 py-10 flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 text-center mb-4">
          {flashcard.question}
        </h3>
        {!showAnswer && (
          <button
            onClick={onToggleAnswer}
            className="mt-6 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md shadow-sm inline-flex items-center gap-2 transition-colors duration-150"
          >
            <Lightbulb className="w-4 h-4" />
            Mostrar Respuesta
          </button>
        )}
      </div>

      {/* Respuesta */}
      {showAnswer && (
        <div className="px-6 py-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Respuesta:</h4>
            <p className="text-gray-800 dark:text-gray-200">{flashcard.answer}</p>
          </div>

          {/* Botones de dificultad */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm">¿Qué tan difícil te resultó?</h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => onUpdateDifficulty(level)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    parseInt(flashcard.difficulty) === level
                      ? 'ring-2 ring-indigo-500 dark:ring-indigo-400'
                      : ''
                  } ${getDifficultyColor(level)}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controles de navegación */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
            currentIndex === 0
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
            currentIndex === totalCards - 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsReviewComponent;