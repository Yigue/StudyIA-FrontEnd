import { useState, useMemo, useCallback } from "react";
import { useMaterialStore } from "../store/materials.store";
import { Params } from "../types/api";

/**
 * Hook para acceder y manipular materiales de estudio.
 * Implementa selección optimizada y memoización para evitar renderizados innecesarios.
 */
export const useMaterials = () => {
  // Usar selectores específicos con shallow comparison
  const entities = useMaterialStore((state) => state.entities);
  const ids = useMaterialStore((state) => state.ids);
  const currentMaterialId = useMaterialStore(
    (state) => state.currentMaterialId
  );
  const status = useMaterialStore((state) => state.status);
  const pagination = useMaterialStore((state) => state.pagination);

  // Acciones del store
  const fetchMaterialsAction = useMaterialStore(
    (state) => state.fetchMaterials
  );
  const getMaterialByIdAction = useMaterialStore(
    (state) => state.getMaterialById
  );
  const createMaterial = useMaterialStore((state) => state.createMaterial);
  const processMaterial = useMaterialStore((state) => state.processMaterial);
  const deleteMaterial = useMaterialStore((state) => state.deleteMaterial);
  const setCurrentMaterial = useMaterialStore(
    (state) => state.setCurrentMaterial
  );
  const clearError = useMaterialStore((state) => state.clearError);

  // Estado local para gestionar errores adicionales
  const [error, setError] = useState<string | null>(null);

  // Datos derivados mediante memoización
  const materials = useMemo(() => {
    return ids.map((id) => entities[id]).filter(Boolean);
  }, [ids, entities]);

  const currentMaterial = useMemo(
    () => (currentMaterialId ? entities[currentMaterialId] : null),
    [currentMaterialId, entities]
  );

  // Métodos envueltos en useCallback para evitar re-renderizados innecesarios
  const fetchMaterials = useCallback(
    async (params?: Params) => {
      try {
        await fetchMaterialsAction(params);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error al cargar los materiales");
      }
    },
    [fetchMaterialsAction]
  );

  const getMaterialById = useCallback(
    async (id: string) => {
      await getMaterialByIdAction(id);
      return entities[id] || null;
    },
    [getMaterialByIdAction, entities]
  );

  // Propiedades derivadas memoizadas
  const paginationHelpers = useMemo(
    () => ({
      hasMorePages: pagination.currentPage < pagination.totalPages,
      canGoToNextPage: pagination.currentPage < pagination.totalPages,
      canGoToPreviousPage: pagination.currentPage > 1,
    }),
    [pagination]
  );

  const loadingStatus = useMemo(
    () => ({
      isLoading: status.isLoading,
      uploadProgress: status.uploadProgress,
      processingStatus: status.processingStatus,
    }),
    [status]
  );

  return {
    // Datos principales
    materials,
    currentMaterial,

    // Estado de carga
    loading: loadingStatus,
    error: error || status.error,

    // Información de paginación
    pagination,
    ...paginationHelpers,

    // Acciones
    fetchMaterials,
    getMaterialById,
    createMaterial,
    processMaterial,
    deleteMaterial,
    setCurrentMaterial,
    clearError,
  };
};
