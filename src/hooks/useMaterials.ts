import { useEffect, useRef } from 'react';
import { useMaterialStore } from '../store/materials.store';
import { Params } from '../types/api';

/**
 * Hook para acceder y manipular materiales de estudio.
 * Implementa selección optimizada y memoización para evitar renderizados innecesarios.
 */
export const useMaterials = () => {
  // Referencia para controlar si ya se ha hecho la carga inicial
  const initialLoadDone = useRef(false);

  // Selectores optimizados de datos del store
  const state = useMaterialStore();
  const { 
    entities,
    ids, 
    currentMaterialId, 
    status, 
    pagination,
  } = state;

  // Acciones desde el store
  const actions = {
    fetchMaterials: state.fetchMaterials,
    getMaterialById: state.getMaterialById,
    createMaterial: state.createMaterial,
    processMaterial: state.processMaterial,
    deleteMaterial: state.deleteMaterial,
    setCurrentMaterial: state.setCurrentMaterial,
    clearError: state.clearError,
  };

  // Datos derivados sin memoización
  const materials = ids.map((id) => entities[id]).filter(Boolean);
  const currentMaterial = currentMaterialId ? entities[currentMaterialId] : null;

  // Funciones simples sin useCallback
  const fetchMaterials = async (params?: Params) => {
    try {
      await actions.fetchMaterials(params);
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      throw error;
    }
  };

  const getMaterialById = async (id: string) => {
    await actions.getMaterialById(id);
    return entities[id] || null;
  };

  // Efecto para cargar datos iniciales una sola vez con seguridad adicional
  useEffect(() => {
    // Evitar bucles infinitos y cargas múltiples
    if (initialLoadDone.current) {
      return;
    }

    // Solo cargar si no hay datos o si han pasado más de 5 minutos
    const shouldFetch = 
      ids.length === 0 || 
      !status.lastFetch || 
      (Date.now() - status.lastFetch > 5 * 60 * 1000);
    
    if (shouldFetch) {
      fetchMaterials().then(() => {
        initialLoadDone.current = true;
      });
    } else {
      initialLoadDone.current = true;
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias para evitar bucles

  return {
    // Datos
    materials,
    currentMaterial,
    
    // Estado
    loading: {
      isLoading: status.isLoading,
      uploadProgress: status.uploadProgress,
      processingStatus: status.processingStatus,
    },
    error: status.error,
    pagination,
    
    // Acciones
    fetchMaterials,
    getMaterialById,
    createMaterial: actions.createMaterial,
    processMaterial: actions.processMaterial,
    deleteMaterial: actions.deleteMaterial,
    setCurrentMaterial: actions.setCurrentMaterial,
    clearError: actions.clearError,
    
    // Utilidades
    hasMorePages: pagination.currentPage < pagination.totalPages,
    canGoToNextPage: pagination.currentPage < pagination.totalPages,
    canGoToPreviousPage: pagination.currentPage > 1,
  };
};

// Hook para verificar si los datos están "frescos"
export const useMaterialsStatus = () => {
  const status = useMaterialStore(state => state.status);
  const clearError = useMaterialStore(state => state.clearError);

  return {
    isLoading: status.isLoading,
    uploadProgress: status.uploadProgress,
    processingStatus: status.processingStatus,
    error: status.error,
    clearError,
    lastFetched: status.lastFetch,
    isFresh: Boolean(status.lastFetch && (Date.now() - status.lastFetch) < 5 * 60 * 1000) // 5 minutos
  };
};

// Hook para acceder al material actual
export const useCurrentMaterial = () => {
  const entities = useMaterialStore(state => state.entities);
  const currentMaterialId = useMaterialStore(state => state.currentMaterialId);
  const setCurrentMaterial = useMaterialStore(state => state.setCurrentMaterial);

  const currentMaterial = currentMaterialId ? entities[currentMaterialId] : null;

  return { 
    currentMaterial, 
    setCurrentMaterial 
  };
};
