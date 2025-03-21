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
  getAllSummaries: (token: string) => Promise<void>;
  getSummaryById: (id: string, token: string) => Promise<void>;
  getSummariesByMaterial: (materialId: string, token: string) => Promise<void>;
  createSummary: (summary: summaryCreatedDTO, token: string) => Promise<void>;
  updateSummary: (id: string, summary: summaryCreatedDTO, token: string) => Promise<void>;
  deleteSummary: (id: string, token: string) => Promise<void>;
  setCurrentSummary: (summary: Summary | null) => void;
  clearError: () => void;
}

export const useSummariesStore = create<SummariesStore>((set) => ({
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,

  getAllSummaries: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getAllSummaries(token);
      set({ summaries: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading summaries' });
    } finally {
      set({ isLoading: false });
    }
  },

  getSummaryById: async (id, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getSummaryById(id, token);
      set({ currentSummary: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading summary' });
    } finally {
      set({ isLoading: false });
    }
  },

  getSummariesByMaterial: async (materialId, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.getSummariesByMaterial(materialId, token);
      set({ summaries: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading material summaries' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSummary: async (summary, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.createSummary(summary, token);
      set(state => ({
        summaries: [...state.summaries, response.data]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error creating summary' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSummary: async (id, summary, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await summaryService.updateSummary(id, summary, token);
      set(state => ({
        summaries: state.summaries.map(s => s.id === id ? response.data : s),
        currentSummary: state.currentSummary?.id === id ? response.data : state.currentSummary
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating summary' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSummary: async (id, token) => {
    try {
      set({ isLoading: true, error: null });
      await summaryService.deleteSummary(id, token);
      set(state => ({
        summaries: state.summaries.filter(s => s.id !== id),
        currentSummary: state.currentSummary?.id === id ? null : state.currentSummary
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting summary' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSummary: (summary) => set({ currentSummary: summary }),
  clearError: () => set({ error: null })
}));
