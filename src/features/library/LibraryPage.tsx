import React, { useState, useEffect } from 'react';
import { MaterialsList } from './components/MaterialsList';
import { MaterialDetail } from './components/MaterialDetail';
import { FlashcardReview } from './components/FlashcardReview';
import LibraryLayout from './components/layout/LibraryLayout';
import { useMaterials } from '../../hook/useMaterials';
import { useFlashcards, useFlashcardsActions } from '../../hook/useFlashcards';
import { useSummaries } from '../../hook/useSummaries';
import { useMaterialsActions } from '../../hook/useMaterials';
import { StudyMaterial, Flashcard, Summary } from '../../types';
import { BookOpen, FileText, AlertCircle } from 'lucide-react';

const Tabs: React.FC<{
  children: React.ReactNode 
}> = ({ children }) => {
  return <div>{children}</div>;
};

const TabsList: React.FC<{
  className: string, 
  children: React.ReactNode 
}> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger: React.FC<{
  className: string, 
  disabled?: boolean, 
  children: React.ReactNode,
  onClick?: () => void
}> = ({ className, disabled, children, onClick }) => {
  return <button className={className} disabled={disabled} onClick={onClick}>{children}</button>;
};

const TabsContent: React.FC<{
  className: string, 
  isActive: boolean,
  children: React.ReactNode 
}> = ({ className, isActive, children }) => {
  if (!isActive) return null;
  return <div className={className}>{children}</div>;
};

export const LibraryPage: React.FC = () => {
  // Estado para el material seleccionado
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hooks para datos y acciones
  const { materials, isLoading: materialsLoading } = useMaterials();
  const { getAllMaterials } = useMaterialsActions();
  const { flashcards, isLoading: flashcardsLoading } = useFlashcards();
  const { updateFlashcard } = useFlashcardsActions();
  const { summaries, isLoading: summariesLoading } = useSummaries();
  
  // Estado para errores
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('material');
  
  // Flashcards para el material seleccionado
  const [materialFlashcards, setMaterialFlashcards] = useState<Flashcard[]>([]);
  
  // Summaries para el material seleccionado
  const [materialSummaries, setMaterialSummaries] = useState<Summary[] | null>(null);
  
  // Cargar materiales al montar el componente
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        console.log('Cargando materiales...');
        await getAllMaterials();
        console.log('Materiales cargados:', materials);
      } catch (err) {
        console.error('Error al cargar materiales:', err);
        setError('No se pudieron cargar los materiales. Por favor, intenta de nuevo.');
      }
    };
    
    loadMaterials();
  }, [getAllMaterials]);
  
  // Añadir efecto para depuración para ver cuando cambia el array de materiales
  useEffect(() => {
    console.log('Estado de materiales actualizado:', materials);
  }, [materials]);
  
  // Función para refrescar manualmente los materiales
  const handleRefreshMaterials = async () => {
    try {
      setError(null);
      console.log('Refrescando materiales manualmente...');
      await getAllMaterials();
    } catch (err) {
      console.error('Error al refrescar materiales:', err);
      setError('No se pudieron cargar los materiales. Por favor, intenta de nuevo.');
    }
  };
  
  // Cargar flashcards cuando se selecciona un material
  useEffect(() => {
    if (selectedMaterial && flashcards) {
      const filteredFlashcards = flashcards.filter(
        (f) => f.material_id === selectedMaterial.id
      );
      setMaterialFlashcards(filteredFlashcards);
    } else {
      setMaterialFlashcards([]);
    }
  }, [selectedMaterial, flashcards]);
  
  // Cargar summaries cuando se selecciona un material
  useEffect(() => {
    if (selectedMaterial && summaries) {
      const filteredSummaries = summaries.filter(
        (s) => s.material_id === selectedMaterial.id
      );
      setMaterialSummaries(filteredSummaries);
    } else {
      setMaterialSummaries(null);
    }
  }, [selectedMaterial, summaries]);
  
  // Manejar el cambio de dificultad de flashcard
  const handleDifficultyChange = async (flashcardId: string, difficulty: number) => {
    try {
      await updateFlashcard(flashcardId, { difficulty: difficulty.toString() });
    } catch (error) {
      console.error('Error al actualizar la dificultad:', error);
    }
  };
  
  // Manejar selección de material
  const handleSelectMaterial = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setActiveTab('material'); // Mostrar detalles del material al seleccionar
  };

  // Filtrar materiales basado en el término de búsqueda
  const filteredMaterials = searchTerm.trim() 
    ? materials.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : materials;
  
  // Determinar si estamos cargando
  const isLoading = materialsLoading || flashcardsLoading || summariesLoading;

  // Contenido principal cuando hay un material seleccionado
  const mainContent = selectedMaterial ? (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Tabs>
        <TabsList className="border-b border-gray-200 w-full p-0 h-auto flex">
          <TabsTrigger 
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === 'material' 
              ? 'border-b-2 border-indigo-600 text-indigo-700' 
              : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('material')}
          >
            <BookOpen className="w-4 h-4" />
            <span>Material</span>
          </TabsTrigger>
          
          <TabsTrigger 
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === 'flashcards' 
              ? 'border-b-2 border-indigo-600 text-indigo-700' 
              : 'text-gray-500'
            }`}
            disabled={materialFlashcards.length === 0}
            onClick={() => setActiveTab('flashcards')}
          >
            <FileText className="w-4 h-4" />
            <span>Flashcards ({materialFlashcards.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          className="p-0" 
          isActive={activeTab === 'material'}
        >
          <MaterialDetail 
            material={selectedMaterial}
            selectedSummary={materialSummaries}
          />
        </TabsContent>
        
        <TabsContent 
          className="p-0"
          isActive={activeTab === 'flashcards'}
        >
          {materialFlashcards.length > 0 ? (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Repasa con Flashcards
              </h3>
              <FlashcardReview 
                flashcards={materialFlashcards}
                onDifficultyChange={handleDifficultyChange}
              />
            </div>
          ) : (
            <div className="text-center p-12">
              <p className="text-gray-500">No hay flashcards disponibles para este material.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-100">
      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Selecciona un material para ver sus detalles
      </h3>
      <p className="text-gray-500">
        Aquí podrás revisar tus materiales de estudio, resúmenes y flashcards.
      </p>
    </div>
  );

  // Contenido de la barra lateral
  const sidebarContent = materials && materials.length > 0 ? (
    <MaterialsList 
      materials={filteredMaterials}
      onSelectMaterial={handleSelectMaterial}
    />
  ) : (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
      <p className="text-gray-600 mb-4">No tienes materiales disponibles.</p>
      <p className="text-sm text-gray-500">
        Puedes crear materiales nuevos en la sección de estudio.
      </p>
    </div>
  );
  
  return (
    <LibraryLayout
      isLoading={isLoading}
      title="Mi Biblioteca"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onRefresh={handleRefreshMaterials}
      sidebar={sidebarContent}
      main={
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          )}
          {mainContent}
        </>
      }
    />
  );
};
