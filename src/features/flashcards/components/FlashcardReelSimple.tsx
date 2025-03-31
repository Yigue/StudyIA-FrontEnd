import React from 'react';
import { Edit, Trash, Clock } from 'lucide-react';
import { Flashcard } from '../../../types';

interface FlashcardReelProps {
  flashcards: Flashcard[];
  onEdit: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
}

const FlashcardReelSimple: React.FC<FlashcardReelProps> = ({ 
  flashcards, 
  onEdit,
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {flashcards.map(flashcard => (
        <div 
          key={flashcard.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(flashcard.next_review).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(flashcard)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              {onDelete && (
                <button 
                  onClick={() => onDelete(flashcard)}
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
                flashcard.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                flashcard.difficulty === 'normal' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {flashcard.difficulty === 'easy' ? 'Fácil' :
               flashcard.difficulty === 'normal' ? 'Normal' :
               'Difícil'}
            </span>
            
            <button
              onClick={() => onEdit(flashcard)}
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

export default FlashcardReelSimple;