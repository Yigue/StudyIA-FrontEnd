import { create } from 'zustand';
import { Tag } from '../types';
import { tagDTO } from '../types/tag/tagRequest';
import * as tagService from '../services/tag/tagService';

interface TagsStore {
  tags: Tag[];
  currentTag: Tag | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getAllTags: (token: string) => Promise<void>;
  createTag: (tag: tagDTO, token: string) => Promise<void>;
  updateTag: (id: string, tag: tagDTO, token: string) => Promise<void>;
  deleteTag: (id: string, token: string) => Promise<void>;
  setCurrentTag: (tag: Tag | null) => void;
  clearError: () => void;
}

export const useTagsStore = create<TagsStore>((set) => ({
  tags: [],
  currentTag: null,
  isLoading: false,
  error: null,

  getAllTags: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tagService.getAllTags(token);
      set({ tags: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error loading tags' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTag: async (tagData, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tagService.createTag(tagData, token);
      set(state => ({
        tags: [...state.tags, response.data]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error creating tag' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTag: async (id, tagData, token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tagService.updateTag(id, tagData, token);
      set(state => ({
        tags: state.tags.map(t => t.id === id ? response.data : t),
        currentTag: state.currentTag?.id === id ? response.data : state.currentTag
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating tag' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTag: async (id, token) => {
    try {
      set({ isLoading: true, error: null });
      await tagService.deleteTag(id, token);
      set(state => ({
        tags: state.tags.filter(t => t.id !== id),
        currentTag: state.currentTag?.id === id ? null : state.currentTag
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting tag' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentTag: (tag) => set({ currentTag: tag }),
  clearError: () => set({ error: null })
}));
