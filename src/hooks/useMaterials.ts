import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { 
  useMaterialsQuery,  
  useCreateMaterial, 
  useProcessMaterial, 
  useDeleteMaterial 
} from './queries/useMaterialsQuery';
import { StudyMaterial, CreateMaterialDTO, Params } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import * as materialService from '../services/studyMaterial/studyMaterialService';

/**
 * Hook optimizado para acceder y manipular materiales de estudio.
 * Utiliza React Query internamente pero mantiene la interfaz compatible con la versión Zustand.
 */
export const useMaterials = () => {
  const initialLoadDone = useRef(false);
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Queries
  const { data: materialsData, isLoading, error } = useMaterialsQuery();
  
  // Mutaciones
  const createMaterialMutation = useCreateMaterial();
  const processMaterialMutation = useProcessMaterial();
  const deleteMaterialMutation = useDeleteMaterial();

  // Datos derivados
  const materials = useMemo(() => materialsData || [], [materialsData]);
  
  const currentMaterial = useMemo(() => {
    if (!currentMaterialId) return null;
    return materials.find(m => m.id === currentMaterialId) || null;
  }, [currentMaterialId, materials]);

  // Funciones con interfaz compatible con la versión anterior
  const fetchMaterials = useCallback(async (params?: Params) => {
    await queryClient.invalidateQueries({ queryKey: ['materials', 'list'] });
    return materials;
  }, [queryClient, materials]);

  const getMaterialById = useCallback(async (id: string): Promise<StudyMaterial | null> => {
    if (!id) return null;
    
    try {
      const { data } = await queryClient.fetchQuery({
        queryKey: ['materials', 'detail', id],
        queryFn: () => materialService.getMaterialById(id)
      });
      return data;
    } catch (error) {
      console.error('Error al obtener material por ID:', error);
      return null;
    }
  }, [queryClient]);

  const createMaterial = useCallback(async (material: CreateMaterialDTO, options: any) => {
    const result = await createMaterialMutation.mutateAsync({ materialDto: material, options });
    return result.data;
  }, [createMaterialMutation]);

  const processMaterial = useCallback(async (material: StudyMaterial, options: ApiProcessingOptioss) => {
    const result = await processMaterialMutation.mutateAsync({ material, options });
    return result;
  }, [processMaterialMutation]);

  const deleteMaterial = useCallback(async (id: string) => {
    await deleteMaterialMutation.mutateAsync(id);
  }, [deleteMaterialMutation]);

  // Efecto para carga inicialcamvbio
  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchMaterials()
        .then(() => initialLoadDone.current = true)
        .catch(err => console.error("Error en carga inicial:", err));
    }
  }, [fetchMaterials]);

  // Simulación de estado de carga
  const loading = useMemo(() => ({
    isLoading,
    uploadProgress: null,
    processingStatus: null
  }), [isLoading]);

  // Simulación de paginación para compatibilidad
  const pagination = useMemo(() => ({
    currentPage: 1,
    totalPages: 1,
    totalItems: materials.length,
    limit: 10
  }), [materials.length]);

  const setCurrentMaterial = useCallback((id: string | null) => {
    setCurrentMaterialId(id);
  }, []);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query
  }, []);

  // Objeto de retorno - solo un useMemo principal
  return useMemo(() => ({
    // Datos
    materials,
    currentMaterial,
    
    // Estado
    loading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    pagination,
    
    // Acciones
    fetchMaterials,
    getMaterialById,
    createMaterial,
    processMaterial,
    deleteMaterial,
    setCurrentMaterial,
    clearError,
    
    // Utilidades
    hasMorePages: false,
    canGoToNextPage: false,
    canGoToPreviousPage: false,
  }), [
    materials, 
    currentMaterial, 
    loading, 
    error, 
    pagination,
    fetchMaterials,
    getMaterialById,
    createMaterial,
    processMaterial,
    deleteMaterial,
    setCurrentMaterial,
    clearError
  ]);
};

/**
 * Hook simplificado para verificar estado de materiales
 */
export const useMaterialsStatus = () => {
  const { isLoading, error } = useMaterialsQuery();

  return useMemo(() => ({
    isLoading,
    uploadProgress: null,
    processingStatus: null,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    clearError: () => {},
    lastFetched: Date.now(),
    isFresh: true
  }), [isLoading, error]);
};

/**
 * Hook para trabajar exclusivamente con el material actual
 */
export const useCurrentMaterial = () => {
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);
  const { data: materials = [] } = useMaterialsQuery();

  const currentMaterial = useMemo(() => {
    if (!currentMaterialId) return null;
    return materials.find(m => m.id === currentMaterialId) || null;
  }, [currentMaterialId, materials]);

  const setCurrentMaterial = useCallback((id: string | null) => {
    setCurrentMaterialId(id);
  }, []);

  return useMemo(() => ({ 
    currentMaterial, 
    setCurrentMaterial 
  }), [currentMaterial, setCurrentMaterial]);
};
