// Exportar todos los hooks desde un único punto para facilitar las importaciones

// Hook de navegación con TanStack Router
export { useRouter } from './useRouter';

// Hooks para la autenticación
export { useAuth } from './useAuth';

// Hooks para la interfaz de usuario
export { useTheme } from '../components/ui/useTheme';

// Hooks personalizados para datos
export { useTags } from './useTags';
export { useMaterials } from './useMaterials';
export { useSummaries } from './useSummaries';
export { useFlashcards } from './useFlashcards';

// Hooks para funcionalidades específicas


// Re-exportar hooks de TanStack Router para conveniencia
export {
  useNavigate,
  useMatch,
  useParams,
  useSearch,
  useRouterState,
} from '@tanstack/react-router'; 