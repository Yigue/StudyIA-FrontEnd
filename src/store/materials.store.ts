import { create } from "zustand";
import {
  MaterialActions,
  StudyMaterial,
} from "../types/studyMaterial/studyMaterial";
import {
  TextMaterialDTO,
  FileMaterialDTO,
} from "../types/studyMaterial/studyMaterialRequest";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import {
  getAllStudyMaterials,
  getMaterialById,
  createTextMaterial,
  createFileMaterial,
  generateSummary,
  generateFlashcards,
  deleteMaterial,
} from "../services/studyMaterial/studyMaterialService";
import { CacheManager } from "../services/cache/cacheManager";

// Definición de tipos
interface Meta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface MaterialState {
  entities: Record<string, StudyMaterial>;
  ids: string[];
  currentMaterialId: string | null;
  status: {
    isLoading: boolean;
    lastFetch: number;
    error: string | null;
    uploadProgress: number;
    processingStatus: "pending" | "completed" | "failed" | null;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  cache: CacheManager<{
    entities: Record<string, StudyMaterial>;
    ids: string[];
    meta: Meta;
  }>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Creación del store con slices para mejor organización
export const useMaterialStore = create<MaterialState & MaterialActions>()(
  devtools(
    immer((set, get) => ({
      // Estado inicial
      entities: {},
      ids: [],
      currentMaterialId: null,
      status: {
        isLoading: false,
        lastFetch: 0,
        error: null,
        uploadProgress: 0,
        processingStatus: null,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      },
      cache: new CacheManager(CACHE_TTL),

      // Acciones de carga
      fetchMaterials: async (params) => {
        const cacheKey = get().cache.generateKey({});
        const cached = get().cache.get(cacheKey);
        
        // Usar caché si está disponible y no expirada
        if (cached && !get().cache.isExpired(cacheKey)) { 
          set((state) => {
            state.entities = { ...state.entities, ...cached.entities };
            state.ids = Array.from(new Set([...state.ids, ...cached.ids]));
            state.status.lastFetch = Date.now();
            state.pagination = cached.meta;
          });
          return;
        }

        // Iniciar carga
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });
        
        try {
          const { data, meta } = await getAllStudyMaterials(params);
         
      
          
          // Normalizar datos para almacenamiento eficiente
          const normalized = data.reduce(
            (acc, material) => {
              acc.entities[material.id] = material;
              acc.ids.push(material.id);
              return acc;
            },
            {
              entities: {} as Record<string, StudyMaterial>,
              ids: [] as string[],
            }
          );
         

          
          // Actualizar estado y caché
          set((state) => {
            // Crear nuevos objetos para asegurar la actualización
            const newEntities = { ...state.entities };
            Object.assign(newEntities, normalized.entities);
            
            const newIds = Array.from(new Set([...state.ids, ...normalized.ids]));
            
            state.entities = newEntities;
            state.ids = newIds;
            state.pagination = {
              currentPage: meta?.page || 1,
              totalPages: meta?.pages || 1,
              pageSize: meta?.limit || 10,
            };
            state.status.lastFetch = Date.now();
          });
          // Actualizar caché
          get().cache.set(cacheKey, {
            entities: normalized.entities,
            ids: normalized.ids,
            meta: {
              currentPage: meta?.page || 1,
              totalPages: meta?.pages || 1,
              pageSize: meta?.limit || 10,
            },
          });
        } catch (error) {
          // console.error("Error en fetchMaterials:", error);
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar los materiales";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      // Acción para obtener material individual
      getMaterialById: async (id: string) => {
        // Usar caché si ya tenemos el material
        if (get().entities[id]) {
          set((state) => {
            state.currentMaterialId = id;
          });
          return;
        }

        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          const { data: material } = await getMaterialById(id);
          if (!material) throw new Error("Material no encontrado");

          set((state) => {
            state.entities[id] = material;
            state.currentMaterialId = id;
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al cargar el material";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      // Acciones de creación
      createMaterial: async (material, options) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
          state.status.uploadProgress = 0;
        });

        try {
          if (options.type === "text") {
            const newMaterial = await createTextMaterial(
              material as TextMaterialDTO
            );
            if (!newMaterial) throw new Error("Error al crear el material");
            set((state) => {
              state.entities[newMaterial.data!.id] = newMaterial.data!;
              state.ids.push(newMaterial.data!.id);
              state.currentMaterialId = newMaterial.data!.id;
              state.status.uploadProgress = 100;
              state.cache.invalidate(/.*/); // Invalidar toda la caché
            });
            return newMaterial.data!;
          }
          const newMaterial = await createFileMaterial(
            material as FileMaterialDTO
          );
          if (!newMaterial) throw new Error("Error al crear el material");
          set((state) => {
            state.entities[newMaterial.data!.id] = newMaterial.data!;
            state.ids.push(newMaterial.data!.id);
            state.currentMaterialId = newMaterial.data!.id;
            state.status.uploadProgress = 100;
            state.cache.invalidate(/.*/); // Invalidar toda la caché
          });
          return newMaterial.data!;
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al crear el material de texto";
          });
          return null;
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },
      
      // Acciones de procesamiento 
      processMaterial: async (material, options) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
          state.status.uploadProgress = 0;
          state.status.processingStatus = "pending";
        });

        try {
          const summary = options.generate_summary
            ? await generateSummary(material.id, options.summary_options)
            : null;

          const flashcards = options.generate_flashcards
            ? await generateFlashcards(material.id, options.flashcards_options)
            : null;

          set((state) => {
            state.entities[material.id] = material;
            state.ids.push(material.id);
            state.currentMaterialId = material.id;
            state.status.uploadProgress = 100;
            state.status.processingStatus = "completed";
            state.cache.invalidate(/.*/); // Invalidar toda la caché
          });

          return { summary: summary?.data || null, flashcards: flashcards?.data || null };
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al procesar el material";
            state.status.processingStatus = "failed";
          });
          return { summary: null, flashcards: null };
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },
      
      // Acciones de eliminación
      deleteMaterial: async (id) => {
        set((state) => {
          state.status.isLoading = true;
          state.status.error = null;
        });

        try {
          await deleteMaterial(id);
          set((state) => {
            delete state.entities[id];
            state.ids = state.ids.filter(
              (materialId: string) => materialId !== id
            );
            if (state.currentMaterialId === id) {
              state.currentMaterialId = null;
            }
            state.cache.invalidate(/.*/); // Invalidar toda la caché
          });
        } catch (error) {
          set((state) => {
            state.status.error =
              error instanceof Error
                ? error.message
                : "Error al eliminar el material";
          });
        } finally {
          set((state) => {
            state.status.isLoading = false;
          });
        }
      },

      // Acciones de UI
      setCurrentMaterial: (material: StudyMaterial) => {
        set((state) => {
          state.currentMaterialId = material.id;
        });
      },

      // Utilidades
      clearError: () => {
        set((state) => {
          state.status.error = null;
        });
      },
    })),
    
    { name: "MaterialStore" }
  )
);

// Selectores optimizados para evitar re-renderizados innecesarios
export const selectAllMaterials = (state: MaterialState) => 
  state.ids.map(id => state.entities[id]);

export const selectCurrentMaterial = (state: MaterialState) => 
  state.currentMaterialId ? state.entities[state.currentMaterialId] : null;

export const selectPagination = (state: MaterialState) => 
  state.pagination;

export const selectLoadingStatus = (state: MaterialState) => ({
  isLoading: state.status.isLoading,
  uploadProgress: state.status.uploadProgress,
  processingStatus: state.status.processingStatus,
});
