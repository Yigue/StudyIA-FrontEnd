import React from 'react';
import { BookOpen, Star, ArrowLeft, ArrowRight } from 'lucide-react';
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
  onUpdateDifficulty
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Repaso de Flashcards
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {totalCards}
          </span>
          <button
            onClick={onNext}
            disabled={currentIndex === totalCards - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="font-medium text-gray-800 mb-4">{flashcard.question}</p>
        {showAnswer ? (
          <p className="text-gray-600">{flashcard.answer}</p>
        ) : (
          <button
            onClick={onToggleAnswer}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Mostrar respuesta
          </button>
        )}
      </div>

      {showAnswer && (
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => onUpdateDifficulty(difficulty)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`p-3 rounded-lg transition-colors ${
                  difficulty <= 2
                    ? "bg-green-100 hover:bg-green-200"
                    : difficulty === 3
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "bg-red-100 hover:bg-red-200"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    difficulty <= 2
                      ? "text-green-600"
                      : difficulty === 3
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">
                {difficulty === 1
                  ? "Muy Fácil"
                  : difficulty === 2
                  ? "Fácil"
                  : difficulty === 3
                  ? "Normal"
                  : difficulty === 4
                  ? "Difícil"
                  : "Muy Difícil"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsReviewComponent;