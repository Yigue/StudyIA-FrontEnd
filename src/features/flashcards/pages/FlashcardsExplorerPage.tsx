import React from 'react';
import { Link } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import { useFlashcards, useFlashcardsStatus } from '../../../hooks/useFlashcards';
import { useTags } from '../../../hooks/useTags';
import FlashcardExplorer from '../components/containers/FlashcardExplorer';
import FlashcardEditor from '../components/containers/FlashcardEditor';
import { Flashcard } from '../../../types/flashcards/flashcards';

interface EditorState {
  isOpen: boolean;
  initialData: Flashcard | null;
}

const FlashcardsExplorerPage: React.FC = () => {
  const [editorState, setEditorState] = React.useState<EditorState>({
    isOpen: false,
    initialData: null
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });

  // Obtener datos de los hooks centralizados
  const { 
    flashcards, 
    getAllFlashcards, 
    toggleArchiveFlashcard,
    pagination = { totalPages: 1 }
  } = useFlashcards();
  
  const { isLoading } = useFlashcardsStatus();
  const { tags } = useTags();

  // Cargar flashcards al montar el componente
  React.useEffect(() => {
    getAllFlashcards();
  }, [getAllFlashcards]);

  // Manejadores de eventos
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
    getAllFlashcards();
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getAllFlashcards();
  };

  // Mapear etiquetas para el selector de materias
  const subjects = tags.map(tag => ({
    id: tag.id,
    name: tag.name
  }));

  return (
    <div className="p-4 md:p-8">
      {editorState.isOpen ? (
        <FlashcardEditor 
          onSave={handleSaveFlashcard}
          onCancel={handleCloseEditor}
          initialData={editorState.initialData}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              Explorador de Flashcards
            </h2>
            <div className="flex gap-2">
              <Link
                to="/flashcards/study"
                className="btn-secondary flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Estudiar
              </Link>
            </div>
          </div>

          <FlashcardExplorer
            flashcards={flashcards || []}
            subjects={subjects}
            isLoading={isLoading}
            onEdit={handleEditFlashcard}
            onDelete={handleDeleteFlashcard}
            onCreateNew={handleCreateFlashcard}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            totalPages={pagination.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

  
  
  // Mostrar el explorador de flashcards


export default FlashcardsExplorerPage; 