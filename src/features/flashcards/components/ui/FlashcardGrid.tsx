import React from 'react';
import { Edit, Trash, Clock } from 'lucide-react';
import { Flashcard } from '../../../../types/flashcards/flashcards';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onEdit: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  onSelect?: (flashcard: Flashcard) => void;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  onEdit,
  onDelete,
  onSelect
}) => {
  if (flashcards.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No se encontraron flashcards con los filtros actuales
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {flashcards.map(flashcard => (
        <div 
          key={flashcard.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          onClick={() => onSelect && onSelect(flashcard)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {flashcard.next_review ? 
                  new Date(flashcard.next_review).toLocaleDateString()
                  : flashcard.lastReviewed || flashcard.last_reviewed
                    ? `Revisada: ${new Date(flashcard.lastReviewed || flashcard.last_reviewed).toLocaleDateString()}`
                    : 'Nueva'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              {onDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(flashcard);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Trash className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-3">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Pregunta:</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{flashcard.question}</p>
            
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Respuesta:</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{flashcard.answer}</p>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                getDifficultyStyle(flashcard.difficulty)
              }`}
            >
              {getDifficultyLabel(flashcard.difficulty)}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(flashcard);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Ver detalles
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Función auxiliar para obtener el estilo según dificultad
function getDifficultyStyle(difficulty: string | number): string {
  // Si es número
  if (typeof difficulty === 'number' || !isNaN(Number(difficulty))) {
    const diffValue = Number(difficulty);
    if (diffValue <= 2) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (diffValue <= 3) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
  }
  
  // Si es string
  switch(difficulty.toLowerCase()) {
    case 'easy':
    case 'fácil':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    case 'normal':
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    case 'hard':
    case 'difícil':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
}

// Función auxiliar para obtener la etiqueta de dificultad
function getDifficultyLabel(difficulty: string | number): string {
  // Si es número
  if (typeof difficulty === 'number' || !isNaN(Number(difficulty))) {
    const diffValue = Number(difficulty);
    if (diffValue <= 2) return 'Fácil';
    if (diffValue <= 3) return 'Normal';
    return 'Difícil';
  }
  
  // Si es string
  switch(difficulty.toLowerCase()) {
    case 'easy':
      return 'Fácil';
    case 'normal':
    case 'medium':
      return 'Normal';
    case 'hard':
      return 'Difícil';
    default:
      return difficulty;
  }
}

export default FlashcardGrid; 