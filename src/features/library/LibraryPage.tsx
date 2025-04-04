import React, { useState, useEffect } from "react";
import { MaterialsList } from "./components/MaterialsList";
import LibraryLayout from "./components/layout/LibraryLayout";
import { useMaterials } from "../../hooks/useMaterials";
import { useFlashcards } from "../../hooks/useFlashcards";
import { useSummaries } from "../../hooks/useSummaries";
import { StudyMaterial } from "../../types/studyMaterial/studyMaterial";
import TabsLibrary from "./components/TabsLibrary";

// Componentes para el sistema de pestañas

export const LibraryPage: React.FC = () => {
  // Estado para el material seleccionado
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterial | null>(null);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("material");

  // Estado para errores
  const [error, setError] = useState<string | null>(null);

  // Obtener datos y funciones de los hooks actualizados
  const {
    materials,
    fetchMaterials,
    loading: materialsLoading,
  } = useMaterials();

  const {
    flashcards,
    updateFlashcard,
    loading: flashcardsLoading,
  } = useFlashcards();

  const {
    summaries,
    loading: summariesLoading,
  } = useSummaries();

  // Función para refrescar manualmente los materiales
  const handleRefreshMaterials = () => {
    fetchMaterials();
  };



  // Obtener flashcards del material seleccionado
  const materialFlashcards = selectedMaterial
    ? flashcards.filter((f) => f.material_id === selectedMaterial.id)
    : [];

  // Obtener resúmenes del material seleccionado
  const materialSummaries = selectedMaterial
    ? summaries.filter((s) => s.material_id === selectedMaterial.id)
    : [];

  // Manejar el cambio de dificultad de flashcard
  const handleDifficultyChange = async (
    flashcardId: string,
    difficulty: number
  ) => {
    try {
      await updateFlashcard(flashcardId, {
        difficulty:
          difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard",
      });
    } catch (error) {
      console.error("Error al actualizar la dificultad:", error);
    }
  };

  // Manejar selección de material
  const handleSelectMaterial = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setActiveTab("material"); // Mostrar detalles del material al seleccionar
  };

  // Filtrar materiales basado en el término de búsqueda
  const filteredMaterials = searchTerm.trim()
    ? materials.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.content &&
            m.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : materials;

  // Determinar si estamos cargando
  const isLoading =
    materialsLoading.isLoading ||
    flashcardsLoading.isLoading ||
    summariesLoading.isLoading;

  // Contenido principal cuando hay un material seleccionado

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
      main={
        <TabsLibrary
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedMaterial={selectedMaterial}
          materialFlashcards={materialFlashcards}
          materialSummaries={materialSummaries}
          handleDifficultyChange={handleDifficultyChange}
        />
      }
    />
  );
};
