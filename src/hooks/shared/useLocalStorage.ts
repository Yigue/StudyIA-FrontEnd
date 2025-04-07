import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para utilizar localStorage con tipado
 * 
 * @param key Clave a utilizar en localStorage
 * @param initialValue Valor inicial si no existe en localStorage
 * @returns [storedValue, setValue, removeValue] - Valor guardado, función para actualizar, función para eliminar
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para mantener el valor
  // Inicializar pasando una función para evaluar la lectura una sola vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Parsear el valor almacenado o devolver initialValue
      return item ? JSON.parse(item) as T : initialValue;
    } catch (error) {
      // Si hay error, devolver initialValue
      console.error(`Error al leer de localStorage [${key}]:`, error);
      return initialValue;
    }
  });
  
  // Función para actualizar el valor en localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función para facilitar el patrón de actualización funcional
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Guardar en estado y en localStorage
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al escribir en localStorage [${key}]:`, error);
    }
  }, [key, storedValue]);
  
  // Función para eliminar el valor de localStorage
  const removeValue = useCallback(() => {
    try {
      // Eliminar de localStorage y resetear el estado
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error al eliminar de localStorage [${key}]:`, error);
    }
  }, [key, initialValue]);
  
  // Sincronizar con cambios en otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error al procesar evento storage [${key}]:`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        // Si se eliminó el valor
        setStoredValue(initialValue);
      }
    };
    
    // Agregar listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    // Limpiar listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}

/**
 * Hook para acceder a un valor en localStorage sin estado
 * 
 * @param key Clave a utilizar en localStorage
 * @returns [getValue, setValue, removeValue] - Función para obtener, actualizar y eliminar
 */
export function useLocalStorageValue<T>(
  key: string,
  defaultValue?: T
): {
  getValue: () => T | undefined;
  setValue: (value: T) => void;
  removeValue: () => void;
} {
  const getValue = useCallback((): T | undefined => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) as T : defaultValue;
    } catch (error) {
      console.error(`Error al leer de localStorage [${key}]:`, error);
      return defaultValue;
    }
  }, [key, defaultValue]);
  
  const setValue = useCallback((value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al escribir en localStorage [${key}]:`, error);
    }
  }, [key]);
  
  const removeValue = useCallback((): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar de localStorage [${key}]:`, error);
    }
  }, [key]);
  
  return { getValue, setValue, removeValue };
}

export default useLocalStorage; 