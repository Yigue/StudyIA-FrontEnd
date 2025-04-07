import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation, HistoryState } from '@tanstack/react-router';

export interface ModalOptions {
  title?: string;
  fullScreen?: boolean;
  closeOnClickOutside?: boolean;
  preventUrlChange?: boolean;
  preventHistoryChange?: boolean;
  onClose?: () => void;
  width?: string | number;
  height?: string | number;
  position?: 'center' | 'right' | 'left' | 'top' | 'bottom';
}

export interface ModalNavigationState {
  isModal?: boolean;
  returnTo?: string;
  [key: string]: unknown;
}

export interface ModalState {
  isOpen: boolean;
  component: React.ReactNode | null;
  options: ModalOptions;
}

/**
 * Hook para manejar navegación en modales y drawers
 * Permite abrir componentes en modales con gestión de URL y navegación
 */
export function useModalNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocationRef = useRef(location);
  
  // Estado del modal
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    component: null,
    options: {}
  });
  
  // Historial de modales para navegación anidada1
  const modalHistoryRef = useRef<ModalState[]>([]);
  
  // Abrir un modal con un componente
  const openModal = useCallback((
    component: React.ReactNode,
    options: ModalOptions = {}
  ) => {
    const {
      preventUrlChange = false,
      preventHistoryChange = false
    } = options;
    
    // Si no se previene el cambio de URL, agregar parámetro a la URL
    if (!preventUrlChange) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('modal', 'true');
      
      // Navegar a la misma ruta pero con el parámetro de modal
      navigate({
        to: location.pathname,
        search: searchParams.toString(),
        replace: true
      });
    }
    
    // Si no se previene el cambio en el historial, guardar el estado actual
    if (!preventHistoryChange && modalState.isOpen) {
      modalHistoryRef.current.push({
        ...modalState
      });
    }
    
    // Actualizar estado del modal
    setModalState({
      isOpen: true,
      component,
      options
    });
  }, [location, navigate, modalState]);
  
  // Abrir un modal con una ruta específica
  const openModalRoute = useCallback((
    route: string,
    options: ModalOptions & { state?: ModalNavigationState } = {}
  ) => {
    const { state, ...modalOptions } = options;
    
    // Guardar la ruta actual en el historial
    prevLocationRef.current = location;
    
    // Navegar a la nueva ruta con parámetro modal
    const searchParams = new URLSearchParams();
    searchParams.set('modal', 'true');
    
    const navigateState: Record<string, unknown> = {
      isModal: true,
      returnTo: location.pathname + location.search,
      ...(state || {})
    };
    
    navigate({
      to: route,
      search: searchParams.toString(),
      state: navigateState as unknown as HistoryState
    });
    
    // Establecer el estado para indicar que se debe mostrar como modal
    setModalState({
      isOpen: true,
      component: null, // El componente se cargará por la ruta
      options: modalOptions
    });
  }, [location, navigate]);
  
  // Cerrar el modal actual
  const closeModal = useCallback(() => {
    const { preventUrlChange = false, onClose } = modalState.options;
    
    // Ejecutar callback de cierre si existe
    if (onClose) {
      onClose();
    }
    
    // Si hay modales en el historial, mostrar el anterior
    if (modalHistoryRef.current.length > 0) {
      const prevModal = modalHistoryRef.current.pop();
      setModalState(prevModal || {
        isOpen: false,
        component: null,
        options: {}
      });
      return;
    }
    
    // Eliminar el parámetro modal de la URL
    if (!preventUrlChange) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('modal');
      
      navigate({
        to: location.pathname,
        search: searchParams.toString() || undefined,
        replace: true
      });
    }
    
    // Restaurar la URL anterior si era una navegación modal
    const locationState = location.state as unknown as ModalNavigationState | null;
    if (locationState?.isModal && locationState?.returnTo) {
      navigate({ to: locationState.returnTo });
    }
    
    // Cerrar el modal
    setModalState({
      isOpen: false,
      component: null,
      options: {}
    });
  }, [location, navigate, modalState.options]);
  
  // Reemplazar el modal actual con uno nuevo
  const replaceModal = useCallback((
    component: React.ReactNode,
    options: ModalOptions = {}
  ) => {
    // No guardar en historial, simplemente reemplazar
    setModalState({
      isOpen: true,
      component,
      options
    });
  }, []);
  
  // Verificar si hay un parámetro modal en la URL al cargar
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasModalParam = searchParams.get('modal') === 'true';
    const locationState = location.state as unknown as ModalNavigationState | null;
    
    if ((hasModalParam || locationState?.isModal) && !modalState.isOpen) {
      // Si hay parámetro modal pero no hay modal abierto, abrir uno vacío
      // El componente será proporcionado por la ruta
      setModalState({
        isOpen: true,
        component: null,
        options: {}
      });
    } else if (!hasModalParam && !locationState?.isModal && modalState.isOpen) {
      // Si no hay parámetro modal pero hay un modal abierto, cerrarlo
      setModalState({
        isOpen: false,
        component: null,
        options: {}
      });
      
      modalHistoryRef.current = [];
    }
  }, [location, modalState.isOpen]);
  
  return {
    isModalOpen: modalState.isOpen,
    modalComponent: modalState.component,
    modalOptions: modalState.options,
    openModal,
    openModalRoute,
    closeModal,
    replaceModal
  };
}

export default useModalNavigation; 