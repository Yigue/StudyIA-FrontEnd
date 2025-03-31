import { create } from "zustand";
import { Flashcard } from "../types/flashcards/flashcards";
import {
  FlashcardCreateDTO,
  FlashcardUpdateDTO,
  FlashcardReviewDTO,
} from "../types/flashcards/flashcardsRequest";
import * as flashcardService from "../services/flashcards/flashcardService";
import { devtools } from "zustand/middleware";
import { CacheManager } from "../services/cache/cacheManager";
import { immerMiddleware } from "./utils/immer";

interface Meta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface FlashcardState {
  entities: Record<string, Flashcard>;
  ids: string[];
  currentFlashcardId: string | null;
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
    entities: Record<string, Flashcard>;
    ids: string[];
    meta: Meta;
  }>;
  materialCache: CacheManager<{
    entities: Record<string, Flashcard>;
    ids: string[];
  }>;
  reviewCache: CacheManager<{
    entities: Record<string, Flashcard>;
    ids: string[];
  }>;
}

interface FlashcardActions {
  getAllFlashcards: (params?: {
    page?: number;
    limit?: number;
    difficulty?: "easy" | "medium" | "hard";
    tags?: string;
    archived?: boolean;
  }) => Promise<void>;
  getFlashcardById: (id: string) => Promise<void>;
  getFlashcardsByMaterial: (materialId: string) => Promise<void>;
  getFlashcardsForReview: (params?: {
    limit?: number;
    difficulty?: "easy" | "medium" | "hard";
    tags?: string;
  }) => Promise<void>;
  getFlashcardsForReviewMaterial: (
    materialId: string,
    params?: {
      limit?: number;
      difficulty?: "easy" | "medium" | "hard";
    }
  ) => Promise<void>;
  reviewFlashcard: (id: string, review: FlashcardReviewDTO) => Promise<void>;
  createFlashcard: (flashcard: FlashcardCreateDTO) => Promise<Flashcard | null>;
  updateFlashcard: (id: string, flashcard: FlashcardUpdateDTO) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  toggleArchiveFlashcard: (id: string) => Promise<void>;
  setCurrentFlashcard: (id: string | null) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  filterByDifficulty: (difficulty: "easy" | "medium" | "hard" | null) => Flashcard[];
  searchFlashcards: (searchTerm: string) => Flashcard[];
  refreshInBackground: () => Promise<void>;
}

// Constante para controlar el tiempo de caché (5 minutos en milisegundos)
const CACHE_TTL = 5 * 60 * 1000;

