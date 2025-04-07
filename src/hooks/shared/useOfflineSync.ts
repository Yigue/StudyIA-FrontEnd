import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Interfaz para las acciones pendientes
interface PendingAction<T = unknown> {
  id: string;
  action: string;
  payload: T;
  timestamp: number;
  retries?: number;
}

/**
 * Hook para gestionar sincronización offline
 * Permite guardar acciones para ejecutarlas cuando la conexión se restablezca
 */
export function useOfflineSync<T = unknown>(
  storageKey: string = 'offlineActions',
  onSync?: (actions: PendingAction<T>[]) => Promise<string[]>, // Devuelve array de IDs procesados exitosamente
  maxRetries: number = 3
) {
  // Estado de conexión
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  // Almacenar acciones pendientes
  const [pendingActions, setPendingActions] = useLocalStorage<PendingAction<T>[]>(
    storageKey,
    []
  );
  
  // Estado de sincronización
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<Error | null>(null);
  
  // Agregar una acción pendiente
  const addPendingAction = useCallback(
    (action: string, payload: T) => {
      const newAction: PendingAction<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        payload,
        timestamp: Date.now(),
        retries: 0
      };
      
      setPendingActions(prev => [...prev, newAction]);
      
      // Si estamos online, intentar sincronizar inmediatamente
      if (isOnline && onSync) {
        synchronize();
      }
      
      return newAction.id;
    },
    [isOnline, onSync, setPendingActions]
  );
  
  // Función para sincronizar
  const synchronize = useCallback(async () => {
    if (!onSync || !isOnline || isSyncing || pendingActions.length === 0) {
      return;
    }
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      // Ejecutar función de sincronización proporcionada
      const successfulIds = await onSync(pendingActions);
      
      // Eliminar acciones exitosas y actualizar las fallidas
      setPendingActions(prev => 
        prev
          .filter(action => !successfulIds.includes(action.id))
          .map(action => {
            if (!successfulIds.includes(action.id)) {
              return {
                ...action,
                retries: (action.retries || 0) + 1
              };
            }
            return action;
          })
          .filter(action => (action.retries || 0) < maxRetries)
      );
    } catch (error) {
      console.error('Error during synchronization:', error);
      setSyncError(error instanceof Error ? error : new Error('Unknown synchronization error'));
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, onSync, pendingActions, setPendingActions, maxRetries]);
  
  // Limpiar todas las acciones pendientes
  const clearPendingActions = useCallback(() => {
    setPendingActions([]);
  }, [setPendingActions]);
  
  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingActions.length > 0 && onSync) {
        synchronize();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [onSync, pendingActions.length, synchronize]);
  
  // Intentar sincronizar cuando cambiamos a online o cuando hay nuevas acciones
  useEffect(() => {
    if (isOnline && pendingActions.length > 0 && onSync) {
      synchronize();
    }
  }, [isOnline, pendingActions.length, onSync, synchronize]);
  
  return {
    isOnline,
    isSyncing,
    syncError,
    pendingActions,
    addPendingAction,
    synchronize,
    clearPendingActions,
    pendingActionsCount: pendingActions.length
  };
}

export default useOfflineSync; 