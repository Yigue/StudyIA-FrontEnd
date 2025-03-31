import { create } from 'zustand';
import { Tag } from '../types/tag/tag';
import { TagCreateDTO, TagUpdateDTO } from '../types/tag/tagRequest';
import * as tagService from '../services/tag/tagService';

interface TagsStore {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;  // Timestamp de la última carga de datos

  // Actions
  getAllTags: () => Promise<void>;
  createTag: (tag: TagCreateDTO) => Promise<void>;
  updateTag: (id: string, tag: TagUpdateDTO) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  clearError: () => void;
  filterTags: (searchTerm: string) => Tag[];  // Método para filtrar tags localmente
  getTagById: (id: string) => Tag | undefined;  // Método para obtener un tag por su id localmente
}

// Constante para controlar el tiempo de caché (5 minutos en milisegundos)
const CACHE_DURATION = 5 * 60 * 1000;

export const useTagsStore = create<TagsStore>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  getAllTags: async () => {
    // Verificar si hay datos en caché y si son recientes
    const currentLastFetched = get().lastFetched;
    const shouldFetch = !currentLastFetched || 
                      (Date.now() - currentLastFetched > CACHE_DURATION) ||
                      get().tags.length === 0;
    
    if (shouldFetch) {
      try {
        set({ isLoading: true, error: null });
        const response = await tagService.getAllTags();
        set({ 
          tags: response.data || [], 
          lastFetched: Date.now() // Actualizar timestamp
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al cargar las etiquetas',
        });
      } finally {
        set({ isLoading: false });
      }
    } else {
      // Si los datos están en caché y son recientes, no hacemos una nueva solicitud
      console.log('Usando datos de etiquetas en caché');
    }
  },

  createTag: async (tag) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tagService.createTag(tag);
      set((state) => ({
        tags: [...state.tags, response.data as Tag],
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear la etiqueta',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTag: async (id, tag) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tagService.updateTag(id, tag);
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? (response.data as Tag) : t)),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar la etiqueta',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTag: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await tagService.deleteTag(id);
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar la etiqueta',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  // Método para filtrar tags localmente
  filterTags: (searchTerm: string) => {
    if (!searchTerm) return get().tags;
    
    const term = searchTerm.toLowerCase();
    return get().tags.filter((tag) => 
      tag.name.toLowerCase().includes(term)
    );
  },

  // Método para obtener un tag por su id localmente
  getTagById: (id: string) => {
    return get().tags.find(tag => tag.id === id);
  }
}));
