import { useState, useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;
type KeyFilter = string | string[] | ((event: KeyboardEvent) => boolean);

/**
 * Hook personalizado para detectar cuando se presionan teclas específicas
 * 
 * @param keyFilter Una tecla, array de teclas o función para filtrar eventos
 * @param handler Función a ejecutar cuando se detecta la pulsación
 * @param options Opciones adicionales
 * @returns Estado de las teclas presionadas y funciones para activar/desactivar el detector
 */
export function useKeyPress(
  keyFilter: KeyFilter,
  handler?: KeyHandler,
  options: {
    event?: 'keydown' | 'keyup' | 'keypress';
    target?: 'window' | 'document';
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) {
  // Valores por defecto
  const {
    event = 'keydown',
    target = 'window',
    enabled = true,
    preventDefault = false,
    stopPropagation = false
  } = options;
  
  // Estado para rastrear si la tecla está presionada
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  
  // Función para verificar si un evento coincide con el filtro
  const matchesFilter = useCallback(
    (event: KeyboardEvent): boolean => {
      if (typeof keyFilter === 'string') {
        return event.key === keyFilter;
      } else if (Array.isArray(keyFilter)) {
        return keyFilter.includes(event.key);
      } else if (typeof keyFilter === 'function') {
        return keyFilter(event);
      }
      return false;
    },
    [keyFilter]
  );
  
  // Manejador de eventos de tecla
  const keyHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      // Verificar si la tecla coincide con el filtro
      const matches = matchesFilter(event);
      
      if (matches) {
        // Prevenir comportamiento por defecto si es necesario
        if (preventDefault) {
          event.preventDefault();
        }
        
        // Detener propagación si es necesario
        if (stopPropagation) {
          event.stopPropagation();
        }
        
        // Actualizar estado
        setKeyPressed(event.type === 'keydown');
        
        // Ejecutar handler si está definido
        if (handler) {
          handler(event);
        }
      }
    },
    [enabled, matchesFilter, preventDefault, stopPropagation, handler]
  );
  
  // Activar el detector
  const enableListener = useCallback(() => {
    const targetElement = target === 'window' ? window : document;
    
    targetElement.addEventListener(event, keyHandler as EventListener);
    if (event === 'keydown') {
      // Agregar keyup para rastrear cuando se suelta la tecla
      targetElement.addEventListener('keyup', keyHandler as EventListener);
    }
  }, [event, keyHandler, target]);
  
  // Desactivar el detector
  const disableListener = useCallback(() => {
    const targetElement = target === 'window' ? window : document;
    
    targetElement.removeEventListener(event, keyHandler as EventListener);
    if (event === 'keydown') {
      // Eliminar keyup
      targetElement.removeEventListener('keyup', keyHandler as EventListener);
    }
  }, [event, keyHandler, target]);
  
  // Agregar y limpiar listeners
  useEffect(() => {
    if (enabled) {
      enableListener();
    }
    
    return disableListener;
  }, [enabled, enableListener, disableListener]);
  
  return {
    pressed: keyPressed,
    enable: enableListener,
    disable: disableListener
  };
}

/**
 * Hook simplificado para detectar combinaciones de teclas
 * 
 * @param keys Array de teclas que deben presionarse simultáneamente
 * @param callback Función a ejecutar cuando se detecta la combinación
 * @param options Opciones adicionales
 * @returns Estado de la combinación de teclas
 */
export function useKeyCombination(
  keys: string[],
  callback?: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const { enabled = true, preventDefault = true } = options;
  const [pressed, setPressed] = useState<boolean>(false);
  
  // Conjunto de teclas actualmente presionadas
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      // Actualizar conjunto de teclas activas
      const newActiveKeys = new Set(activeKeys);
      newActiveKeys.add(event.key);
      setActiveKeys(newActiveKeys);
      
      // Verificar si todas las teclas requeridas están presionadas
      const allKeysPressed = keys.every(key => newActiveKeys.has(key));
      
      if (allKeysPressed) {
        setPressed(true);
        
        if (preventDefault) {
          event.preventDefault();
        }
        
        if (callback) {
          callback(event);
        }
      }
    },
    [activeKeys, callback, enabled, keys, preventDefault]
  );
  
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // Eliminar la tecla del conjunto
      const newActiveKeys = new Set(activeKeys);
      newActiveKeys.delete(event.key);
      setActiveKeys(newActiveKeys);
      
      // Verificar si todas las teclas requeridas siguen presionadas
      const allKeysPressed = keys.every(key => newActiveKeys.has(key));
      setPressed(allKeysPressed);
    },
    [activeKeys, keys]
  );
  
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);
  
  return pressed;
}

export default useKeyPress; 