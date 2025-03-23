import React, { useState } from 'react';
import { Calendar, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FlashcardReview } from '../types/dashboard.types';

interface UpcomingReviewsProps {
  reviews: FlashcardReview[];
}

export const UpcomingReviews: React.FC<UpcomingReviewsProps> = ({ reviews }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Formatear la fecha de revisión
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const isToday = new Date().toDateString() === date.toDateString();
    const isTomorrow = new Date(Date.now() + 86400000).toDateString() === date.toDateString();
    
    if (isToday) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Mañana, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Obtener color y etiqueta según la dificultad
  const getDifficultyInfo = (difficulty: number) => {
    if (difficulty <= 2) {
      return { color: 'bg-green-100 text-green-700', label: 'Fácil' };
    } else if (difficulty === 3) {
      return { color: 'bg-yellow-100 text-yellow-700', label: 'Normal' };
    } else {
      return { color: 'bg-red-100 text-red-700', label: 'Difícil' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-indigo-100">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Próximas Revisiones</h3>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => {
            const { color, label } = getDifficultyInfo(review.difficulty);
            const isExpanded = expandedIndex === index;
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  isExpanded ? 'bg-indigo-50' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{review.question}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatReviewDate(review.next_review)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                      {label}
                    </div>
                    <ArrowRight className={`w-4 h-4 text-gray-500 transition-all duration-300 ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 p-3 bg-white rounded border border-indigo-100 shadow-sm animate-fadeIn">
                    <div className="flex gap-3 justify-end mt-2">
                      <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Fácil</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Difícil</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">No hay revisiones pendientes</p>
            <p className="text-sm text-gray-500">Crea flashcards para empezar a estudiar</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
