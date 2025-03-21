import { LayoutGrid, Clock, Star } from 'lucide-react';
import { Flashcard } from '../../../types';


interface FlashcardReviewProps {
  flashcard: Flashcard;
  totalFlashcards: number;
  currentIndex: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onUpdateDifficulty: (difficulty: number) => void;
}

export const FlashcardReview = ({
  flashcard,
  totalFlashcards,
  currentIndex,
  showAnswer,
  onToggleAnswer,
  onUpdateDifficulty,
}: FlashcardReviewProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <LayoutGrid className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Flashcards ({currentIndex + 1} de {totalFlashcards})
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">
          Próxima revisión: {new Date(flashcard.next_review).toLocaleDateString()}
        </span>
      </div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-4">
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
            <div className={`p-3 rounded-lg transition-colors ${
              difficulty <= 2
                ? 'bg-green-100 hover:bg-green-200'
                : difficulty === 3
                ? 'bg-yellow-100 hover:bg-yellow-200'
                : 'bg-red-100 hover:bg-red-200'
            }`}>
              <Star className={`w-6 h-6 ${
                difficulty <= 2
                  ? 'text-green-600'
                  : difficulty === 3
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`} />
            </div>
            <span className="text-sm text-gray-600">
              {difficulty === 1 ? 'Muy Fácil' :
               difficulty === 2 ? 'Fácil' :
               difficulty === 3 ? 'Normal' :
               difficulty === 4 ? 'Difícil' :
               'Muy Difícil'}
            </span>
          </button>
        ))}
      </div>
    )}
  </div>
);
