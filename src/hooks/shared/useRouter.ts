import { 
  Link,
  useLocation,
  useNavigate,
  useRouterState
} from '@tanstack/react-router';

/**
 * Hook personalizado que proporciona funciones útiles de navegación
 */
export const useRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routerState = useRouterState();

  /**
   * Navega a una ruta específica
   */
  const goTo = (path: string, replace = false) => {
    navigate({ 
      to: path,
      replace 
    });
  };

  /**
   * Navega a la página anterior
   */
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goTo('/dashboard');
    }
  };

  /**
   * Obtiene un parámetro de consulta específico
   */
  const getQueryParam = (name: string): string | null => {
    return new URLSearchParams(window.location.search).get(name);
  };

  /**
   * Componente Link optimizado
   */
  const RouterLink = Link;

  return {
    location,
    navigate,
    goTo,
    goBack,
    getQueryParam,
    RouterLink,
    routerState
  };
}; 