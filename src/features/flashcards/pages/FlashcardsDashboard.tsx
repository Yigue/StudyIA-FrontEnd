import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useFlashcards, useFlashcardsStatus } from '../../../hooks/useFlashcards';
import { useTags } from '../../../hooks/useTags';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { StatsPanel } from '../components/StatsPanel';
import FlashcardReelSimple from '../components/FlashcardReelSimple';
import FlashcardEditor from '../components/FlashcardEditor';
import { Flashcard } from '../../../types';
import { FlashcardFilters, FlashcardStats } from '../types/flashcards.types';
import { BookOpen, PlusCircle, Search, Play, Layers, Plus, FileBarChart, BarChart, Timer, Brain, Award } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { SpacedRepetitionStats } from '../../../types/flashcards';

interface EditorState {
  isOpen: boolean;
  initialData: Flashcard | null;
}

/**
 * Panel de control de flashcards que muestra una visión general y permite
 * filtrar, buscar y acceder a distintas funcionalidades relacionadas.
 */
const FlashcardsDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    isOpen: false,
    initialData: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Obtener datos con hooks optimizados
  const { flashcards, loading } = useFlashcards();
  const { tags } = useTags();
  
  // Simulación de acciones para desarrollo
  const getAllFlashcards = () => {
    console.log('Obteniendo todas las flashcards');
  };
  
  const archiveFlashcard = (id: string) => {
    console.log('Archivando flashcard:', id);
  };
  
  const createFlashcard = (data: any) => {
    console.log('Creando flashcard:', data);
    return Promise.resolve();
  };
  
  const updateFlashcard = (id: string, data: any) => {
    console.log('Actualizando flashcard:', id, data);
    return Promise.resolve();
  };

  // Cargar flashcards al montar el componente
  useEffect(() => {
    getAllFlashcards();
  }, []);

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
      if (selectedDifficulty && card.difficulty !== selectedDifficulty) {
        return false;
      }

      // Filtro de materia
      if (selectedTags.length > 0 && !selectedTags.includes(card.material_id)) {
        return false;
      }

      // Filtro de estado
      const now = new Date();
      const reviewDate = new Date(card.nextReview || '');
      if (reviewDate > now) {
        return false;
      }

      return true;
    });
  }, [flashcards, searchTerm, selectedDifficulty, selectedTags]);

  // Stats para mostrar en el panel
  const stats: FlashcardStats = {
    total: flashcards?.length || 0,
    filtered: filteredFlashcards.length,
    current: 0
  };

  // Manejadores de eventos
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'difficulty') {
      setSelectedDifficulty(value === 'all' ? null : value);
    } else if (key === 'subject') {
      if (value === 'all') {
        setSelectedTags([]);
      } else {
        setSelectedTags([value]);
      }
    }
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

  const navigateTo = (path: string) => {
    navigate({ to: path });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Flashcards
        </h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigateTo('/flashcards/explorador')}
          >
            <Search size={18} className="mr-2" />
            Explorar
          </Button>
          <Button 
            variant="default"
            onClick={() => navigateTo('/sesion')}
          >
            <Play size={18} className="mr-2" />
            Iniciar Sesión
          </Button>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-2 font-semibold text-blue-700 dark:text-blue-300">Tarjetas</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stats.total}
          </div>
          <div className="flex text-sm text-gray-500 dark:text-gray-400">
            <div className="flex-1">
              <span className="text-green-600 dark:text-green-400 font-medium">{stats.filtered}</span> revisadas
            </div>
            <div className="flex-1 text-right">
              <span className="text-orange-600 dark:text-orange-400 font-medium">{stats.current}</span> actuales
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="ml-2 font-semibold text-purple-700 dark:text-purple-300">Retención</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {Math.round(stats.current / stats.total * 100) || 0}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tasa de memoria estimada
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
              <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="ml-2 font-semibold text-amber-700 dark:text-amber-300">Tiempo</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {Math.round(stats.total / 60) || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Minutos totales de estudio
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <BarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="ml-2 font-semibold text-green-700 dark:text-green-300">Racha</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stats.current || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Días consecutivos estudiando
          </div>
        </Card>
      </div>
      
      {/* Acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          onClick={() => navigateTo('/sesion')}
          className="p-6 bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
              <Play size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Iniciar Sesión</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Comienza una sesión de estudio con tus flashcards pendientes de repaso.
            </p>
          </div>
        </Card>
        
        <Card 
          onClick={() => navigateTo('/analiticas')}
          className="p-6 bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <FileBarChart size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ver Analíticas</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Explora estadísticas detalladas de tu rendimiento y progreso.
            </p>
          </div>
        </Card>
        
        <Card 
          onClick={() => navigateTo('/flashcards/explorador')}
          className="p-6 bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Añadir Flashcards</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Crea nuevas flashcards para ampliar tu biblioteca de estudio.
            </p>
          </div>
        </Card>
      </div>
      
      {/* Próximas revisiones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Próximas Revisiones
        </h2>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="font-medium">Pregunta de ejemplo {i}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Categoría: Matemáticas</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Hoy
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button 
            variant="ghost"
            onClick={() => navigateTo('/flashcards/explorador')}
          >
            Ver todas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsDashboard; 