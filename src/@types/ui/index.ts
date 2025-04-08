/**
 * Tipos relacionados con componentes de UI
 */

// Tema de la aplicación
export type ThemeMode = 'light' | 'dark' | 'system';

// Tamaños para componentes
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Variantes de color
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

// Variantes de botón
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

// Propiedades para gradientes
export interface GradientProps {
  from?: string;
  to?: string;
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
}

// Estado de carga para botones
export interface ButtonLoadingState {
  isLoading: boolean;
  loadingText?: string;
}

// Opciones para tooltip
export interface TooltipOptions {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
}

// Estado de arrastrar y soltar
export interface DragAndDropState {
  isDragging: boolean;
  draggedItem: unknown;
  draggedOver: string | null;
}

// Propiedades para animaciones
export interface AnimationProps {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  repeat?: number | 'infinite';
}

// Configuración de tabla
export interface TableConfig {
  columns: TableColumn[];
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  showCheckboxes?: boolean;
  showActionsColumn?: boolean;
}

// Columna de tabla
export interface TableColumn {
  id: string;
  header: string;
  accessor: string;
  isNumeric?: boolean;
  isSortable?: boolean;
  width?: string;
  cell?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

// Opciones para gráficos
export interface ChartOptions {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'scatter';
  height?: number;
  width?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  colors?: string[];
  enableAnimation?: boolean;
} 