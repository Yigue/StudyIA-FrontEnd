import { useState, useEffect } from 'react';

/**
 * Hook que retrasa la actualización de un valor para evitar actualizaciones frecuentes
 * Útil para campos de búsqueda, filtros, etc.
 * 
 * @param value El valor a retrasar
 * @param delay Tiempo de retraso en ms (por defecto 500ms)
 * @returns Valor retrasado
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un temporizador para actualizar el valor después del retraso
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes del retraso
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook que retrasa una función para evitar ejecuciones frecuentes
 * Útil para handlers de eventos
 * 
 * @param fn Función a ejecutar
 * @param delay Tiempo de retraso en ms (por defecto 500ms)
 * @returns Función retrasada
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar el temporizador al desmontar
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      fn(...args);
      setTimeoutId(null);
    }, delay);

    setTimeoutId(id);
  };
}

export default useDebounce; 