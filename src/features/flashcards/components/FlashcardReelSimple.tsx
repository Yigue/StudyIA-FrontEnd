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
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">
                {new Date(flashcard.next_review).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(flashcard)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              {onDelete && (
                <button 
                  onClick={() => onDelete(flashcard)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-2 pt-3">
            <h3 className="font-medium text-gray-800 mb-1">Pregunta:</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{flashcard.question}</p>
            
            <h3 className="font-medium text-gray-800 mb-1">Respuesta:</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{flashcard.answer}</p>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                flashcard.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                flashcard.difficulty === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {flashcard.difficulty === 'easy' ? 'Fácil' :
               flashcard.difficulty === 'normal' ? 'Normal' :
               'Difícil'}
            </span>
            
            <button
              onClick={() => onEdit(flashcard)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
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