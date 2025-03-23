import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useFlashcards, useFlashcardsActions } from '../../../hook/useFlashcards';
import { useTags } from '../../../hook/useTags';
import FlashcardEditor from './FlashcardEditor';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { StatsPanel } from './StatsPanel';
import FlashcardReel from './FlashcardReel';
import { Flashcard } from '../../../types';

interface EditorState {
  isOpen: boolean;
  initialData: Flashcard | null;
}

const FlashcardExplorerPage = () => {
  // Estado de la UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });
  const [editorState, setEditorState] = useState<EditorState>({
    isOpen: false,
    initialData: null
  });

  // Obtener datos de los hooks centralizados
  const { flashcards, isLoading } = useFlashcards();
  const { tags } = useTags();
  const { getAllFlashcards, updateFlashcardReview, archiveFlashcard } = useFlashcardsActions();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getAllFlashcards();
  }, [getAllFlashcards]);

  // Filtrar flashcards basados en búsqueda y filtros
  const filteredFlashcards = flashcards ? flashcards.filter(card => {
    // Filtro de búsqueda
    if (searchTerm && 
        !card.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !card.answer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro de dificultad
    if (filters.difficulty !== 'all' && card.difficulty !== filters.difficulty) {
      return false;
    }

    // Filtro de materia
    if (filters.subject !== 'all' && card.material_id !== filters.subject) {
      return false;
    }

    // Filtro de estado
    if (filters.status !== 'all') {
      const now = new Date();
      const reviewDate = new Date(card.next_review);
      switch (filters.status) {
        case 'pending':
          return reviewDate > now;
        case 'due':
          return reviewDate <= now;
        default:
          return true;
      }
    }

    return true;
  }) : [];

  // Stats para mostrar en el panel
  const stats = {
    total: flashcards?.length || 0,
    filtered: filteredFlashcards.length,
    current: 0
  };

  // Manejadores de eventos
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  const handleSaveFlashcard = (flashcardData: any) => {
    // Aquí se guardaría la flashcard nueva o actualizada
    console.log('Guardar flashcard:', flashcardData);
    setEditorState({
      isOpen: false,
      initialData: null
    });
  };

  const handleCloseEditor = () => {
    setEditorState({
      isOpen: false,
      initialData: null
    });
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
          initialData={editorState.initialData}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          {/* Área de visualización de flashcards */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-600">Cargando flashcards...</p>
              </div>
            ) : filteredFlashcards.length > 0 ? (
              <FlashcardReel 
                flashcards={filteredFlashcards}
                onEdit={handleEditFlashcard}
              />
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

export default FlashcardExplorerPage; 