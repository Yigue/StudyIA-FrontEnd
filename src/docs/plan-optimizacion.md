# Plan de Reestructuración y Optimización para StudyIA

## Estructura General del Plan

1. **Análisis de la estructura actual**
2. **Principios de optimización a aplicar**
3. **Plan detallado por carpeta**
4. **Cronograma recomendado de implementación**

## 1. Análisis de la Estructura Actual

La aplicación StudyIA tiene una estructura basada en features con las siguientes carpetas principales:

- `/auth`: Sistema de autenticación
- `/dashboard`: Panel principal y analíticas
- `/flashcards`: Sistema de tarjetas de memoria
- `/library`: Biblioteca de materiales de estudio
- `/settings`: Configuración de la aplicación
- `/study`: Área de estudio

Cada carpeta sigue generalmente un patrón de componentes, tipos, utilidades y páginas, aunque hay inconsistencias en la organización.

## 2. Principios de Optimización a Aplicar

### A. Componentización
- Extraer componentes reutilizables
- Crear componentes atómicos para UI común
- Implementar patrones de composición

### B. Reducción de Repetición
- Crear hooks personalizados para lógica común
- Implementar utilidades compartidas
- Estandarizar patrones de acceso a datos

### C. TanStack Router y React Query
- Migrar completamente a TanStack Router
- Utilizar hooks de React Query para datos
- Implementar carga diferida y suspense

### D. Rendimiento
- Memoizar componentes y cálculos pesados
- Optimizar renderizado con virtualizaciones
- Implementar técnicas de code-splitting

## 3. Plan Detallado por Carpeta

### 3.1. `/auth`

**Estado actual**: Sistema básico de autenticación con registro y login.

**Problemas identificados**:
- Manejo de tokens sin optimización para React Query
- Falta de manejo centralizado de errores de autenticación
- Redirecciones no optimizadas para TanStack Router

**Mejoras propuestas**:
- Crear `useAuthQuery` que integre React Query para manejar autenticación
- Implementar almacenamiento de tokens optimizado
- Crear sistema de errores específicos para autenticación
- Optimizar redirecciones con TanStack Router

**Componentes a crear**:
1. `AuthProvider.tsx`: Contexto optimizado para autenticación
2. `AuthGuard.tsx`: Componente de protección de rutas
3. `useAuth.ts`: Hook mejorado de autenticación con React Query
4. `LoginForm.tsx`: Componente optimizado de login
5. `RegisterForm.tsx`: Componente optimizado de registro
6. `PasswordReset.tsx`: Componente para recuperación de contraseña

**Archivos a modificar**:
- `AuthPage.tsx`: Refactorizar para usar TanStack Router
- `auth.service.ts`: Optimizar para integrarse con React Query

### 3.2. `/dashboard`

**Estado actual**: Panel con análisis básico y widgets no optimizados.

**Problemas identificados**:
- Carga no optimizada de datos de estadísticas
- Componentes sin memoización
- Visualizaciones no componentizadas

**Mejoras propuestas**:
- Implementar sistema modular de widgets con React Query
- Crear componentes reutilizables para estadísticas y gráficos
- Optimizar carga de datos con estrategias de caché

**Componentes a crear**:
1. `DashboardProvider.tsx`: Contexto para datos del dashboard
2. `useDashboardData.ts`: Hook optimizado con React Query
3. `StatCard.tsx`: Componente para tarjetas de estadísticas
4. `ChartContainer.tsx`: Contenedor optimizado para gráficos
5. `WidgetGrid.tsx`: Sistema de grid para widgets

**Archivos a modificar**:
- `DashboardPage.tsx`: Refactorizar para modularidad
- `AnalyticsPage.tsx`: Optimizar con React Query

### 3.3. `/flashcards`

**Estado actual**: Sistema de flashcards con revisión espaciada básica.

**Problemas identificados**:
- Manejo subóptimo del algoritmo de revisión espaciada
- Componentes con lógica duplicada
- Acceso a datos no optimizado

**Mejoras propuestas**:
- Implementar sistema SRS optimizado con React Query
- Crear componentes reutilizables para diferentes tipos de tarjetas
- Optimizar la gestión de progreso y estadísticas

**Componentes a crear**:
1. `FlashcardProvider.tsx`: Contexto para estado de flashcards
2. `FlashcardCard.tsx`: Componente para visualización de tarjetas
3. `ReviewEngine.tsx`: Motor de revisión espaciada optimizado
4. `FlashcardFilters.tsx`: Sistema de filtros para tarjetas
5. `FlashcardCreator.tsx`: Componente para creación de tarjetas
6. `useFlashcardReview.ts`: Hook para sistema de revisión

**Archivos a modificar**:
- `FlashcardsReviewPage.tsx`: Optimizar algoritmo de revisión
- `FlashcardsExplorerPage.tsx`: Mejorar filtros y búsqueda
- Páginas en `/pages`: Optimizar con React Query

### 3.4. `/library`

**Estado actual**: Biblioteca con carga de materiales no optimizada.

