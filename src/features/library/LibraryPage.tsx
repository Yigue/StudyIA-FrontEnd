import React, { useState, useEffect } from 'react';
import { MaterialsList } from './components/MaterialsList';
import { MaterialDetail } from './components/MaterialDetail';
import { FlashcardReview } from './components/FlashcardReview';
import LibraryLayout from './components/layout/LibraryLayout';
import { useMaterials } from '../../hooks/useMaterials';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSummaries } from '../../hooks/useSummaries';
import { StudyMaterial } from '../../types/studyMaterial/studyMaterial';
import { BookOpen, FileText } from 'lucide-react';

// Componentes para el sistema de pestañas
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
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('material');
  
  // Estado para errores
  const [error, setError] = useState<string | null>(null);
  
  // Obtener datos y funciones de los hooks actualizados
  const { 
    materials, 
    fetchMaterials,
    loading: materialsLoading
  } = useMaterials();
  
  const {
    flashcards,
    getFlashcardsByMaterial,
    updateFlashcard,
    loading: flashcardsLoading
  } = useFlashcards();
  
  const {
    summaries,
    getSummariesByMaterial,
    loading: summariesLoading
  } = useSummaries();
  
  // Cargar materiales al montar el componente

  
  // Función para refrescar manualmente los materiales
  const handleRefreshMaterials = () => {
    fetchMaterials();
  };
  
  // Cargar flashcards y resúmenes cuando se selecciona un material
  useEffect(() => {
    if (selectedMaterial?.id) {

      getFlashcardsByMaterial(selectedMaterial.id);
      getSummariesByMaterial(selectedMaterial.id);
    }
  }, [selectedMaterial, getFlashcardsByMaterial, getSummariesByMaterial]);
  
  // Obtener flashcards del material seleccionado
  const materialFlashcards = selectedMaterial 
    ? flashcards.filter(f => f.materialId === selectedMaterial.id) 
    : [];
  
  // Obtener resúmenes del material seleccionado  
  const materialSummaries = selectedMaterial 
    ? summaries.filter(s => s.materialId === selectedMaterial.id)
    : [];
  
  // Manejar el cambio de dificultad de flashcard
  const handleDifficultyChange = async (flashcardId: string, difficulty: number) => {
    try {
      await updateFlashcard(flashcardId, { 
        difficulty: difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard" 
      });
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
        (m.content && m.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : materials;
  
  // Determinar si estamos cargando
  const isLoading = materialsLoading.isLoading || flashcardsLoading.isLoading || summariesLoading.isLoading;

  // Contenido principal cuando hay un material seleccionado
  const mainContent = selectedMaterial ? (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <Tabs>
        <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full p-0 h-auto flex">
          <TabsTrigger 
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === 'material' 
              ? 'border-b-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('material')}
          >
            <BookOpen className="w-4 h-4" />
            <span>Material</span>
          </TabsTrigger>
          
          <TabsTrigger 
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === 'flashcards' 
              ? 'border-b-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'
            }`}
            disabled={materialFlashcards.length === 0}
            onClick={() => setActiveTab('flashcards')}
          >
            <FileText className="w-4 h-4" />
            <span>Flashcards ({materialFlashcards.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          className="p-6"
          isActive={activeTab === 'material'}
        >
          <MaterialDetail 
            material={selectedMaterial} 
            selectedSummary={materialSummaries}
          />
        </TabsContent>
        
        <TabsContent 
          className="p-6"
          isActive={activeTab === 'flashcards'}
        >
          {materialFlashcards.length > 0 ? (
            <FlashcardReview 
              flashcards={materialFlashcards}
              onDifficultyChange={handleDifficultyChange}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No hay flashcards disponibles para este material.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-2">Selecciona un material</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Haz clic en un material de la lista para ver sus detalles, resúmenes y flashcards.
      </p>
    </div>
  );
  
  return (
    <LibraryLayout
      title="Biblioteca de Materiales"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onRefresh={handleRefreshMaterials}
      isLoading={isLoading}
      error={error}
      sidebar={
        <MaterialsList 
          materials={filteredMaterials}
          onSelectMaterial={handleSelectMaterial}
          isLoading={isLoading}
        />
      }
      main={mainContent}
    />
  );
};
