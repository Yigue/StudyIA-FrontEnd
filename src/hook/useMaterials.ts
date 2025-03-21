import { useMaterialsStore } from "../store/materials.store";

export const useMaterials = () => {
  const { materials, currentMaterial, isLoading, error, uploadProgress } = useMaterialsStore();
  
  return {
    materials,
    currentMaterial,
    isLoading,
    error,
    uploadProgress,
  };
};

export const useMaterialsActions = () => {
  const { 
    getAllMaterials,
    getMaterialById,
    uploadMaterial,
    uploadAndProcess,
    deleteMaterial,
    setCurrentMaterial,
    clearError 
  } = useMaterialsStore();
  
  return {
    getAllMaterials,
    getMaterialById,
    uploadMaterial,
    uploadAndProcess,
    deleteMaterial,
    setCurrentMaterial,
    clearError,
  };
};

export const useMaterialsStatus = () => useMaterialsStore(state => ({
  isLoading: state.isLoading,
  uploadProgress: state.uploadProgress
}));
