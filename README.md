## Estructura de la aplicación de Flashcards

La aplicación de flashcards está estructurada de la siguiente manera:

### Páginas principales

- **FlashcardsExplorerPage**: Explorador principal para ver, filtrar, editar y crear flashcards.
- **StudySessionPage**: Página para realizar sesiones de estudio con las flashcards.

### Componentes

La organización de componentes sigue este patrón:

- **`/components/ui/`**: Componentes pequeños y reutilizables (SearchBar, FilterPanel, StatsPanel).
- **`/components/containers/`**: Componentes más grandes y complejos (FlashcardExplorer, FlashcardEditor, StudySession).

### Tipos

Los tipos están definidos en:

- **`/types/flashcards/`**: Contiene todos los tipos relacionados con flashcards.
- **`/types/flashcards/flashcards.ts`**: Re-exporta todos los tipos de flashcards para facilitar las importaciones.

## Rutas

- **/flashcards**: Explorador principal
- **/flashcards/study**: Sesión de estudio 