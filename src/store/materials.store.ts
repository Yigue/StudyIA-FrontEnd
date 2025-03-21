import { create } from 'zustand';
import { StudyMaterial } from '../types';
import { StudyMaterialDTO } from '../types/studyMaterial/studyMaterialRequest';
import * as materialService from '../services/studyMaterial/studyMaterialService';

interface MaterialsStore {
  materials: StudyMaterial[];
  currentMaterial: StudyMaterial | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;

  // Actions
  getAllMaterials: () => Promise<void>;
  getMaterialById: (id: string) => Promise<void>;
  uploadMaterial: (material: StudyMaterialDTO) => Promise<void>;
  uploadAndProcess: (material: StudyMaterialDTO) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  setCurrentMaterial: (material: StudyMaterial | null) => void;
  clearError: () => void;
}

export const useMaterialsStore = create<MaterialsStore>((set) => ({
  materials: [],
  currentMaterial: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,

  getAllMaterials: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await materialService.getAllStudyMaterials();
      set({ materials: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading materials' });
    } finally {
      set({ isLoading: false });
    }
  },

  getMaterialById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await materialService.getMaterialById(id);
      set({ currentMaterial: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading material' });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadMaterial: async (material) => {
    try {
      set({ isLoading: true, error: null, uploadProgress: 0 });
      const response = await materialService.uploadMaterial(material);
      set(state => ({
        materials: [...state.materials, response.data],
        uploadProgress: 100
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error uploading material' });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadAndProcess: async (material) => {
    try {
      set({ isLoading: true, error: null, uploadProgress: 0 });
      const response = await materialService.uploadAndProcess(material);
      set(state => ({
        materials: [...state.materials, response.data],
        uploadProgress: 100
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error processing material' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMaterial: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await materialService.deleteMaterial(id);
      set(state => ({
        materials: state.materials.filter(m => m.id !== id),
        currentMaterial: state.currentMaterial?.id === id ? null : state.currentMaterial
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting material' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentMaterial: (material) => set({ currentMaterial: material }),
  clearError: () => set({ error: null })
}));
