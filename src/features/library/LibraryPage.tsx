import { useLibraryMaterials } from "./hooks/useLibraryMaterials";
import { MaterialDetail } from "./components/MaterialDetail";
import { FlashcardList } from "./components/FlashcardList";
import { SummaryList } from "./components/SummaryList";
import { MaterialItem } from "../../components/ui/MaterialItem";
import { MaterialsHeader } from "./components/MaterialsHeader";
import { MaterialsFilters } from "./components/MaterialsFilters";
import { MaterialsEmptyState } from "./components/MaterialsEmptyState";
import { LoadingState } from "./components/LoadingState";
import { ProcessingIndicator } from "./components/ProcessingIndicator";
import { SearchBar } from "./components/SearchBar";

/**
 * Página principal de la biblioteca de materiales de estudio
 * 
 * Muestra una lista de materiales, permite buscarlos, y visualizar sus detalles,
 * incluyendo flashcards y resúmenes generados.
 */
export default function LibraryPage() {
  const {
    materials,
    selectedMaterial,
    materialFlashcards,
    materialSummaries,
    searchTerm,
    activeTab,
    isProcessing,
    uploadProgress,
    materialsLoading,
    setSelectedMaterial,
    setSearchTerm,
    setActiveTab,
    loadFlashcardsAndSummaries,
    deleteMaterial,
    generateContent,
    viewFile,
    changeFlashcardDifficulty
  } = useLibraryMaterials();

  // Opciones para el procesamiento de materiales
  const processingOptions = {
    generateSummary: true,
    generateFlashcards: true
  };

  // Renderizar mensaje cargando cuando se están cargando los materiales
  if (materialsLoading) {
    return <LoadingState />;
  }

  const filteredMaterials = materials.filter(
    material => material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFlashcardsCount = (materialId: string) => {
    return materialFlashcards.filter(f => f.material_id === materialId).length;
  };

  const getSummariesCount = (materialId: string) => {
    return materialSummaries.filter(s => s.material_id === materialId).length;
  };

  // Función para generar contenido para el material seleccionado
  const handleGenerateContent = () => {
    if (selectedMaterial) {
      generateContent(selectedMaterial.id, processingOptions);
    }
  };

  // Función para eliminar el material seleccionado
  const handleDeleteMaterial = () => {
    if (selectedMaterial) {
      deleteMaterial(selectedMaterial.id);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0f172a] text-white">
      {/* Cabecera con título y botones de acción */}
      <MaterialsHeader />
      
      {/* Contenido principal con altura máxima y scroll */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel izquierdo: buscador y lista de materiales */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col overflow-hidden">
          {/* Buscador */}
          <div className="p-4 border-b border-gray-800">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Buscar en materiales..."
            />
          </div>
          
          {/* Filtros */}
          <div className="p-4 border-b border-gray-800">
            <MaterialsFilters />
          </div>
          
          {/* Lista de materiales con scroll */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMaterials.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {filteredMaterials.map(material => (
                  <MaterialItem 
                    key={material.id}
                    material={material}
                    isSelected={selectedMaterial?.id === material.id}
                    flashcardsCount={getFlashcardsCount(material.id)}
                    summariesCount={getSummariesCount(material.id)}
                    onClick={() => {
                      setSelectedMaterial(material);
                      loadFlashcardsAndSummaries(material.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <MaterialsEmptyState searchTerm={searchTerm} />
            )}
          </div>
        </div>
        
        {/* Panel derecho: detalle del material seleccionado */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          {selectedMaterial ? (
            <div className="w-full h-full flex flex-col overflow-hidden">
              {/* Cabecera del material */}
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold truncate">{selectedMaterial.title}</h2>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                    onClick={handleGenerateContent}
                    disabled={isProcessing}
                  >
                    Generar Contenido
                  </button>
                  <button 
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    onClick={handleDeleteMaterial}
                    disabled={isProcessing}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              {/* Tabs del material */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                  <button
                    className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
                      activeTab === "content" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("content")}
                  >
                    Contenido
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
                      activeTab === "flashcards" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("flashcards")}
                    disabled={materialFlashcards.length === 0}
                  >
                    Flashcards ({materialFlashcards.length})
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
                      activeTab === "summaries" 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("summaries")}
                    disabled={materialSummaries.length === 0}
                  >
                    Resúmenes ({materialSummaries.length})
                  </button>
                </div>
              </div>
              
              {/* Contenido con scroll */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === "content" && (
                  <MaterialDetail 
                    material={selectedMaterial} 
                    summaries={materialSummaries}
                    onViewFile={viewFile}
                  />
                )}
                
                {activeTab === "flashcards" && (
                  <FlashcardList 
                    flashcards={materialFlashcards}
                    onDifficultyChange={changeFlashcardDifficulty}
                  />
                )}
                
                {activeTab === "summaries" && (
                  <SummaryList summaries={materialSummaries} />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center max-w-md p-8">
                <div className="bg-indigo-900/30 mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Selecciona un material
                </h3>
                <p className="text-gray-400">
                  Haz clic en cualquier material de la lista para ver su contenido, flashcards y resúmenes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Indicador de procesamiento */}
      {isProcessing && (
        <ProcessingIndicator progress={uploadProgress} />
      )}
    </div>
  );
}
   