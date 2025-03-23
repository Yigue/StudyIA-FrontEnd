import { create } from 'zustand';
import { Summary } from '../types';
import { summaryCreatedDTO } from '../types/summary/summaryRequest';
import * as summaryService from '../services/summary/summaryService';

interface SummariesStore {
  summaries: Summary[];
  currentSummary: Summary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getAllSummaries: () => Promise<void>;
  getSummaryById: (id: string) => Promise<void>;
  getSummariesByMaterial: (materialId: string) => Promise<void>;
  createSummary: (summary: summaryCreatedDTO) => Promise<void>;
  updateSummary: (id: string, summary: summaryCreatedDTO) => Promise<void>;
  setCurrentSummary: (summary: Summary | null) => void;
  clearError: () => void;
}

export const useSummariesStore = create<SummariesStore>((set) => ({
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,

  getAllSummaries: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getAllSummaries();
      set({ summaries: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar los resúmenes' });
    } finally {
      set({ isLoading: false });
    }
  },

  getSummaryById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getSummaryById(id);
      set({ currentSummary: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar el resumen' });
    } finally {
      set({ isLoading: false });
    }
  },

  getSummariesByMaterial: async (materialId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getSummariesByMaterial(materialId);
      set({ summaries: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar los resúmenes del material' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSummary: async (summary) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.createSummary(summary);
      set(state => ({
        summaries: [...state.summaries, response.data]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear el resumen' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSummary: async (id, summary) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.updateSummary(id, summary);
      set(state => ({
        summaries: state.summaries.map(s => s.id === id ? response.data : s),
        currentSummary: state.currentSummary?.id === id ? response.data : state.currentSummary
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al actualizar el resumen' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSummary: (summary) => set({ currentSummary: summary }),
  clearError: () => set({ error: null })
}));
