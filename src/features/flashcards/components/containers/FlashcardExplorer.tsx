import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { 
  Flashcard, 
  FlashcardFilters, 
  FlashcardStats 
} from '../../../../types/flashcards/flashcards';
import SearchBar from '../ui/SearchBar';
import FilterPanel from '../ui/FilterPanel';
import StatsPanel from '../ui/StatsPanel';
import FlashcardGrid from '../ui/FlashcardGrid';

interface FlashcardExplorerProps {
  flashcards: Flashcard[];
  subjects: Array<{ id: string; name: string }>;
  isLoading: boolean;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcard: Flashcard) => void;
  onCreateNew: () => void;
  onSearch?: (searchTerm: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const FlashcardExplorer: React.FC<FlashcardExplorerProps> = ({
  flashcards,
  subjects,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
  onSearch,
  onFilterChange,
  totalPages = 1,
  currentPage = 1,
  onPageChange
}) => {
  // Estado local para cuando no se proporcionan handlers externos
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FlashcardFilters>({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });
  
  // Filtrar localmente si no hay handler de búsqueda/filtro externo
  const filteredFlashcards = React.useMemo(() => {
    if (onSearch || onFilterChange) return flashcards;
    
    return flashcards.filter(card => {
      // Aplicar filtro de búsqueda
      if (searchTerm && 
          !card.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !card.answer.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Aplicar filtro de dificultad
      if (filters.difficulty !== 'all') {
        const cardDifficulty = card.difficulty.toString().toLowerCase();
        if (cardDifficulty !== filters.difficulty.toLowerCase()) {
          return false;
        }
      }
      
      // Aplicar filtro de materia
      if (filters.subject !== 'all') {
        const cardSubject = card.materialId || card.material_id || '';
        if (cardSubject !== filters.subject) {
          return false;
        }
      }
      
      // Aplicar filtro de estado
      if (filters.status !== 'all') {
        const now = new Date();
        const reviewDate = card.next_review ? new Date(card.next_review) : 
                         card.nextReview ? new Date(card.nextReview) :
                         card.lastReviewed ? new Date(card.lastReviewed) : null;
                         
        switch (filters.status) {
          case 'new':
            return !reviewDate;
          case 'pending':
            return reviewDate && reviewDate > now;
          case 'due':
            return reviewDate && reviewDate <= now;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [flashcards, searchTerm, filters, onSearch, onFilterChange]);
  
  // Manejo de búsqueda
  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      setSearchTerm(value);
    }
  };
  
  // Manejo de filtros
  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  
  // Calcular estadísticas
  const stats: FlashcardStats = {
    total: flashcards.length,
    filtered: filteredFlashcards.length,
    current: currentPage,
    pending: flashcards.filter(card => {
      const now = new Date();
      const reviewDate = card.next_review ? new Date(card.next_review) : 
                       card.nextReview ? new Date(card.nextReview) : null;
      return reviewDate && reviewDate > now;
    }).length,
    completed: flashcards.filter(card => {
      return (card.lastReviewed || card.last_reviewed) && 
             !(card.nextReview || card.next_review);
    }).length
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Explorador de Flashcards
        </h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Nueva Flashcard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral con búsqueda, filtros y estadísticas */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <SearchBar 
              value={onSearch ? '' : searchTerm} 
              onChange={handleSearch} 
            />
            
            <div className="mt-4">
              <FilterPanel 
                filters={onFilterChange ? {difficulty: 'all', subject: 'all', status: 'all'} : filters} 
                onFilterChange={handleFilterChange}
                subjects={subjects}
              />
            </div>
          </div>
          
          <StatsPanel stats={stats} showProgress={false} />
        </div>
        
        {/* Área de visualización de flashcards */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando flashcards...</p>
            </div>
          ) : (
            <>
              <FlashcardGrid 
                flashcards={onSearch || onFilterChange ? flashcards : filteredFlashcards}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              
              {/* Paginación */}
              {totalPages > 1 && onPageChange && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button 
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border bg-white dark:bg-gray-700 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    
                    <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                      Página {currentPage} de {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border bg-white dark:bg-gray-700 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardExplorer; 