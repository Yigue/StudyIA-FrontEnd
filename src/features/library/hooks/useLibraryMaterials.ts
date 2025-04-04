import { useState, useEffect } from "react";
import { useMaterials } from "../../../hooks/useMaterials";
import { useFlashcards } from "../../../hooks/useFlashcards";
import { useSummaries } from "../../../hooks/useSummaries";
import { StudyMaterial } from "@/types";

// Definición de las opciones de procesamiento
interface ProcessingOptions {
  summary?: boolean;
  flashcards?: boolean;
}

/**
 * Hook personalizado para gestionar los materiales, flashcards y resúmenes en la biblioteca
 */
export const useLibraryMaterials = () => {
  // Estado local
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  
  // Hooks para materiales, flashcards y resúmenes
  const {
    materials,
    loading: { isLoading },
    fetchMaterials,
    deleteMaterial: apiDeleteMaterial,
    processMaterial
  } = useMaterials();
  
  const {
    flashcards,
    getFlashcardsByMaterial,
    updateFlashcard
  } = useFlashcards();
  
  const {
    summaries,
    getSummariesByMaterial
  } = useSummaries();
  
  // Filtrar materiales según el término de búsqueda
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Obtener flashcards y resúmenes para el material seleccionado
  const materialFlashcards = flashcards.filter(
    flashcard => (flashcard.material_id) === selectedMaterial?.id
  );
  
  const materialSummaries = summaries.filter(
    summary => (summary.material_id) === selectedMaterial?.id
  );
  
  // Cargar flashcards y resúmenes para un material específico
  const loadFlashcardsAndSummaries = async (materialId: string) => {
    try {
      await Promise.all([
        getFlashcardsByMaterial(materialId),
        getSummariesByMaterial(materialId)
      ]);
    } catch (error) {
      console.error("Error al cargar flashcards y resúmenes:", error);
    }
  };
  
  // Eliminar un material
  const deleteMaterial = async (materialId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este material?")) {
      await apiDeleteMaterial(materialId);
      if (selectedMaterial?.id === materialId) {
        setSelectedMaterial(null);
      }
      await refreshMaterials();
    }
  };

  // Función para refrescar materiales
  const refreshMaterials = async () => {
    try {
      await fetchMaterials();
    } catch (error) {
      console.error("Error al refrescar materiales:", error);
    }
  };
  
  // Generar contenido para un material
  const generateContent = async (materialId: string, options: ProcessingOptions) => {
    if (!materialId) return;
    
    try {
      // Adaptamos los parámetros al formato esperado por la API
      const apiOptions = {
        generate_summary: options.summary,
        generate_flashcards: options.flashcards,
        summary_options: {},
        flashcards_options: {}
      };
      
      // Simulamos que obtenemos el material primero
      const material = materials.find(m => m.id === materialId);
      if (!material) throw new Error("Material no encontrado");
      
      // Procesamos el material
      await processMaterial(material, apiOptions);
      
      // Recargar flashcards y resúmenes después del procesamiento
      await loadFlashcardsAndSummaries(materialId);
    } catch (error) {
      console.error("Error al generar contenido:", error);
    }
  };
  
  // Cambiar la dificultad de una flashcard
  const changeFlashcardDifficulty = async (flashcardId: string, difficulty: "easy" | "medium" | "hard") => {
    try {
      await updateFlashcard(flashcardId, { difficulty });
    } catch (error) {
      console.error("Error al actualizar la dificultad:", error);
    }
  };
  
  // Abrir un archivo en una nueva pestaña
  const viewFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };
  
  // Cargar materiales al inicio
  useEffect(() => {
    refreshMaterials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    // Estado
    materials: filteredMaterials,
    selectedMaterial,
    materialFlashcards,
    materialSummaries,
    searchTerm,
    activeTab,
    isProcessing: isLoading,
    uploadProgress: 0, // Valor por defecto
    materialsLoading: isLoading,
    
    // Setters
    setSelectedMaterial,
    setSearchTerm,
    setActiveTab,
    
    // Acciones
    refreshMaterials,
    loadFlashcardsAndSummaries,
    deleteMaterial,
    generateContent,
    viewFile,
    changeFlashcardDifficulty
  };
}; 