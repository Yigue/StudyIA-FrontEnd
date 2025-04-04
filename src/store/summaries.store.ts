import { create } from 'zustand';
import { Summary } from '../types/summary/summary';
import { SummaryCreateDTO, SummaryUpdateDTO } from '../types/summary/summaryRequest';
import * as summaryService from '../services/summary/summaryService';
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { CacheManager } from "../services/cache/cacheManager";

interface Meta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface SummaryState {
  entities: Record<string, Summary>;
  ids: string[];
  currentSummaryId: string | null;
  status: {
    isLoading: boolean;
    lastFetch: number | null;
    error: string | null;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  cache: CacheManager<{
    entities: Record<string, Summary>;
    ids: string[];
    meta: Meta;
  }>;
  materialCache: CacheManager<{
    entities: Record<string, Summary>;
    ids: string[];
  }>;
}

interface SummaryActions {
  getAllSummaries: (params?: {
    page?: number;
    limit?: number;
    materialId?: string;
  }) => Promise<void>;
  getSummaryById: (id: string) => Promise<void>;
  getSummariesByMaterial: (materialId: string) => Promise<Summary[]>;
  createSummary: (summary: SummaryCreateDTO) => Promise<Summary | null>;
  updateSummary: (id: string, summary: SummaryUpdateDTO) => Promise<void>;
  deleteSummary: (id: string) => Promise<void>;
  setCurrentSummary: (id: string | null) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  searchSummaries: (searchTerm: string) => Summary[];
  refreshInBackground: () => Promise<void>;
}

// Constante para controlar el tiempo de caché (5 minutos en milisegundos)
const CACHE_TTL = 5 * 60 * 1000;

export const useSummariesStore = create<SummaryState & SummaryActions>()(
  devtools(
    immer((set, get) => ({
      entities: {},
      ids: [],
      currentSummaryId: null,
      status: {
        isLoading: false,
        lastFetch: null,
        error: null,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      },
      cache: new CacheManager(CACHE_TTL),
      materialCache: new CacheManager(CACHE_TTL),

      getAllSummaries: async (params) => {
        const cacheKey = get().cache.generateKey(params || {});
        const cached = get().cache.get(cacheKey);

        if (cached && !get().cache.isExpired(cacheKey)) {
          set((state) => {
            state.entities = { ...state.entities, ...cached.entities };
            state.ids = Array.from(new Set([...state.ids, ...cached.ids]));
            state.status.lastFetch = Date.now();
            state.pagination = cached.meta;
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data, meta } = await summaryService.getAllSummaries(params);
          if (!data) throw new Error("No se recibieron datos válidos");

          const summariesArray = Array.isArray(data) ? data : [data];
          const normalized = summariesArray.reduce(
            (acc, summary) => {
              acc.entities[summary.id] = summary;
              acc.ids.push(summary.id);
              return acc;
            },
            { entities: {} as Record<string, Summary>, ids: [] as string[] }
          );

          set((state) => {
            state.entities = { ...state.entities, ...normalized.entities };
            state.ids = Array.from(new Set([...state.ids, ...normalized.ids]));
            state.pagination = {
              currentPage: meta?.page || 1,
              totalPages: meta?.pages || 1,
              pageSize: meta?.limit || 10,
            };
            state.status.lastFetch = Date.now();
            state.cache.set(cacheKey, {
              entities: normalized.entities,
              ids: normalized.ids,
              meta: {
                currentPage: meta?.page || 1,
                totalPages: meta?.pages || 1,
                pageSize: meta?.limit || 10,
              },
            });
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar los resúmenes";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getSummaryById: async (id) => {
        // Si ya existe en nuestro estado
        if (get().entities[id]) {
          set((state) => {
            state.currentSummaryId = id;
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await summaryService.getSummaryById(id);
          if (!data) throw new Error("Resumen no encontrado");

          set((state) => {
            state.entities[id] = data;
            state.currentSummaryId = id;
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar el resumen";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getSummariesByMaterial: async (materialId) => {
        try {
          const cacheKey = materialId;
          const cached = get().materialCache.get(cacheKey);
          if (cached && !get().materialCache.isExpired(cacheKey)) {
            const cachedSummaries = get()
              .ids.map((id) => cached.entities[id])
              .filter((summary) => summary.material_id === materialId);
            return cachedSummaries;
          }

          // Primero, filtrar las flashcards existentes por materialId
          const existingSummaries = get()
            .ids.map((id) => get().entities[id])
            .filter((summary) => summary.material_id === materialId);

          if (existingSummaries.length > 0) {
            return existingSummaries;
          }

       

          set((state) => {
            state.status.isLoading = true;
            state.status.error = null;
          });

          const { data } = await summaryService.getSummariesByMaterial(
            materialId
          );
          if (!data) throw new Error("No se recibieron datos válidos");
          return data;

        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar los resúmenes del material";
          });
          return [];
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      createSummary: async (summary) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await summaryService.createSummary(summary);
          if (!data) throw new Error("Error al crear el resumen");

          set((state) => {
            state.entities[data.id] = data;
            state.ids.push(data.id);
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
          });
          
          return data;
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al crear el resumen";
          });
          return null;
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      updateSummary: async (id, summary) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await summaryService.updateSummary(id, summary);
          if (!data) throw new Error("Error al actualizar el resumen");

          set((state) => {
            state.entities[id] = data;
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al actualizar el resumen";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      deleteSummary: async (id) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          await summaryService.deleteSummary(id);

          set((state) => {
            delete state.entities[id];
            state.ids = state.ids.filter((summaryId: string) => summaryId !== id);
            
            if (state.currentSummaryId === id) {
              state.currentSummaryId = null;
            }
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al eliminar el resumen";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      setCurrentSummary: (id) => {
        set((state) => {
          state.currentSummaryId = id;
        });
      },

      setCurrentPage: (page) => {
        set((state) => {
          state.pagination.currentPage = page;
        });
      },

      clearError: () => {
        set((state) => {
          state.status.error = null;
        });
      },

      searchSummaries: (searchTerm) => {
        if (!searchTerm) return get().ids.map(id => get().entities[id]);
        
        const term = searchTerm.toLowerCase();
        return get().ids
          .map(id => get().entities[id])
          .filter(summary => 
            summary.content.toLowerCase().includes(term)
          );
      },

      refreshInBackground: async () => {
        try {
          const { data, meta } = await summaryService.getAllSummaries({
            page: get().pagination.currentPage,
            limit: get().pagination.pageSize
          });
          
          if (!data) return;

          const summariesArray = Array.isArray(data) ? data : [data];
          const normalized = summariesArray.reduce(
            (acc, summary) => {
              acc.entities[summary.id] = summary;
              acc.ids.push(summary.id);
              return acc;
            },
            { entities: {} as Record<string, Summary>, ids: [] as string[] }
          );

          set((state) => {
            state.entities = { ...state.entities, ...normalized.entities };
            state.ids = Array.from(new Set([...normalized.ids]));
            state.pagination = {
              currentPage: meta?.page || state.pagination.currentPage,
              totalPages: meta?.pages || state.pagination.totalPages,
              pageSize: meta?.limit || state.pagination.pageSize,
            };
            state.status.lastFetch = Date.now();
          });
        } catch (error) {
          console.error('Error al actualizar resúmenes en segundo plano:', error);
        }
      }
    })),
    { name: "SummariesStore" }
  )
);
