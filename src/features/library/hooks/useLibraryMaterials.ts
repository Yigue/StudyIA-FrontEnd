import { useState, useCallback, useMemo } from "react";
import { useMaterialsQuery, useDeleteMaterial, useProcessMaterial } from "../../../hooks/queries/useMaterialsQuery";
import { useFlashcardsByMaterialQuery, useUpdateFlashcard } from "../../../hooks/queries/useFlashcardsQuery";
import { useSummariesByMaterialQuery } from "../../../hooks/queries/useSummariesQuery";
import { StudyMaterial } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

// Interfaz para opciones de procesamiento de la API
interface ApiProcessingOptions {
  generate_summary: boolean;
  generate_flashcards: boolean;
  summary_options?: {
    max_length?: number;
    format?: string;
  };
  flashcards_options?: {
    count?: number;
    difficulty?: "easy" | "medium" | "hard";
  };
}

/**
 * Hook personalizado optimizado para gestionar materiales en la biblioteca.
 * Utiliza React Query internamente.
 */
export const useLibraryMaterials = () => {
  // Estado de UI local
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "flashcards" | "summaries">("content");
  
  const queryClient = useQueryClient();
  
  // Consultas React Query
  const { 
    data: allMaterials = [], 
    isLoading: materialsLoading, 
    error: materialsError 
  } = useMaterialsQuery();
  
  // Consultas condicionales basadas en el material seleccionado
  const { 
    data: materialFlashcards = [], 
  } = useFlashcardsByMaterialQuery(
    selectedMaterial?.id || "", 
  );
  
  const { 
    data: materialSummaries = [],
  } = useSummariesByMaterialQuery(
    selectedMaterial?.id || "",
  );
  
  // Mutaciones
  const deleteMaterialMutation = useDeleteMaterial();
  const processMaterialMutation = useProcessMaterial();
  const updateFlashcardMutation = useUpdateFlashcard();
  
  // Filtrar materiales por término de búsqueda
  const filteredMaterials = useMemo(() => 
    allMaterials.filter(material => 
      material.title.toLowerCase().includes(searchTerm.toLowerCase())
    ), [allMaterials, searchTerm]
  );
  
  // Funciones de acción simplificadas
  const loadFlashcardsAndSummaries = useCallback(async (materialId: string) => {
    if (!materialId) return;
    
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['flashcards', 'byMaterial', materialId] }),
      queryClient.invalidateQueries({ queryKey: ['summaries', 'byMaterial', materialId] })
    ]);
  }, [queryClient]);
  
  const deleteMaterial = useCallback(async (materialId: string) => {
    if (!materialId) return;
    
    if (window.confirm("¿Estás seguro de que deseas eliminar este material y sus flashcards/resúmenes asociados?")) {
      try {
        // Primero limpiar las referencias a este material
        if (selectedMaterial?.id === materialId) {
          setSelectedMaterial(null);
        }
        
        // Luego eliminar el material
        await deleteMaterialMutation.mutateAsync(materialId);
        
        // Después de eliminar el material, invalidar explícitamente todas las queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['materials'] });
        queryClient.removeQueries({ queryKey: ['materials', 'detail', materialId] });
        queryClient.removeQueries({ queryKey: ['flashcards', 'byMaterial', materialId] });
        queryClient.removeQueries({ queryKey: ['summaries', 'byMaterial', materialId] });
      } catch (error) {
        console.error("Error al eliminar material:", error);
      }
    }
  }, [deleteMaterialMutation, selectedMaterial?.id, queryClient, setSelectedMaterial]);
  
  const generateContent = useCallback(async (materialId: string, options: {
    generateSummary: boolean;
    generateFlashcards: boolean;
  }) => {
    if (!materialId) return;
    
    const material = allMaterials.find(m => m.id === materialId);
    if (!material) {
      console.error("Material no encontrado para generar contenido");
      return;
    }

    // Convertir a formato API
    const apiOptions: ApiProcessingOptions = {
      generate_summary: options.generateSummary,
      generate_flashcards: options.generateFlashcards,
      summary_options: {}, 
      flashcards_options: {} 
    };
    
    try {
      await processMaterialMutation.mutateAsync({ material, options: apiOptions });
      await loadFlashcardsAndSummaries(materialId);
    } catch (error) {
      console.error("Error al generar contenido:", error);
    }
  }, [allMaterials, processMaterialMutation, loadFlashcardsAndSummaries]);
  
  const changeFlashcardDifficulty = useCallback(async (flashcardId: string, difficulty: "easy" | "medium" | "hard") => {
    try {
      await updateFlashcardMutation.mutateAsync({ 
        id: flashcardId, 
        data: { difficulty } 
      });
    } catch (error) {
      console.error("Error al actualizar la dificultad:", error);
    }
  }, [updateFlashcardMutation]);
  
  const viewFile = useCallback((fileUrl?: string | null) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("Intento de ver archivo sin URL");
    }
  }, []);
  
  // Estado de carga combinado
  const isProcessing = useMemo(() => 
    processMaterialMutation.isPending, 
    [processMaterialMutation.isPending]
  );
  
  // Único objeto memoizado para el return
  return {
    // Datos
    materials: filteredMaterials,
    selectedMaterial,
    materialFlashcards,
    materialSummaries,
    
    // Estado UI
    searchTerm,
    activeTab,
    
    // Estado de carga
    isProcessing, 
    uploadProgress: 0, // No disponible directamente en React Query
    materialsLoading,
    error: materialsError instanceof Error ? materialsError.message : 
           typeof materialsError === 'string' ? materialsError : null,
    
    // Setters
    setSelectedMaterial,
    setSearchTerm,
    setActiveTab,
    
    // Acciones
    loadFlashcardsAndSummaries,
    deleteMaterial,
    generateContent,
    viewFile,
    changeFlashcardDifficulty
  };
}; 