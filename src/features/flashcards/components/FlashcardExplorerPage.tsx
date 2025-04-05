import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useFlashcards } from '../../../hooks/useFlashcards';
import { useTags } from '../../../hooks/useTags';
import FlashcardEditor from './FlashcardEditor';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { StatsPanel } from './StatsPanel';
import FlashcardReel from './FlashcardReel';
import { Flashcard } from '../../../types';
import { toast } from 'react-hot-toast';

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
  const [error, setError] = useState<string | null>(null);

  // Obtener datos de los hooks centralizados
  const { 
    flashcards, 
    loading, 
    error: flashcardsError,
    getAllFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcards();
  
  const { tags } = useTags();

  // Cargar flashcards al montar el componente
  const loadFlashcards = useCallback(async () => {
    try {
      setError(null);
      await getAllFlashcards();
    } catch (err) {
      console.error('Error al cargar flashcards:', err);
      setError('No se pudieron cargar las flashcards. Por favor, intenta de nuevo.');
    }
  }, [getAllFlashcards]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  // Mostrar errores del store
  useEffect(() => {
    if (flashcardsError) {
      setError(flashcardsError);
      toast.error(flashcardsError);
    }
  }, [flashcardsError]);

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
    if (filters.subject !== 'all' && card.materialId !== filters.subject) {
      return false;
    }

    // Filtro de estado
    if (filters.status !== 'all') {
      const now = new Date();
      const reviewDate = new Date(card.nextReview);
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

  const handleSaveFlashcard = async (flashcardData: Flashcard) => {
    try {
      if (editorState.initialData) {
        // Actualizar flashcard existente
        await updateFlashcard(editorState.initialData.id, flashcardData);
        toast.success('Flashcard actualizada correctamente');
      } else {
        // Crear nueva flashcard
        await createFlashcard(flashcardData);
        toast.success('Flashcard creada correctamente');
      }
      
      // Cerrar editor y refrescar datos
      setEditorState({
        isOpen: false,
        initialData: null
      });
      loadFlashcards();
    } catch (err) {
      console.error('Error al guardar flashcard:', err);
      toast.error('No se pudo guardar la flashcard. Inténtalo de nuevo.');
    }
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    try {
      await deleteFlashcard(flashcardId);
      toast.success('Flashcard eliminada correctamente');
      loadFlashcards();
    } catch (err) {
      console.error('Error al eliminar flashcard:', err);
      toast.error('No se pudo eliminar la flashcard');
    }
  };

  const handleCloseEditor = () => {
    setEditorState({
      isOpen: false,
      initialData: null
    });
  };

  // Mapear etiquetas para el selector de materias
  const subjects = tags?.map(tag => ({
    id: tag.id,
    name: tag.name
  })) || [];

  // Función para refrescar manualmente
  const handleRefresh = () => {
    loadFlashcards();
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Explorador de Flashcards</h2>
          {loading.isLoading && <Loader2 className="w-5 h-5 ml-3 text-indigo-600 animate-spin" />}
        </div>
        <button
          onClick={handleCreateFlashcard}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={loading.isLoading}
        >
          <PlusCircle className="w-5 h-5" />
          Nueva Flashcard
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
          <button 
            className="ml-3 text-red-600 dark:text-red-400 underline text-sm"
            onClick={handleRefresh}
          >
            Reintentar
          </button>
        </div>
      )}

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
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
            {loading.isLoading ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-gray-600 dark:text-gray-300 ml-3">Cargando flashcards...</p>
              </div>
            ) : filteredFlashcards.length > 0 ? (
              <FlashcardReel 
                flashcards={filteredFlashcards}
                onEdit={handleEditFlashcard}
                onDelete={handleDeleteFlashcard}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No se encontraron flashcards con los filtros actuales
                </p>
                {searchTerm || filters.difficulty !== 'all' || filters.subject !== 'all' || filters.status !== 'all' ? (
                  <button
                    className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        difficulty: 'all',
                        subject: 'all',
                        status: 'all'
                      });
                    }}
                  >
                    Limpiar filtros
                  </button>
                ) : (
                  <button
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    onClick={handleCreateFlashcard}
                  >
                    Crear primera flashcard
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardExplorerPage; 