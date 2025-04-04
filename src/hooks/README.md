# Guía de Hooks en StudyIA

## Estructura Recomendada

Nuestra aplicación sigue una arquitectura basada en hooks con estas capas:

1. **Store Layer** - Gestión de estado global con Zustand (`/src/store/`)
2. **Hook Layer** - Hooks que abstraen operaciones complejas (`/src/hooks/`)
3. **Feature Layer** - Hooks específicos para cada funcionalidad (`/src/features/*/hooks/`)
4. **Component Layer** - Consumidores de hooks

## Patrones de Implementación

### 1. Hook Unificado por Dominio

Cada dominio debe tener un único hook principal que exponga todas las funcionalidades:

```typescript
// RECOMENDADO
export const useTags = () => {
  // Datos y acciones juntos
  return {
    // Datos
    tags,
    isLoading,
    // Acciones
    createTag,
    deleteTag
  };
};

// EVITAR
export const useTags = () => { ... } // Solo datos
export const useTagsActions = () => { ... } // Solo acciones
```

### 2. Minimizar useMemo/useCallback

Limitar el uso de `useMemo` y `useCallback` a casos esenciales:

```typescript
// RECOMENDADO - Solo usar useMemo para el objeto final
return useMemo(() => ({
  data,
  actions
}), [data, actions]);

// EVITAR - Exceso de memoización
const action1 = useCallback(() => {}, []);
const action2 = useCallback(() => {}, []);
const data1 = useMemo(() => {}, []);
```

### 3. Limpiar efectos correctamente

Todos los `useEffect` deben incluir limpieza cuando sea necesario:

```typescript
// RECOMENDADO
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, [api]);
```

### 4. Separación de Preocupaciones

Dividir los hooks por responsabilidad:

- **useAuth** - Autenticación y usuario
- **useMaterials** - Materiales de estudio
- **useFlashcards** - Tarjetas de memoria
- **useSummaries** - Resúmenes

### 5. Carga inicial de datos

Patrón estándar para carga inicial:

```typescript
// Estado para controlar carga inicial
const initialLoadDone = useRef(false);

// Efecto para carga inicial
useEffect(() => {
  if (initialLoadDone.current) return;
  
  fetchData();
  initialLoadDone.current = true;
}, []);
```

## Optimización

### Reducir renderizados

- Usar selectores específicos con Zustand
- Memoizar solo objetos complejos y funciones críticas
- Normalizar datos en el store para acceso eficiente

### Carga de datos

- Implementar estrategias de caché (5 minutos es el estándar)
- Usar carga en segundo plano para refrescar datos
- Consolidar peticiones con Promise.all

## Convenciones de Nomenclatura

- **useXxx** - Hook principal del dominio
- **useCurrentXxx** - Hook para trabajar con la entidad actual
- **useXxxStatus** - Hook para verificar estado 