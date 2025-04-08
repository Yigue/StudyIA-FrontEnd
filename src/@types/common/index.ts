/**
 * Tipos comunes utilizados en toda la aplicación
 */

// Estado genérico para operaciones asíncronas
export interface AsyncState<T = unknown, E = string> {
  data: T | null;
  isLoading: boolean;
  error: E | null;
  isSuccess: boolean;
}

// Respuesta genérica para paginación
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Opciones de paginación
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Estado de selección múltiple
export interface SelectionState {
  selectedIds: string[];
  selectAll: boolean;
}

// Opciones de ordenamiento
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Estado de un modal
export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

// Opciones para un campo de fecha
export interface DateOptions {
  format?: string;
  min?: string;
  max?: string;
  placeholder?: string;
}

// Opciones para un campo de selección
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Grupo de opciones para un campo de selección
export interface OptionGroup<T = string> {
  label: string;
  options: SelectOption<T>[];
}

// Configuración de notificación
export interface NotificationOptions {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Metadatos para SEO
export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
} 