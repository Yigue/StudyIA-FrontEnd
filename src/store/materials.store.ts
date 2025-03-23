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
  generatingContent: boolean;

  // Actions
  getAllMaterials: () => Promise<void>;
  getMaterialById: (id: string) => Promise<void>;
  uploadMaterial: (material: StudyMaterialDTO) => Promise<StudyMaterial | null>;
  uploadAndProcess: (material: StudyMaterialDTO) => Promise<StudyMaterial | null>;
  generateSummary: (id: string) => Promise<void>;
  generateFlashcard: (id: string) => Promise<void>;
  setCurrentMaterial: (material: StudyMaterial | null) => void;
  clearError: () => void;
}

export const useMaterialsStore = create<MaterialsStore>((set) => ({
  materials: [],
  currentMaterial: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
  generatingContent: false,

  getAllMaterials: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await materialService.getAllStudyMaterials();
      set({ materials: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar los materiales' });
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
      set({ error: error instanceof Error ? error.message : 'Error al cargar el material' });
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
        currentMaterial: response.data,
        uploadProgress: 100
      }));
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al subir el material' });
      return null;
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
        currentMaterial: response.data,
        uploadProgress: 100
      }));
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al procesar el material' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  generateSummary: async (id) => {
    try {
      set({ generatingContent: true, error: null });
      await materialService.generateSummary(id);
      // Actualizar el material después de generar el resumen
      const response = await materialService.getMaterialById(id);
      set({ 
        currentMaterial: response.data,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al generar el resumen' });
    } finally {
      set({ generatingContent: false });
    }
  },

  generateFlashcard: async (id) => {
    try {
      set({ generatingContent: true, error: null });
      await materialService.generateFlashcard(id);
      // Actualizar el material después de generar las flashcards
      const response = await materialService.getMaterialById(id);
      set({ 
        currentMaterial: response.data,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al generar las flashcards' });
    } finally {
      set({ generatingContent: false });
    }
  },

  setCurrentMaterial: (material) => set({ currentMaterial: material }),
  clearError: () => set({ error: null })
}));
