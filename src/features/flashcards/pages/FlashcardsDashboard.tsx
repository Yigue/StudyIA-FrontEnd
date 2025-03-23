import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards, useFlashcardsActions } from '../../../hook/useFlashcards';
import { useTags } from '../../../hook/useTags';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { StatsPanel } from '../components/StatsPanel';
import FlashcardReelSimple from '../components/FlashcardReelSimple';
import FlashcardEditor from '../components/FlashcardEditor';
import { Flashcard } from '../../../types';
import { FlashcardFilters, FlashcardStats } from '../types/flashcards.types';
import { BookOpen, PlusCircle } from 'lucide-react';

interface EditorState {
  isOpen: boolean;
  initialData: Flashcard | null;
}

const FlashcardsDashboard: React.FC = () => {
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

  // Obtener datos de los hooks centralizados
  const { flashcards, isLoading } = useFlashcards();
  const { tags } = useTags();
  const { getAllFlashcards, archiveFlashcard, createFlashcard, updateFlashcard } = useFlashcardsActions();

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getAllFlashcards();
  }, [getAllFlashcards]);

  // Filtrar flashcards basados en búsqueda y filtros
  const filteredFlashcards = useMemo(() => {
    if (!flashcards) return [];
    
    return flashcards.filter(card => {
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
    });
  }, [flashcards, searchTerm, filters]);

  // Stats para mostrar en el panel
  const stats: FlashcardStats = {
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
      if (flashcardData.id) {
        // Actualizar flashcard existente
        await updateFlashcard(flashcardData.id, flashcardData);
      } else {
        // Crear nueva flashcard
        await createFlashcard(flashcardData);
      }
      
      setEditorState({
        isOpen: false,
        initialData: null
      });
      
      // Recargar flashcards para ver cambios
      getAllFlashcards();
    } catch (error) {
      console.error('Error al guardar flashcard:', error);
    }
  };

  const handleCloseEditor = () => {
    setEditorState({
      isOpen: false,
      initialData: null
    });
  };

  const handleDeleteFlashcard = (flashcard: Flashcard) => {
    if (window.confirm('¿Estás seguro de que deseas archivar esta flashcard?')) {
      archiveFlashcard(flashcard.id);
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
        <h2 className="text-2xl font-bold text-gray-800">Dashboard de Flashcards</h2>
        <div className="flex gap-2">
          <Link 
            to="/flashcards/review"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Revisar Flashcards
          </Link>
          <button
            onClick={handleCreateFlashcard}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Nueva Flashcard
          </button>
        </div>
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
              <FlashcardReelSimple 
                flashcards={filteredFlashcards}
                onEdit={handleEditFlashcard}
                onDelete={handleDeleteFlashcard}
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

export default FlashcardsDashboard; 