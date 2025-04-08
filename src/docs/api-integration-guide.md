# Guía de Integración de API para StudyIA

## Introducción

Este documento describe los pasos necesarios para completar la integración de la aplicación StudyIA con la API REST que proporciona los datos reales. Actualmente, algunas partes de la aplicación utilizan datos mock o están incompletas. Esta guía ayudará a completar la implementación.

## Endpoints Necesarios

### Autenticación

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/auth/register` | POST | Registro de usuario | ✅ Implementado |
| `/auth/login` | POST | Iniciar sesión | ✅ Implementado |
| `/auth/refresh-token` | POST | Refrescar token | ✅ Implementado |
| `/auth/logout` | POST | Cerrar sesión | ⚠️ Pendiente |
| `/auth/verify-email/:token` | GET | Verificar email | ⚠️ Pendiente |
| `/auth/forgot-password` | POST | Solicitar reseteo de contraseña | ⚠️ Pendiente |
| `/auth/reset-password/:token` | POST | Resetear contraseña | ⚠️ Pendiente |

### Usuario

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/users/profile` | GET | Obtener perfil | ✅ Implementado |
| `/users/profile` | PUT | Actualizar perfil | ⚠️ Pendiente |
| `/users/change-password` | PUT | Cambiar contraseña | ⚠️ Pendiente |
| `/users/preferences` | GET | Obtener preferencias | ⚠️ Pendiente |
| `/users/preferences` | PUT | Actualizar preferencias | ⚠️ Pendiente |

### Materiales

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/materials` | GET | Listar materiales | ✅ Implementado |
| `/materials/:id` | GET | Obtener material | ✅ Implementado |
| `/materials` | POST | Crear material (texto) | ✅ Implementado |
| `/materials/upload` | POST | Subir material (archivo) | ⚠️ Parcial |
| `/materials/:id` | PUT | Actualizar material | ⚠️ Pendiente |
| `/materials/:id` | DELETE | Eliminar material | ⚠️ Pendiente |
| `/materials/:id/status` | GET | Estado de procesamiento | ⚠️ Pendiente |
| `/materials/process` | POST | Procesar material con IA | ⚠️ Pendiente |
| `/materials/:id/summary` | POST | Generar resumen | ⚠️ Pendiente |
| `/materials/:id/flashcards` | POST | Generar flashcards | ⚠️ Pendiente |

### Flashcards

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/flashcards` | GET | Listar flashcards | ✅ Implementado |
| `/flashcards/:id` | GET | Obtener flashcard | ✅ Implementado |
| `/flashcards/material/:materialId` | GET | Flashcards por material | ✅ Implementado |
| `/flashcards` | POST | Crear flashcard | ✅ Implementado |
| `/flashcards/:id` | PUT | Actualizar flashcard | ✅ Implementado |
| `/flashcards/:id` | DELETE | Eliminar flashcard | ✅ Implementado |
| `/flashcards/:id/review` | PUT | Registrar revisión | ✅ Implementado |
| `/flashcards/:id/archive` | PUT | Archivar/desarchivar | ⚠️ Pendiente |
| `/flashcards/study` | GET | Obtener flashcards para estudio | ⚠️ Parcial |
| `/flashcards/study/material/:materialId` | GET | Estudio por material | ⚠️ Parcial |
| `/flashcards/study/tags` | GET | Estudio por etiquetas | ⚠️ Pendiente |

### Resúmenes

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/summaries` | GET | Listar resúmenes | ⚠️ Pendiente |
| `/summaries/:id` | GET | Obtener resumen | ⚠️ Pendiente |
| `/summaries/material/:materialId` | GET | Resúmenes por material | ⚠️ Pendiente |
| `/summaries` | POST | Crear resumen | ⚠️ Pendiente |
| `/summaries/:id` | PUT | Actualizar resumen | ⚠️ Pendiente |
| `/summaries/:id` | DELETE | Eliminar resumen | ⚠️ Pendiente |

### Etiquetas

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/tags` | GET | Listar etiquetas | ⚠️ Pendiente |
| `/tags/:id` | GET | Obtener etiqueta | ⚠️ Pendiente |
| `/tags` | POST | Crear etiqueta | ⚠️ Pendiente |
| `/tags/:id` | PUT | Actualizar etiqueta | ⚠️ Pendiente |
| `/tags/:id` | DELETE | Eliminar etiqueta | ⚠️ Pendiente |

