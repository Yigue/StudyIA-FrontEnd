import { useMaterialsStore } from "../store/materials.store";
import { useMemo } from "react";

export const useMaterials = () => {
  const { 
    materials, 
    currentMaterial, 
    isLoading, 
    error, 
    uploadProgress,
    generatingContent 
  } = useMaterialsStore();
  
  return {
    materials,
    currentMaterial,
    isLoading,
    error,
    uploadProgress,
    generatingContent,
  };
};

export const useMaterialsActions = () => {
  const { 
    getAllMaterials,
    getMaterialById,
    uploadMaterial,
    uploadAndProcess,
    generateSummary,
    generateFlashcard,
    setCurrentMaterial,
    clearError 
  } = useMaterialsStore();
  
  return {
    getAllMaterials,
    getMaterialById,
    uploadMaterial,
    uploadAndProcess,
    generateSummary,
    generateFlashcard,
    setCurrentMaterial,
    clearError,
  };
};

export const useMaterialsStatus = () => {
  const isLoading = useMaterialsStore(state => state.isLoading);
  const uploadProgress = useMaterialsStore(state => state.uploadProgress);
  const generatingContent = useMaterialsStore(state => state.generatingContent);
  
  return useMemo(() => ({
    isLoading,
    uploadProgress,
    generatingContent
  }), [isLoading, uploadProgress, generatingContent]);
};
