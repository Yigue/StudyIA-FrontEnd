/**
 * Archivo principal que exporta todos los tipos de la aplicación
 */

// Exportar módulos principales
// Nota: Se exporta cada módulo por separado para evitar colisiones de nombres

// API y comunicación
export * as API from './api';

// Autenticación y usuarios
export * as Auth from './auth';

// Flashcards y estudio
export * as Flashcards from './flashcards';

// Materiales de estudio
export * as Materials from './materials';

// Resúmenes
export * as Summaries from './summaries';

// Etiquetas (tags)
export * as Tags from './tags';

// Estudio y sesiones
export * as Study from './study';

// Tipos comunes
export * as Common from './common';

// Componentes UI
export * as UI from './ui'; 