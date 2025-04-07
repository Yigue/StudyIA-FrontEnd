# Recomendaciones para optimizar la arquitectura de la aplicación

## 1. Store con Zustand

### Organización por slices
- Cada store debe separarse por dominio: `materials.store.ts`, `flashcards.store.ts`, etc.
- Añadir comentarios organizados por secciones:
  - Estado inicial
  - Acciones de carga
  - Acciones de creación
  - Acciones de eliminación
  - Utilidades

### Selectores optimizados
- Implementar selectores específicos para cada store:
```typescript
export const selectAllMaterials = (state: MaterialState) => 
  state.ids.map(id => state.entities[id]);

export const selectLoadingStatus = (state: MaterialState) => ({
  isLoading: state.status.isLoading,
  uploadProgress: state.status.uploadProgress,
});
```

### Comparación shallow
- Utilizar `shallow` de Zustand para la comparación optimizada:
```typescript
const data = useMaterialStore(selectAllMaterials, shallow);
```

### Gestión de caché
- Implementar un sistema de caché con TTL definido
- Invalidar caché explícitamente en operaciones de escritura
- Usar logs de depuración solo cuando sea necesario

## 2. Hooks Personalizados

### Responsabilidad única
- Cada hook debe tener una función clara (useMaterials, useFlashcardsStatus)
- Descomponer hooks grandes en más pequeños con propósitos específicos

### Optimización con memoización
- Usar `useMemo` para cálculos derivados complejos
- Usar `useCallback` para funciones que pasan como props
```typescript
const generateUpcomingReviews = useCallback((cards) => {
  // Lógica aquí
}, []);
```

### Selección específica del store
- Extraer solo las partes necesarias del estado:
```typescript
const { materials, pagination } = useMaterialStore(
  state => ({ 
    materials: state.ids.map(id => state.entities[id]),
    pagination: state.pagination
  }),
  shallow
);
```

## 3. useEffect

### Patrones recomendados
- Implementar bandera de montado para evitar actualizaciones en componentes desmontados:
```typescript
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    if (!isMounted) return;
    // Resto del código
  };
  
  fetchData();
  
  return () => { isMounted = false; };
}, [dependencies]);
```

### Separar efectos por propósito
- Dividir efectos según su funcionalidad:
  - Un efecto para carga inicial
  - Otro efecto para actualización cuando cambian dependencias

### Optimizar dependencias
- Incluir solo las dependencias necesarias
- Usar `useCallback` para estabilizar funciones en las dependencias

## 4. Carga de Datos

### Paralelización
- Utilizar `Promise.all` para peticiones simultáneas:
```typescript
await Promise.all([
  getAllFlashcards(),
  fetchMaterials(),
  getAllSummaries()
]);
```

### Estados de carga
- Implementar estados completos para el ciclo de vida:
```typescript
{
  isLoading: boolean;
  error: string | null;
  data: T[] | null;
  lastFetched: number | null;
}
```

### Prevención de carga duplicada
- Verificar si ya se está cargando antes de iniciar una nueva petición
- Implementar mecanismos de throttling o debounce para llamadas frecuentes

## 5. Normalización del Estado

### Estructura normalizada
- Almacenar entidades en un objeto indexado por ID:
```typescript
{
  entities: { [id: string]: Material },
  ids: string[]
}
```

### Actualizaciones inmutables
- Preferir actualizaciones inmutables con immer:
```typescript
set((state) => {
  state.entities[id] = { ...state.entities[id], ...updates };
});
```

### Derivación de datos
- Calcular datos derivados en los selectores o hooks, no en los componentes
- Memoizar los resultados para evitar cálculos innecesarios

## 6. Mejoras Generales

### Nomenclatura y tipado
- Utilizar interfaces y tipos explícitos para todos los hooks y stores
- Usar nombres claros y consistentes (ej. getFlashcardById, updateFlashcard)

### Documentación
- Añadir comentarios JSDoc a los hooks y funciones principales
- Incluir descripciones claras de la responsabilidad de cada módulo

### Testing
- Implementar pruebas para la lógica de negocio en los hooks
- Separar la lógica de los efectos secundarios para facilitar las pruebas

### Organización del código
- Agrupar funcionalidades relacionadas en carpetas por dominio
- Crear índices para exportar elementos públicos de cada módulo
