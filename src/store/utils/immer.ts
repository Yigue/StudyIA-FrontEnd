import { produce, Draft } from 'immer';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type ImmerStateCreator<T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []> =
  StateCreator<T, [...Mps, ['zustand/immer', never]], Mcs>;

// Middleware para facilitar el uso de immer con zustand
export const immerMiddleware = <T,>(
  config: (
    set: (fn: (draft: Draft<T>) => void) => void,
    get: () => T,
    api: { setState: any; getState: any; subscribe: any }
  ) => T
) => (
  set: (state: T | ((prevState: T) => T)) => void,
  get: () => T,
  api: { setState: any; getState: any; subscribe: any }
): T => config(
  (fn) => set((state) => produce(state, fn)),
  get,
  api
);

// Exportar produce para usar immer en otros lugares
export { produce }; 