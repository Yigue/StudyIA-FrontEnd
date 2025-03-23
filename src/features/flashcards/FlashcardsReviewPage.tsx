import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFlashcards, useFlashcardsActions } from '../../hook/useFlashcards';
import { useTags } from '../../hook/useTags';
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
  const { flashcards, isLoading } = useFlashcards();
  const { tags } = useTags();
  const { getFlashcardsForReview, updateFlashcardReview } = useFlashcardsActions();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getFlashcardsForReview();
  }, [getFlashcardsForReview]);

  // Filtrar flashcards basados en búsqueda y filtros
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

    // Aplicar filtro de dificultad
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => {
        return card.difficulty === filters.difficulty;
      });
    }

    // Aplicar filtro de materia (si está disponible en los datos)
    if (filters.subject !== 'all') {
      filtered = filtered.filter(card => 
        card.material_id === filters.subject
      );
    }

    // Aplicar filtro de estado
    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(card => {
        const reviewDate = new Date(card.next_review);
        switch (filters.status) {
          case 'pending':
            return reviewDate > now;
          case 'due':
            return reviewDate <= now;
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
    
    const nextReviewDate = new Date();
    const daysToAdd = Math.pow(2, difficulty - 1);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    try {
      await updateFlashcardReview(currentFlashcard.id, {
        difficulty,
        next_review: nextReviewDate.toISOString()
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
        <h2 className="text-2xl font-bold text-gray-800">Repaso de Flashcards</h2>
        <Link 
          to="/flashcards/explorador"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Grid className="w-5 h-5" />
          Explorar Flashcards
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel lateral con búsqueda, filtros y estadísticas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
          {isLoading ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-600">Cargando flashcards...</p>
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
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
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