export const useFlashcardsStore = create<FlashcardState & FlashcardActions>()(
  devtools(
    immerMiddleware((set, get) => ({
      entities: {},
      ids: [],
      currentFlashcardId: null,
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
      reviewCache: new CacheManager(CACHE_TTL),

      getAllFlashcards: async (params) => {
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
          const { data, meta } = await flashcardService.getAllFlashcards(params);
          if (!data) throw new Error("No se recibieron datos válidos");

          const flashcardsArray = Array.isArray(data) ? data : [data];
          const normalized = flashcardsArray.reduce(
            (acc, flashcard) => {
              acc.entities[flashcard.id] = flashcard;
              acc.ids.push(flashcard.id);
              return acc;
            },
            { entities: {} as Record<string, Flashcard>, ids: [] as string[] }
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
                : "Error al cargar las flashcards";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getFlashcardById: async (id) => {
        // Si ya existe en nuestro estado
        if (get().entities[id]) {
          set((state) => {
            state.currentFlashcardId = id;
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.getFlashcardById(id);
          if (!data) throw new Error("Flashcard no encontrada");

          set((state) => {
            state.entities[id] = data;
            state.currentFlashcardId = id;
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar la flashcard";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getFlashcardsByMaterial: async (materialId) => {
        const cacheKey = materialId;
        const cached = get().materialCache.get(cacheKey);

        if (cached && !get().materialCache.isExpired(cacheKey)) {
          set((state) => {
            state.entities = { ...state.entities, ...cached.entities };
            state.ids = cached.ids;
            state.status.lastFetch = Date.now();
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.getFlashcardsByMaterial(materialId);
          if (!data) throw new Error("No se recibieron datos válidos");

          const flashcardsArray = Array.isArray(data) ? data : [data];
          const normalized = flashcardsArray.reduce(
            (acc, flashcard) => {
              acc.entities[flashcard.id] = flashcard;
              acc.ids.push(flashcard.id);
              return acc;
            },
            { entities: {} as Record<string, Flashcard>, ids: [] as string[] }
          );

          set((state) => {
            state.entities = { ...state.entities, ...normalized.entities };
            state.ids = normalized.ids;
            state.status.lastFetch = Date.now();
            state.materialCache.set(cacheKey, {
              entities: normalized.entities,
              ids: normalized.ids,
            });
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar las flashcards del material";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getFlashcardsForReview: async (params) => {
        const cacheKey = get().reviewCache.generateKey(params || {});
        const cached = get().reviewCache.get(cacheKey);

        if (cached && !get().reviewCache.isExpired(cacheKey)) {
          set((state) => {
            state.entities = { ...state.entities, ...cached.entities };
            state.ids = cached.ids;
            state.status.lastFetch = Date.now();
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.getFlashcardsForReview(params);
          if (!data) throw new Error("No se recibieron datos válidos");

          const flashcardsArray = Array.isArray(data) ? data : [data];
          const normalized = flashcardsArray.reduce(
            (acc, flashcard) => {
              acc.entities[flashcard.id] = flashcard;
              acc.ids.push(flashcard.id);
              return acc;
            },
            { entities: {} as Record<string, Flashcard>, ids: [] as string[] }
          );

          set((state) => {
            state.entities = { ...state.entities, ...normalized.entities };
            state.ids = normalized.ids;
            state.status.lastFetch = Date.now();
            state.reviewCache.set(cacheKey, {
              entities: normalized.entities,
              ids: normalized.ids,
            });
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar las flashcards para revisar";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      getFlashcardsForReviewMaterial: async (materialId, params) => {
        const cacheKey = `review_${materialId}_${get().reviewCache.generateKey(params || {})}`;
        const cached = get().reviewCache.get(cacheKey);

        if (cached && !get().reviewCache.isExpired(cacheKey)) {
          set((state) => {
            state.entities = { ...state.entities, ...cached.entities };
            state.ids = cached.ids;
            state.status.lastFetch = Date.now();
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.getFlashcardsForReviewMaterial(
            materialId,
            params
          );
          if (!data) throw new Error("No se recibieron datos válidos");

          const flashcardsArray = Array.isArray(data) ? data : [data];
          const normalized = flashcardsArray.reduce(
            (acc, flashcard) => {
              acc.entities[flashcard.id] = flashcard;
              acc.ids.push(flashcard.id);
              return acc;
            },
            { entities: {} as Record<string, Flashcard>, ids: [] as string[] }
          );

          set((state) => {
            state.entities = { ...state.entities, ...normalized.entities };
            state.ids = normalized.ids;
            state.status.lastFetch = Date.now();
            state.reviewCache.set(cacheKey, {
              entities: normalized.entities,
              ids: normalized.ids,
            });
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar las flashcards para revisar del material";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      reviewFlashcard: async (id, review) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.reviewFlashcard(id, review);
          if (!data) throw new Error("Error al revisar la flashcard");

          set((state) => {
            state.entities[id] = {
              ...state.entities[id],
              lastReviewed: data.lastReviewed,
            };
            
            // Invalidar cachés relevantes
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
            state.reviewCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al revisar la flashcard";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      createFlashcard: async (flashcard) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.createFlashcard(flashcard);
          if (!data) throw new Error("Error al crear la flashcard");

          set((state) => {
            state.entities[data.id] = data;
            state.ids.push(data.id);
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
            state.reviewCache.invalidate(/.*/);
          });
          
          return data;
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al crear la flashcard";
          });
          return null;
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      updateFlashcard: async (id, flashcard) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.updateFlashcard(id, flashcard);
          if (!data) throw new Error("Error al actualizar la flashcard");

          set((state) => {
            state.entities[id] = data;
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
            state.reviewCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al actualizar la flashcard";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      deleteFlashcard: async (id) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          await flashcardService.deleteFlashcard(id);

          set((state) => {
            delete state.entities[id];
            state.ids = state.ids.filter((flashcardId: string) => flashcardId !== id);
            
            if (state.currentFlashcardId === id) {
              state.currentFlashcardId = null;
            }
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
            state.reviewCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al eliminar la flashcard";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      toggleArchiveFlashcard: async (id) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data } = await flashcardService.toggleArchiveFlashcard(id);
          if (!data) throw new Error("Error al archivar/desarchivar la flashcard");

          set((state) => {
            state.entities[id] = data;
            
            // Invalidar cachés
            state.cache.invalidate(/.*/);
            state.materialCache.invalidate(/.*/);
            state.reviewCache.invalidate(/.*/);
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al archivar/desarchivar la flashcard";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      setCurrentFlashcard: (id) => {
        set((state) => {
          state.currentFlashcardId = id;
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

      filterByDifficulty: (difficulty) => {
        if (!difficulty) return get().ids.map(id => get().entities[id]);
        
        return get().ids
          .map(id => get().entities[id])
          .filter(flashcard => flashcard.difficulty === difficulty);
      },

      searchFlashcards: (searchTerm) => {
        if (!searchTerm) return get().ids.map(id => get().entities[id]);
        
        const term = searchTerm.toLowerCase();
        return get().ids
          .map(id => get().entities[id])
          .filter(flashcard => 
            flashcard.question.toLowerCase().includes(term) ||
            flashcard.answer.toLowerCase().includes(term)
          );
      },

      refreshInBackground: async () => {
        try {
          const { data, meta } = await flashcardService.getAllFlashcards({
            page: get().pagination.currentPage,
            limit: get().pagination.pageSize
          });
          
          if (!data) return;

          const flashcardsArray = Array.isArray(data) ? data : [data];
          const normalized = flashcardsArray.reduce(
            (acc, flashcard) => {
              acc.entities[flashcard.id] = flashcard;
              acc.ids.push(flashcard.id);
              return acc;
            },
            { entities: {} as Record<string, Flashcard>, ids: [] as string[] }
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
          console.error('Error al actualizar flashcards en segundo plano:', error);
        }
      }
    }))
  )
);