**Problemas identificados**:
- Carga ineficiente de grandes colecciones de materiales
- Filtrado sin optimización
- Visualización de materiales no componentizada

**Mejoras propuestas**:
- Implementar virtualización para listas largas
- Crear sistema de filtros optimizado con React Query
- Optimizar la previsualización de materiales

**Componentes a crear**:
1. `LibraryProvider.tsx`: Contexto para biblioteca
2. `MaterialCard.tsx`: Tarjeta de material reutilizable
3. `MaterialListVirtualized.tsx`: Lista virtualizada de materiales
4. `SearchAndFilterBar.tsx`: Barra de búsqueda y filtros
5. `MaterialViewer.tsx`: Visor optimizado de materiales
6. `useMaterialsQuery.ts`: Hook para consulta de materiales

**Archivos a modificar**:
- `LibraryPage.tsx`: Refactorizar con componentes modulares
- Componentes existentes: Optimizar renderizado

### 3.5. `/settings`

**Estado actual**: Configuración básica de la aplicación.

**Problemas identificados**:
- Formularios no optimizados
- Manejo de estado distribuido
- Persistencia subóptima de configuraciones

**Mejoras propuestas**:
- Crear sistema modular de configuraciones
- Implementar formularios optimizados
- Centralizar estado de configuración

**Componentes a crear**:
1. `SettingsProvider.tsx`: Contexto para configuraciones
2. `SettingSection.tsx`: Sección modular de configuración
3. `FormField.tsx`: Campo de formulario reutilizable
4. `useSettings.ts`: Hook para gestión de configuraciones
5. `SettingsSync.tsx`: Componente para sincronización de configuraciones

**Archivos a modificar**:
- `SettingsPage.tsx`: Refactorizar para modularidad
- Componentes de configuración existentes: Optimizar

### 3.6. `/study`

**Estado actual**: Área de estudio con interacción básica con materiales.

**Problemas identificados**:
- Carga ineficiente de materiales de estudio
- Interacción subóptima entre notas, resúmenes y flashcards
- Seguimiento de progreso no optimizado

**Mejoras propuestas**:
- Implementar sistema de estudio con React Query
- Crear componentes para diferentes tipos de materiales
- Optimizar la creación de recursos de estudio

**Componentes a crear**:
1. `StudyProvider.tsx`: Contexto para sesión de estudio
2. `StudyMaterialViewer.tsx`: Visor optimizado de material
3. `NoteTaking.tsx`: Sistema de toma de notas
4. `ProgressTracker.tsx`: Seguimiento de progreso
5. `StudyToolbar.tsx`: Barra de herramientas para estudio
6. `useStudySession.ts`: Hook para gestión de sesión de estudio

**Archivos a modificar**:
- `StudyAreaPage.tsx`: Refactorizar para modularidad
- Integración con flashcards y materiales: Optimizar

## 4. Componentes compartidos a crear

1. `ErrorBoundary.tsx`: Captura y manejo centralizado de errores
2. `LoadingStates.tsx`: Componentes para estados de carga
3. `QueryWrapper.tsx`: Wrapper para consultas de React Query
4. `ConfirmationDialog.tsx`: Diálogo de confirmación reutilizable
5. `Pagination.tsx`: Componente de paginación reutilizable
6. `InfiniteScroll.tsx`: Componente para carga infinita
7. `SearchInput.tsx`: Entrada de búsqueda optimizada
8. `FilterSystem.tsx`: Sistema de filtros genérico

## 5. Hooks compartidos a crear

1. `useDebounce.ts`: Para valores con debounce
2. `useLocalStorage.ts`: Persistencia en localStorage
3. `useMediaQuery.ts`: Para diseño responsive
4. `usePrevious.ts`: Acceso al valor anterior
5. `useUpdateEffect.ts`: useEffect que omite la primera ejecución
6. `useQueryParams.ts`: Para gestionar parámetros de consulta

## 6. Cronograma recomendado de implementación

### Fase 1: Infraestructura y Componentes Base (Semana 1)
- Crear componentes compartidos
- Crear hooks compartidos
- Configurar TanStack Router
- Configurar React Query

### Fase 2: Autenticación y Datos Básicos (Semana 2)
- Optimizar `/auth`
- Crear hooks de consulta para entidades principales
- Implementar manejo de errores centralizado

### Fase 3: Biblioteca y Materiales (Semana 3)
- Optimizar `/library`
- Implementar visualización y filtrado optimizados
- Crear componentes reutilizables para materiales

### Fase 4: Estudio y Flashcards (Semana 4)
- Optimizar `/study`
- Optimizar `/flashcards`
- Mejorar integración entre materiales y flashcards

### Fase 5: Dashboard y Configuración (Semana 5)
- Optimizar `/dashboard`
- Optimizar `/settings`
- Implementar sistema de widgets

### Fase 6: Pruebas y Refinamiento (Semana 6)
- Pruebas de rendimiento
- Refinamiento de componentes
- Documentación 