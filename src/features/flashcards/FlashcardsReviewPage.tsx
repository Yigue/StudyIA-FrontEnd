
import { BookOpen } from 'lucide-react';
import { useFlashcardsReview } from './hooks/useFlashcardsReview';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import { mockSubjects } from '../../lib/mockData';
import FlashcardsReviewComponent from './components/FlashcardsReviewComponent';



const FlashcardsReviewPage = () => {
  const {
    currentFlashcard,
    stats,
    showAnswer,
    actions
  } = useFlashcardsReview();

  return (
    <div className="p-8">
        {/* Review Area */}
        <div className="lg:col-span-2">
          {currentFlashcard ? (
            <FlashcardsReviewComponent
              flashcard={currentFlashcard}
              showAnswer={showAnswer}
              onToggleAnswer={actions.toggleAnswer}
              onNext={actions.handleNext}
              onPrevious={actions.handlePrevious}
              onUpdateDifficulty={actions.updateDifficulty}
              currentIndex={stats.current}
              totalCards={stats.filtered}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No se encontraron flashcards con los filtros actuales
              </p>
            </div>
          )}
        </div>
      
    </div>
  );
};

export default FlashcardsReviewPage;
