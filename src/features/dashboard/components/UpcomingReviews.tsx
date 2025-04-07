import React, { useMemo } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { FlashcardReview } from '../types/dashboard.types';
import { Link } from '@tanstack/react-router';

interface UpcomingReviewsProps {
  reviews: FlashcardReview[];
}

export const UpcomingReviews: React.FC<UpcomingReviewsProps> = ({ reviews }) => {
  // Formatear la fecha relativa (hoy, mañana, o fecha específica)
  const formatRelativeDate = (dateString: string): string => {
    const reviewDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Comparar solo fechas (sin horas)
    const isToday = reviewDate.toDateString() === today.toDateString();
    const isTomorrow = reviewDate.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Hoy';
    if (isTomorrow) return 'Mañana';
    
    return reviewDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  // Determinar el color según la dificultad
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
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900/50">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Próximas Revisiones</h3>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {reviews.length > 0 ? (
          reviews.map((review, i) => (
            <div key={i} className="py-3 flex justify-between items-center">
              <div className="max-w-[70%]">
                <p className="text-gray-800 dark:text-gray-200 font-medium truncate mb-1" title={review.question}>
                  {review.question}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeDate(review.next_review)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(review.difficulty)}`}>
                    Dificultad {review.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No hay revisiones programadas
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Link 
          to="/flashcards" 
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-end gap-1 transition-colors"
        >
          Ver todas las flashcards
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
