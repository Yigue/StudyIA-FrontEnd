import { Calendar } from 'lucide-react';
import { FlashcardReview } from '../types/dashboard.types';

interface UpcomingReviewsProps {
  reviews: FlashcardReview[];
}

export const UpcomingReviews = ({ reviews }: UpcomingReviewsProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Calendar className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Próximas Revisiones</h3>
      </div>
    </div>

    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{review.question}</p>
              <p className="text-sm text-gray-600">
                {new Date(review.next_review).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              review.difficulty <= 2 ? 'bg-green-100 text-green-700' :
              review.difficulty === 3 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {review.difficulty <= 2 ? 'Fácil' :
               review.difficulty === 3 ? 'Normal' :
               'Difícil'}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No hay revisiones pendientes</p>
      )}
    </div>
  </div>
);
