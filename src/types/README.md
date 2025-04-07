# Estructura de Tipos en StudyIA

Este directorio contiene todos los tipos TypeScript utilizados en la aplicación StudyIA, organizados de manera modular y con una estructura clara.

## Organización

Los tipos están organizados en las siguientes carpetas:

- **api**: Tipos relacionados con la comunicación con la API (respuestas, errores, etc.)
- **auth**: Tipos para autenticación y usuarios
- **common**: Tipos comunes utilizados en toda la aplicación
- **dashboard**: Tipos para el dashboard y estadísticas
- **flashcards**: Tipos relacionados con flashcards
- **materials**: Tipos para materiales de estudio
- **settings**: Tipos para configuración de la aplicación
- **study**: Tipos para el área de estudio
- **summaries**: Tipos para resúmenes de materiales

## Uso

Todos los tipos se exportan desde el archivo `index.ts` principal, lo que permite importarlos de manera sencilla:

```typescript
// Importar tipos específicos
import { StudyMaterial, Flashcard, User } from '@/types';

// O importar tipos agrupados
import { FlashcardCreateDTO, FlashcardUpdateDTO } from '@/types/flashcards';
```

## Convenciones de Nomenclatura

- **Entidades Principales**: Nombres simples como `User`, `Flashcard`, `StudyMaterial`
- **DTOs**: Sufijo `DTO` para objetos de transferencia de datos, como `CreateMaterialDTO`
- **Estados**: Sufijo `State` para estados, como `StatusState`
- **Opciones**: Sufijo `Options` para opciones, como `ProcessingOptions`
- **Filtros**: Sufijo `Filters` para filtros, como `FlashcardFilters`

## Extensión

Para añadir nuevos tipos:

1. Colócalos en el archivo correspondiente dentro de la carpeta adecuada
2. Si es necesario, expórtalos desde el archivo `index.ts` de esa carpeta
3. No es necesario modificar el archivo `index.ts` principal, ya exporta automáticamente todos los tipos 