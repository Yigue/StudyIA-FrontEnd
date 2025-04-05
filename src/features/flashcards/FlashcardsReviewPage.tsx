import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useTags } from '../../hooks/useTags';
import FlashcardsReviewComponent from './components/FlashcardsReviewComponent';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import { FlashcardFilters, FlashcardStats } from './types/flashcards.types';

const FlashcardsReviewPage = () => {
  // Estado de la UI
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FlashcardFilters>({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });

  // Obtener datos de los hooks centralizados
  const { 
    flashcards, 
    getStudyFlashcards, 
    reviewFlashcard,
    loading 
  } = useFlashcards();
  
  const { tags } = useTags();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getStudyFlashcards();
  }, [getStudyFlashcards]);

  // Filtrar flashcards basados en búsqueda
  const filteredFlashcards = useMemo(() => {
    if (!flashcards) return [];
    
    let filtered = [...flashcards];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de estado
    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(card => {
        const reviewDate = card.lastReviewed ? new Date(card.lastReviewed) : null;
        switch (filters.status) {
          case 'pending':
            return reviewDate === null || (reviewDate && reviewDate > now);
          case 'due':
            return reviewDate !== null && reviewDate <= now;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [flashcards, searchTerm, filters]);

  // Resetear el índice cuando cambian los filtros
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [filteredFlashcards]);

  // Stats para mostrar en el panel de estadísticas
  const stats: FlashcardStats = {
    total: flashcards?.length || 0,
    filtered: filteredFlashcards.length,
    current: currentIndex + 1
  };

  // Obtener la flashcard actual
  const currentFlashcard = filteredFlashcards.length > 0 ? filteredFlashcards[currentIndex] : null;

  // Manejadores de eventos
  const handleToggleAnswer = () => setShowAnswer(true);

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateDifficulty = async (difficulty: number) => {
    if (!currentFlashcard) return;
    
    try {
      await reviewFlashcard(currentFlashcard.id, {
        rating: difficulty,
        notes: ""
      });
      handleNext();
    } catch (error) {
      console.error('Error al actualizar flashcard:', error);
    }
  };

  // Mapear etiquetas para el selector de materias
  const subjects = tags.map(tag => ({
    id: tag.id,
    name: tag.name
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Repaso de Flashcards
        </h2>
        <Link 
          to="/flashcards/explorador"
          className="btn-primary flex items-center gap-2"
        >
          <Grid className="w-5 h-5" />
          Explorar Flashcards
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel lateral con búsqueda, filtros y estadísticas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
            />
            
            <div className="mt-4">
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange}
                subjects={subjects}
              />
            </div>
          </div>
          
          <StatsPanel stats={stats} />
        </div>

        {/* Área de revisión de flashcards */}
        <div className="lg:col-span-2">
          {loading.isLoading ? (
            <div className="card flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : filteredFlashcards.length > 0 && currentFlashcard ? (
            <FlashcardsReviewComponent
              flashcard={currentFlashcard}
              showAnswer={showAnswer}
              onToggleAnswer={handleToggleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onUpdateDifficulty={handleUpdateDifficulty}
              currentIndex={currentIndex}
              totalCards={filteredFlashcards.length}
            />
          ) : (
            <div className="card text-center">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron flashcards para repasar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsReviewPage;