### Estadísticas

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/stats/dashboard` | GET | Estadísticas para dashboard | ⚠️ Pendiente |
| `/stats/flashcards` | GET | Estadísticas de flashcards | ⚠️ Pendiente |
| `/stats/study` | GET | Estadísticas de estudio | ⚠️ Pendiente |
| `/stats/materials` | GET | Estadísticas de materiales | ⚠️ Pendiente |

## Tareas Pendientes por Módulo

### Autenticación y Usuario

1. Implementar funcionalidad de verificación de email
2. Implementar proceso de olvido y reseteo de contraseña
3. Crear pantalla y funcionalidad para cambiar contraseña
4. Implementar gestión de preferencias de usuario

### Materiales

1. Completar integración de subida de archivos con barra de progreso
2. Integrar endpoints para seguimiento de estado de procesamiento
3. Implementar solicitud de generación de resúmenes y flashcards
4. Añadir soporte para diferentes formatos de archivo

### Flashcards

1. Integrar sistema de repetición espaciada con la API
2. Mejorar la funcionalidad de estudio por etiquetas
3. Implementar vista de archivado/desarchivado de flashcards
4. Añadir funcionalidad de exportación e importación

### Resúmenes

1. Crear servicios para gestión de resúmenes
2. Implementar interfaz para lectura y edición de resúmenes
3. Integrar funcionalidad de búsqueda y filtrado en resúmenes
4. Añadir soporte para diferentes formatos de resumen

### Etiquetas

1. Crear interfaz para gestión de etiquetas
2. Implementar sistema de colores personalizados para etiquetas
3. Añadir contador de elementos por etiqueta
4. Integrar etiquetas en todos los módulos relevantes

### Estadísticas

1. Crear servicios para obtener estadísticas
2. Implementar dashboard con gráficos de rendimiento
3. Añadir seguimiento de tiempo de estudio
4. Crear sistema de gamificación y logros

## Mejores Prácticas

### Manejo de Errores

- Implementar manejo de errores consistente para todas las llamadas API
- Mostrar mensajes de error amigables para el usuario
- Capturar y registrar errores para depuración
- Gestionar problemas de conectividad con reintentos automáticos

### Optimización de Rendimiento

- Implementar caché para respuestas frecuentes
- Utilizar debounce/throttle para llamadas en tiempo real
- Aplicar carga perezosa (lazy loading) para datos extensos
- Mantener estados locales para optimizar experiencia de usuario

### Seguridad

- Asegurar el almacenamiento seguro de tokens
- Implementar expiración y renovación automática de tokens
- Validar todos los datos de entrada antes de enviarlos a la API
- Proteger rutas sensibles con guards de autenticación

## Recursos

- [Documentación completa de la API](./docs-api.md)
- [Tipos y estructuras de datos](./api-types.md)
- [Plan de optimización](./plan-optimizacion.md)
- [Recomendaciones de arquitectura](./recomendaciones.md)

## Ejemplos de Implementación

### Ejemplo de servicio completo

```typescript
import { httpClient } from '../api/httpClient';
import { Flashcard, FlashcardCreateDTO, FlashcardUpdateDTO } from '../../@types';

// Obtener todas las flashcards con paginación y filtros
export async function getAllFlashcards(params?: {
  page?: number;
  limit?: number;
  difficulty?: string;
  search?: string;
  tags?: string[];
}) {
  return httpClient<{
    items: Flashcard[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  }>('/flashcards', {
    method: 'GET',
    params,
    cacheTime: 5 * 60 * 1000 // 5 minutos
  });
}

// Crear una nueva flashcard
export async function createFlashcard(flashcard: FlashcardCreateDTO) {
  return httpClient<Flashcard, FlashcardCreateDTO>('/flashcards', {
    method: 'POST',
    data: flashcard
  });
}

// Actualizar una flashcard existente
export async function updateFlashcard(id: string, flashcard: FlashcardUpdateDTO) {
  return httpClient<Flashcard, FlashcardUpdateDTO>(`/flashcards/${id}`, {
    method: 'PUT',
    data: flashcard
  });
}

// Eliminar una flashcard
export async function deleteFlashcard(id: string) {
  return httpClient<null>(`/flashcards/${id}`, {
    method: 'DELETE'
  });
}
```

### Ejemplo de hook para usar el servicio

```typescript
import { useState, useEffect, useCallback } from 'react';
import { getAllFlashcards } from '../services/flashcardService';
import { useToast } from '../hooks/useToast';
import { Flashcard } from '../../@types';

export function useFlashcards(initialParams = {}) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);
  const toast = useToast();

  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getAllFlashcards(params);
      setFlashcards(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar flashcards';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    flashcards,
    pagination,
    isLoading,
    error,
    updateParams,
    refresh: fetchFlashcards
  };
}
```

## Siguientes Pasos

1. Revisar cada servicio existente y completar los pendientes
2. Implementar manejo consistente de errores y carga
3. Reemplazar datos mock con llamadas a API reales
4. Completar tests para validar la integración
5. Documentar cualquier cambio en la API en este documento 