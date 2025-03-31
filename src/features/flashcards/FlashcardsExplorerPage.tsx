import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useFlashcards, useFlashcardsStatus } from '../../hook/useFlashcards';
import { useTags } from '../../hook/useTags';
import FlashcardEditor from './components/FlashcardEditor';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import FlashcardReelSimple from './components/FlashcardReelSimple';
import { Flashcard } from '../../types/flashcards/flashcards';
import { FlashcardFilters, FlashcardStats } from './types/flashcards.types';

interface EditorState {
  isOpen: boolean;
  initialData: Flashcard | null;
}

const FlashcardsExplorerPage = () => {
  // Estado de la UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FlashcardFilters>({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });
  const [editorState, setEditorState] = useState<EditorState>({
    isOpen: false,
    initialData: null
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener datos de los hooks centralizados
  const { flashcards, pagination,toggleArchiveFlashcard ,getAllFlashcards} = useFlashcards();
  const { isLoading } = useFlashcardsStatus();
  const { tags } = useTags();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getAllFlashcards({
      page: currentPage,
      limit: 10,
      difficulty: filters.difficulty !== 'all' ? filters.difficulty as "easy" | "medium" | "hard" : undefined,
      tags: filters.subject !== 'all' ? filters.subject : undefined,
      archived: false
    });
  }, [getAllFlashcards, currentPage, filters.difficulty, filters.subject]);

  // Actualizar la página actual cuando cambia en el store
  useEffect(() => {
    updateStorePage(currentPage);
  }, [currentPage, updateStorePage]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filtrar flashcards basados en búsqueda
  const filteredFlashcards = flashcards ? flashcards.filter(card => {
    // Filtro de búsqueda
    if (searchTerm && 
        !card.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !card.answer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro de estado
    if (filters.status !== 'all') {
      const now = new Date();
      const reviewDate = card.lastReviewed ? new Date(card.lastReviewed) : null;
      switch (filters.status) {
        case 'pending':
          return reviewDate === null || (reviewDate && reviewDate > now);
        case 'due':
          return reviewDate !== null && reviewDate <= now;
        default:
          return true;
      }
    }

    return true;
  }) : [];

  // Stats para mostrar en el panel
  const stats: FlashcardStats = {
    total: flashcards?.length || 0,
    filtered: filteredFlashcards.length,
    current: 0
  };

  // Manejadores de eventos
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Resetear a la primera página cuando cambiamos filtros
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditorState({
      isOpen: true,
      initialData: flashcard
    });
  };

  const handleCreateFlashcard = () => {
    setEditorState({
      isOpen: true,
      initialData: null
    });
  };

  const handleSaveFlashcard = (flashcardData: Flashcard) => {
    // Aquí se guardaría la flashcard nueva o actualizada
    console.log('Guardar flashcard:', flashcardData);
    setEditorState({
      isOpen: false,
      initialData: null
    });
    // Recargar flashcards para ver cambios
    getAllFlashcards({
      page: currentPage,
      limit: 10
    });
  };

  const handleCloseEditor = () => {
    setEditorState({
      isOpen: false,
      initialData: null
    });
  };

  const handleDeleteFlashcard = (flashcard: Flashcard) => {
    if (window.confirm('¿Estás seguro de que deseas archivar esta flashcard?')) {
      toggleArchiveFlashcard(flashcard.id);
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
        <h2 className="text-2xl font-bold text-gray-800">Explorador de Flashcards</h2>
        <button
          onClick={handleCreateFlashcard}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Nueva Flashcard
        </button>
      </div>

      {editorState.isOpen ? (
        <FlashcardEditor 
          onSave={handleSaveFlashcard}
          onCancel={handleCloseEditor}
          initialData={editorState.initialData}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel lateral con búsqueda, filtros y estadísticas */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
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

          {/* Área de visualización de flashcards */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-600">Cargando flashcards...</p>
              </div>
            ) : filteredFlashcards.length > 0 ? (
              <>
                <FlashcardReelSimple 
                  flashcards={filteredFlashcards}
                  onEdit={handleEditFlashcard}
                  onDelete={handleDeleteFlashcard}
                />
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      
                      <span className="px-3 py-1">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-600">
                  No se encontraron flashcards con los filtros actuales
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsExplorerPage; 