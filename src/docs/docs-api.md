# Documentación Técnica de la API StudyIA

## Índice
1. [Introducción](#introducción)
2. [Base de la API](#base-de-la-api)
3. [Autenticación](#autenticación)
4. [Endpoints](#endpoints)
   - [Autenticación](#endpoints-de-autenticación)
   - [Usuarios](#endpoints-de-usuarios)
   - [Materiales](#endpoints-de-materiales)
   - [Resúmenes](#endpoints-de-resúmenes)
   - [Flashcards](#endpoints-de-flashcards)
   - [Exámenes](#endpoints-de-exámenes)
   - [Etiquetas](#endpoints-de-etiquetas)
5. [Tipos de Datos](#tipos-de-datos)
6. [Manejo de Errores](#manejo-de-errores)
7. [Formatos de Respuesta](#formatos-de-respuesta)

## Introducción

StudyIA es una API RESTful que proporciona servicios para la gestión de materiales de estudio, generación de resúmenes, flashcards y exámenes utilizando Inteligencia Artificial. Esta documentación detalla todos los endpoints disponibles, sus parámetros, tipos de datos esperados y las respuestas que pueden generar.

## Base de la API

### URL Base
```
http://localhost:3000/api
```

### Headers Comunes
```
Content-Type: application/json
Authorization: Bearer <token>
```

## Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens) con un sistema de tokens de acceso y refresco.

### Token de Acceso
- Duración: 1 día
- Se envía en el header `Authorization` como `Bearer <token>`
- También se almacena en una cookie HTTP-only llamada `accessToken`

### Token de Refresco
- Duración: 7 días
- Se almacena en una cookie HTTP-only llamada `refreshToken`
- Se puede enviar en el cuerpo de la petición para renovar el token de acceso

### Flujo de Autenticación
1. Registro de usuario (`POST /auth/register`)
2. Inicio de sesión (`POST /auth/login`)
3. Recepción de tokens (acceso y refresco)
4. Uso del token de acceso para peticiones autenticadas
5. Renovación del token de acceso cuando expire (`POST /auth/refresh-token`)

## Endpoints

### Endpoints de Autenticación

#### Registro de Usuario
```http
POST /auth/register
```

**Request Body:**
```typescript
{
  email: string; // Correo electrónico válido
  password: string; // Mínimo 8 caracteres, al menos una letra y un número
  name: string; // Nombre completo
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string; // Formato ISO 8601
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  };
  message: "Usuario registrado con éxito";
}
```

#### Inicio de Sesión
```http
POST /auth/login
```

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  };
  message: "Inicio de sesión exitoso";
}
```

#### Refrescar Token
```http
POST /auth/refresh-token
```

**Request Body** (opcional si se usan cookies):
```typescript
{
  refreshToken: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    accessToken: string;
  };
  message: "Tokens renovados correctamente";
}
```

#### Cerrar Sesión
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Sesión cerrada correctamente";
}
```

#### Solicitar Recuperación de Contraseña
```http
POST /auth/forgot-password
```

**Request Body:**
```typescript
{
  email: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña";
}
```

#### Restablecer Contraseña
```http
POST /auth/reset-password/:token
```

**URL Params:**
- `token`: Token de recuperación enviado por correo

**Request Body:**
```typescript
{
  password: string; // Nueva contraseña
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Contraseña actualizada correctamente";
}
```

#### Verificar Email
```http
GET /auth/verify-email/:token
```

**URL Params:**
- `token`: Token de verificación enviado por correo

**Response:**
Redirección a `${FRONTEND_URL}/email-verified`

#### Obtener Perfil Actual
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      emailVerified: boolean;
    }
  };
  message: "Perfil de usuario recuperado";
}
```

#### Solicitar Email de Verificación
```http
POST /auth/send-verification
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Email de verificación enviado";
}
```

### Endpoints de Usuarios

#### Obtener Perfil
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      emailVerified: boolean;
    }
  }
}
```

#### Actualizar Perfil
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name?: string;
  email?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      updatedAt: string;
    }
  }
}
```

#### Cambiar Contraseña
```http
PUT /users/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Contraseña actualizada correctamente";
}
```

#### Eliminar Cuenta
```http
DELETE /users/account
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Cuenta eliminada correctamente";
}
```

### Endpoints de Materiales

#### Obtener Todos los Materiales
```http
GET /materials
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)
- `search`: término de búsqueda (opcional)
- `tags`: filtro por etiquetas, separados por coma (opcional)
- `sort`: campo de ordenación (opcional)
- `order`: dirección de ordenación ('asc' o 'desc', default: 'desc')

**Response (200):**
```typescript
{
  status: "success";
  data: {
    materials: [
      {
        id: string;
        title: string;
        description: string;
        file_url: string | null;
        content: string | null;
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        createdAt: string;
        updatedAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener Un Material Específico
```http
GET /materials/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string | null;
      content: string | null;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Estado de Procesamiento
```http
GET /materials/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    processingStatus: "pending" | "completed" | "failed";
    message: string;
  };
}
```

#### Obtener Archivo del Material
```http
GET /materials/:id/file
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response:**
Archivo binario con el Content-Type apropiado o error 404 si no existe

#### Crear Material (Texto)
```http
POST /materials/text
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  title: string;
  description?: string;
  content: string; // Contenido textual del material
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      content: string;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
    }
  };
}
```

#### Crear Material (Archivo)
```http
POST /materials/file
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: archivo (PDF, TXT, DOCX, MD)
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional, IDs de etiquetas)

**Response (201):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
    }
  };
}
```

#### Eliminar Material
```http
DELETE /materials/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Material eliminado correctamente";
}
```

#### Procesar Material Completo
```http
POST /materials/process
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: archivo (PDF, TXT, DOCX, MD)
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional, IDs de etiquetas)
- `generate_summary`: boolean (opcional, default: false)
- `generate_flashcards`: boolean (opcional, default: false)
- `summary_format`: "bullet_points" | "paragraph" | "structured" (opcional)
- `summary_length`: "short" | "medium" | "long" (opcional)
- `flashcards_count`: number (opcional)
- `flashcards_difficulty`: "easy" | "medium" | "hard" (opcional)

**Response (202):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string;
      processingStatus: "pending";
      createdAt: string;
    }
  };
  message: "Material subido y procesamiento iniciado";
}
```

#### Generar Resumen para Material
```http
POST /materials/:id/summary
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Request Body:**
```typescript
{
  format?: "bullet_points" | "paragraph" | "structured"; // Formato del resumen
  length?: "short" | "medium" | "long"; // Longitud del resumen
  complexity?: "easy" | "medium" | "hard"; // Complejidad del resumen
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Generar Flashcards para Material
```http
POST /materials/:id/flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Request Body:**
```typescript
{
  count?: number; // Cantidad de flashcards a generar
  difficulty?: "easy" | "medium" | "hard"; // Dificultad de las flashcards
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        materialId: string;
        createdAt: string;
      }
    ]
  };
}
```

### Endpoints de Resúmenes

#### Obtener Todos los Resúmenes
```http
GET /summaries
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summaries: [
      {
        id: string;
        content: string;
        format: string;
        material: {
          id: string;
          title: string;
        };
        createdAt: string;
        updatedAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener un Resumen Específico
```http
GET /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      material: {
        id: string;
        title: string;
        description: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Resúmenes por Material
```http
GET /summaries/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summaries: [
      {
        id: string;
        content: string;
        format: string;
        createdAt: string;
        updatedAt: string;
      }
    ]
  };
}
```

#### Crear Resumen
```http
POST /summaries
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_id: string;
  content: string;
  format: string;
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Editar Resumen
```http
PUT /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Request Body:**
```typescript
{
  content?: string;
  format?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      updatedAt: string;
    }
  };
}
```

#### Eliminar Resumen
```http
DELETE /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Resumen eliminado correctamente";
}
```

### Endpoints de Flashcards

#### Obtener Todas las Flashcards
```http
GET /flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")
- `tags`: filtrar por etiquetas (array de IDs)
- `archived`: mostrar archivadas (boolean)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        archived: boolean;
        lastReviewed: string | null;
        material: {
          id: string;
          title: string;
        };
        createdAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener Flashcards por Material
```http
GET /flashcards/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        archived: boolean;
        lastReviewed: string | null;
        createdAt: string;
      }
    ]
  };
}
```

#### Obtener Detalles de una Flashcard
```http
GET /flashcards/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      archived: boolean;
      reviews: Array<{
        id: string;
        rating: number;
        notes: string;
        createdAt: string;
      }>;
      material: {
        id: string;
        title: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Flashcards para Estudio por Material
```http
GET /flashcards/study/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Query Parameters:**
- `limit`: número de flashcards (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        lastReviewed: string | null;
      }
    ]
  };
}
```

#### Obtener Todas las Flashcards para Estudio
```http
GET /flashcards/study
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: número de flashcards (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")
- `tags`: filtrar por etiquetas (array de IDs)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        material: {
          id: string;
          title: string;
        };
        lastReviewed: string | null;
      }
    ]
  };
}
```

#### Crear Flashcard
```http
POST /flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_id: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Registrar Revisión de Flashcard
```http
PUT /flashcards/:id/review
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Request Body:**
```typescript
{
  rating: number; // Valor del 1 al 5
  notes?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    review: {
      id: string;
      rating: number;
      notes: string;
      flashcardId: string;
      createdAt: string;
    };
    flashcard: {
      id: string;
      lastReviewed: string;
    }
  };
}
```

#### Archivar/Desarchivar Flashcard
```http
PUT /flashcards/:id/archive
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      archived: boolean;
      updatedAt: string;
    }
  };
  message: "Flashcard archivada|desarchivada correctamente";
}
```

#### Actualizar Flashcard
```http
PUT /flashcards/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Request Body:**
```typescript
{
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      updatedAt: string;
    }
  };
}
```

### Endpoints de Exámenes

#### Generar Examen
```http
POST /exams
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_ids: string[]; // Array de IDs de materiales
  difficulty?: "easy" | "medium" | "hard";
  duration_minutes?: number;
  questions_count?: number;
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    exam: {
      id: string;
      title: string;
      description: string;
      questions: Array<{
        type: "multiple_choice" | "true_false" | "short_answer";
        question: string;
        options?: string[];
        correct_answer: string;
        explanation?: string;
        points: number;
      }>;
      materials: Array<{
        id: string;
        title: string;
      }>;
      total_points: number;
      duration_minutes: number;
      difficulty: string;
      createdAt: string;
    }
  };
}
```

### Endpoints de Etiquetas

#### Obtener Todas las Etiquetas
```http
GET /tags
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    tags: [
      {
        id: string;
        name: string;
        color: string;
        count: number; // Número de elementos con esta etiqueta
        createdAt: string;
      }
    ]
  };
}
```

#### Crear Etiqueta
```http
POST /tags
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name: string;
  color?: string; // Código de color hexadecimal
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    tag: {
      id: string;
      name: string;
      color: string;
      createdAt: string;
    }
  };
}
```

#### Actualizar Etiqueta
```http
PUT /tags/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la etiqueta

**Request Body:**
```typescript
{
  name?: string;
  color?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    tag: {
      id: string;
      name: string;
      color: string;
      updatedAt: string;
    }
  };
}
```

#### Eliminar Etiqueta
```http
DELETE /tags/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la etiqueta

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Etiqueta eliminada correctamente";
}
```

## Tipos de Datos

### Usuario
```typescript
{
  id: string; // UUID
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Material
```typescript
{
  id: string; // UUID
  title: string;
  description: string | null;
  file_url: string | null;
  content: string | null;
  userId: string; // UUID del creador
  processingStatus?: "pending" | "completed" | "failed";
  tags: Tag[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Resumen
```typescript
{
  id: string; // UUID
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Flashcard
```typescript
{
  id: string; // UUID
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: Tag[];
  archived: boolean;
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  lastReviewed: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Revisión de Flashcard
```typescript
{
  id: string; // UUID
  rating: number; // 1-5
  notes: string | null;
  flashcardId: string; // UUID de la flashcard
  userId: string; // UUID del usuario
  createdAt: string; // ISO 8601
}
```

### Etiqueta
```typescript
{
  id: string; // UUID
  name: string;
  color: string; // Código hexadecimal ej: "#FF5733"
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Examen
```typescript
{
  id: string; // UUID
  title: string;
  description: string;
  questions: Array<{
    type: "multiple_choice" | "true_false" | "short_answer";
    question: string;
    options?: string[];
    correct_answer: string;
    explanation?: string;
    points: number;
  }>;
  materials: Array<{
    id: string;
    title: string;
  }>;
  total_points: number;
  duration_minutes: number;
  difficulty: "easy" | "medium" | "hard";
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

## Manejo de Errores

La API utiliza un formato consistente para todos los errores:

```typescript
{
  status: "error";
  message: string;
  code: number;
  errors?: Array<{
    path: string;
    message: string;
  }>; // Solo presente en errores de validación
}
```

### Códigos de Error HTTP
- `400`: Bad Request - Error de validación
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No tiene permisos
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto con estado actual
- `422`: Unprocessable Entity - Datos inválidos
- `429`: Too Many Requests - Límite de peticiones excedido
- `500`: Internal Server Error - Error interno del servidor
- `503`: Service Unavailable - Servicio no disponible temporalmente

### Ejemplos de Errores

#### Error de Validación (400)
```json
{
  "status": "error",
  "message": "Error de validación",
  "code": 400,
  "errors": [
    {
      "path": "email",
      "message": "El email es obligatorio"
    },
    {
      "path": "password",
      "message": "La contraseña debe tener al menos 8 caracteres"
    }
  ]
}
```

#### Recurso No Encontrado (404)
```json
{
  "status": "error",
  "message": "Material no encontrado",
  "code": 404
}
```

#### Error del Servidor (500)
```json
{
  "status": "error",
  "message": "Error interno del servidor",
  "code": 500
}
```

## Formatos de Respuesta

Todas las respuestas exitosas siguen este formato:

```typescript
{
  status: "success";
  data: any; // Datos específicos del endpoint
  message?: string; // Mensaje opcional
}
```

### Respuestas Paginadas
Los endpoints que devuelven listas incluyen información de paginación:

```typescript
{
  status: "success";
  data: {
    items: any[]; // Array de elementos
    pagination: {
      total: number; // Total de elementos
      page: number; // Página actual
      limit: number; // Elementos por página
      pages: number; // Total de páginas
    }
  }
}
``` # Documentación Técnica de la API StudyIA

## Índice
1. [Introducción](#introducción)
2. [Base de la API](#base-de-la-api)
3. [Autenticación](#autenticación)
4. [Endpoints](#endpoints)
   - [Autenticación](#endpoints-de-autenticación)
   - [Usuarios](#endpoints-de-usuarios)
   - [Materiales](#endpoints-de-materiales)
   - [Resúmenes](#endpoints-de-resúmenes)
   - [Flashcards](#endpoints-de-flashcards)
   - [Exámenes](#endpoints-de-exámenes)
   - [Etiquetas](#endpoints-de-etiquetas)
5. [Tipos de Datos](#tipos-de-datos)
6. [Manejo de Errores](#manejo-de-errores)
7. [Formatos de Respuesta](#formatos-de-respuesta)

## Introducción

StudyIA es una API RESTful que proporciona servicios para la gestión de materiales de estudio, generación de resúmenes, flashcards y exámenes utilizando Inteligencia Artificial. Esta documentación detalla todos los endpoints disponibles, sus parámetros, tipos de datos esperados y las respuestas que pueden generar.

## Base de la API

### URL Base
```
http://localhost:3000/api/v1
```

### Headers Comunes
```
Content-Type: application/json
Authorization: Bearer <token>
```

## Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens) con un sistema de tokens de acceso y refresco.

### Token de Acceso
- Duración: 15 minutos
- Se envía en el header `Authorization` como `Bearer <token>`
- También se almacena en una cookie HTTP-only llamada `accessToken`

### Token de Refresco
- Duración: 7 días
- Se almacena en una cookie HTTP-only llamada `refreshToken`
- Se puede enviar en el cuerpo de la petición para renovar el token de acceso

### Flujo de Autenticación
1. Registro de usuario (`POST /auth/register`)
2. Inicio de sesión (`POST /auth/login`)
3. Recepción de tokens (acceso y refresco)
4. Uso del token de acceso para peticiones autenticadas
5. Renovación del token de acceso cuando expire (`POST /auth/refresh-token`)

## Endpoints

### Endpoints de Autenticación

#### Registro de Usuario
```http
POST /auth/register
```

**Request Body:**
```typescript
{
  email: string; // Correo electrónico válido
  password: string; // Mínimo 8 caracteres, al menos una letra y un número
  name: string; // Nombre completo
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string; // Formato ISO 8601
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  };
  message: "Usuario registrado con éxito";
}
```

#### Inicio de Sesión
```http
POST /auth/login
```

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  };
  message: "Inicio de sesión exitoso";
}
```

#### Refrescar Token
```http
POST /auth/refresh-token
```

**Request Body** (opcional si se usan cookies):
```typescript
{
  refreshToken: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    accessToken: string;
  };
  message: "Tokens renovados correctamente";
}
```

#### Cerrar Sesión
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Sesión cerrada correctamente";
}
```

#### Solicitar Recuperación de Contraseña
```http
POST /auth/forgot-password
```

**Request Body:**
```typescript
{
  email: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña";
}
```

#### Restablecer Contraseña
```http
POST /auth/reset-password/:token
```

**URL Params:**
- `token`: Token de recuperación enviado por correo

**Request Body:**
```typescript
{
  password: string; // Nueva contraseña
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Contraseña actualizada correctamente";
}
```

#### Verificar Email
```http
GET /auth/verify-email/:token
```

**URL Params:**
- `token`: Token de verificación enviado por correo

**Response:**
Redirección a `${FRONTEND_URL}/email-verified`

#### Obtener Perfil Actual
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      emailVerified: boolean;
    }
  };
  message: "Perfil de usuario recuperado";
}
```

#### Solicitar Email de Verificación
```http
POST /auth/send-verification
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Email de verificación enviado";
}
```

### Endpoints de Usuarios

#### Obtener Perfil
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      emailVerified: boolean;
    }
  }
}
```

#### Actualizar Perfil
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name?: string;
  email?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      updatedAt: string;
    }
  }
}
```

#### Cambiar Contraseña
```http
PUT /users/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Contraseña actualizada correctamente";
}
```

#### Eliminar Cuenta
```http
DELETE /users/account
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Cuenta eliminada correctamente";
}
```

### Endpoints de Materiales

#### Obtener Todos los Materiales
```http
GET /materials
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)
- `search`: término de búsqueda (opcional)
- `tags`: filtro por etiquetas, separados por coma (opcional)
- `sort`: campo de ordenación (opcional)
- `order`: dirección de ordenación ('asc' o 'desc', default: 'desc')

**Response (200):**
```typescript
{
  status: "success";
  data: {
    materials: [
      {
        id: string;
        title: string;
        description: string;
        file_url: string | null;
        content: string | null;
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        createdAt: string;
        updatedAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener Un Material Específico
```http
GET /materials/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string | null;
      content: string | null;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Estado de Procesamiento
```http
GET /materials/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    processingStatus: "pending" | "completed" | "failed";
    message: string;
  };
}
```

#### Obtener Archivo del Material
```http
GET /materials/:id/file
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response:**
Archivo binario con el Content-Type apropiado o error 404 si no existe

#### Crear Material (Texto)
```http
POST /materials/text
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  title: string;
  description?: string;
  content: string; // Contenido textual del material
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      content: string;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
    }
  };
}
```

#### Crear Material (Archivo)
```http
POST /materials/file
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: archivo (PDF, TXT, DOCX, MD)
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional, IDs de etiquetas)

**Response (201):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string;
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      createdAt: string;
    }
  };
}
```

#### Eliminar Material
```http
DELETE /materials/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Material eliminado correctamente";
}
```

#### Procesar Material Completo
```http
POST /materials/process
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file`: archivo (PDF, TXT, DOCX, MD)
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional, IDs de etiquetas)
- `generate_summary`: boolean (opcional, default: false)
- `generate_flashcards`: boolean (opcional, default: false)
- `summary_format`: "bullet_points" | "paragraph" | "structured" (opcional)
- `summary_length`: "short" | "medium" | "long" (opcional)
- `flashcards_count`: number (opcional)
- `flashcards_difficulty`: "easy" | "medium" | "hard" (opcional)

**Response (202):**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string;
      title: string;
      description: string;
      file_url: string;
      processingStatus: "pending";
      createdAt: string;
    }
  };
  message: "Material subido y procesamiento iniciado";
}
```

#### Generar Resumen para Material
```http
POST /materials/:id/summary
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Request Body:**
```typescript
{
  format?: "bullet_points" | "paragraph" | "structured"; // Formato del resumen
  length?: "short" | "medium" | "long"; // Longitud del resumen
  complexity?: "easy" | "medium" | "hard"; // Complejidad del resumen
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Generar Flashcards para Material
```http
POST /materials/:id/flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del material

**Request Body:**
```typescript
{
  count?: number; // Cantidad de flashcards a generar
  difficulty?: "easy" | "medium" | "hard"; // Dificultad de las flashcards
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        materialId: string;
        createdAt: string;
      }
    ]
  };
}
```

### Endpoints de Resúmenes

#### Obtener Todos los Resúmenes
```http
GET /summaries
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summaries: [
      {
        id: string;
        content: string;
        format: string;
        material: {
          id: string;
          title: string;
        };
        createdAt: string;
        updatedAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener un Resumen Específico
```http
GET /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      material: {
        id: string;
        title: string;
        description: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Resúmenes por Material
```http
GET /summaries/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summaries: [
      {
        id: string;
        content: string;
        format: string;
        createdAt: string;
        updatedAt: string;
      }
    ]
  };
}
```

#### Crear Resumen
```http
POST /summaries
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_id: string;
  content: string;
  format: string;
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Editar Resumen
```http
PUT /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Request Body:**
```typescript
{
  content?: string;
  format?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    summary: {
      id: string;
      content: string;
      format: string;
      materialId: string;
      updatedAt: string;
    }
  };
}
```

#### Eliminar Resumen
```http
DELETE /summaries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID del resumen

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Resumen eliminado correctamente";
}
```

### Endpoints de Flashcards

#### Obtener Todas las Flashcards
```http
GET /flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")
- `tags`: filtrar por etiquetas (array de IDs)
- `archived`: mostrar archivadas (boolean)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        archived: boolean;
        lastReviewed: string | null;
        material: {
          id: string;
          title: string;
        };
        createdAt: string;
      }
    ];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
}
```

#### Obtener Flashcards por Material
```http
GET /flashcards/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        tags: Array<{
          id: string;
          name: string;
          color: string;
        }>;
        archived: boolean;
        lastReviewed: string | null;
        createdAt: string;
      }
    ]
  };
}
```

#### Obtener Detalles de una Flashcard
```http
GET /flashcards/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      archived: boolean;
      reviews: Array<{
        id: string;
        rating: number;
        notes: string;
        createdAt: string;
      }>;
      material: {
        id: string;
        title: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  };
}
```

#### Obtener Flashcards para Estudio por Material
```http
GET /flashcards/study/material/:material_id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `material_id`: ID del material

**Query Parameters:**
- `limit`: número de flashcards (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        lastReviewed: string | null;
      }
    ]
  };
}
```

#### Obtener Todas las Flashcards para Estudio
```http
GET /flashcards/study
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: número de flashcards (default: 10)
- `difficulty`: filtrar por dificultad ("easy", "medium", "hard")
- `tags`: filtrar por etiquetas (array de IDs)

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcards: [
      {
        id: string;
        question: string;
        answer: string;
        difficulty: "easy" | "medium" | "hard";
        material: {
          id: string;
          title: string;
        };
        lastReviewed: string | null;
      }
    ]
  };
}
```

#### Crear Flashcard
```http
POST /flashcards
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_id: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      materialId: string;
      createdAt: string;
    }
  };
}
```

#### Registrar Revisión de Flashcard
```http
PUT /flashcards/:id/review
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Request Body:**
```typescript
{
  rating: number; // Valor del 1 al 5
  notes?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    review: {
      id: string;
      rating: number;
      notes: string;
      flashcardId: string;
      createdAt: string;
    };
    flashcard: {
      id: string;
      lastReviewed: string;
    }
  };
}
```

#### Archivar/Desarchivar Flashcard
```http
PUT /flashcards/:id/archive
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      archived: boolean;
      updatedAt: string;
    }
  };
  message: "Flashcard archivada|desarchivada correctamente";
}
```

#### Actualizar Flashcard
```http
PUT /flashcards/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la flashcard

**Request Body:**
```typescript
{
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs de etiquetas
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string;
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
      tags: Array<{
        id: string;
        name: string;
        color: string;
      }>;
      updatedAt: string;
    }
  };
}
```

### Endpoints de Exámenes

#### Generar Examen
```http
POST /exams
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  material_ids: string[]; // Array de IDs de materiales
  difficulty?: "easy" | "medium" | "hard";
  duration_minutes?: number;
  questions_count?: number;
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    exam: {
      id: string;
      title: string;
      description: string;
      questions: Array<{
        type: "multiple_choice" | "true_false" | "short_answer";
        question: string;
        options?: string[];
        correct_answer: string;
        explanation?: string;
        points: number;
      }>;
      materials: Array<{
        id: string;
        title: string;
      }>;
      total_points: number;
      duration_minutes: number;
      difficulty: string;
      createdAt: string;
    }
  };
}
```

### Endpoints de Etiquetas

#### Obtener Todas las Etiquetas
```http
GET /tags
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    tags: [
      {
        id: string;
        name: string;
        color: string;
        count: number; // Número de elementos con esta etiqueta
        createdAt: string;
      }
    ]
  };
}
```

#### Crear Etiqueta
```http
POST /tags
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name: string;
  color?: string; // Código de color hexadecimal
}
```

**Response (201):**
```typescript
{
  status: "success";
  data: {
    tag: {
      id: string;
      name: string;
      color: string;
      createdAt: string;
    }
  };
}
```

#### Actualizar Etiqueta
```http
PUT /tags/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la etiqueta

**Request Body:**
```typescript
{
  name?: string;
  color?: string;
}
```

**Response (200):**
```typescript
{
  status: "success";
  data: {
    tag: {
      id: string;
      name: string;
      color: string;
      updatedAt: string;
    }
  };
}
```

#### Eliminar Etiqueta
```http
DELETE /tags/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**
- `id`: ID de la etiqueta

**Response (200):**
```typescript
{
  status: "success";
  data: null;
  message: "Etiqueta eliminada correctamente";
}
```

## Tipos de Datos

### Usuario
```typescript
{
  id: string; // UUID
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Material
```typescript
{
  id: string; // UUID
  title: string;
  description: string | null;
  file_url: string | null;
  content: string | null;
  userId: string; // UUID del creador
  processingStatus?: "pending" | "completed" | "failed";
  tags: Tag[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Resumen
```typescript
{
  id: string; // UUID
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Flashcard
```typescript
{
  id: string; // UUID
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: Tag[];
  archived: boolean;
  materialId: string; // UUID del material
  userId: string; // UUID del creador
  lastReviewed: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Revisión de Flashcard
```typescript
{
  id: string; // UUID
  rating: number; // 1-5
  notes: string | null;
  flashcardId: string; // UUID de la flashcard
  userId: string; // UUID del usuario
  createdAt: string; // ISO 8601
}
```

### Etiqueta
```typescript
{
  id: string; // UUID
  name: string;
  color: string; // Código hexadecimal ej: "#FF5733"
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Examen
```typescript
{
  id: string; // UUID
  title: string;
  description: string;
  questions: Array<{
    type: "multiple_choice" | "true_false" | "short_answer";
    question: string;
    options?: string[];
    correct_answer: string;
    explanation?: string;
    points: number;
  }>;
  materials: Array<{
    id: string;
    title: string;
  }>;
  total_points: number;
  duration_minutes: number;
  difficulty: "easy" | "medium" | "hard";
  userId: string; // UUID del creador
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

## Manejo de Errores

La API utiliza un formato consistente para todos los errores:

```typescript
{
  status: "error";
  message: string;
  code: number;
  errors?: Array<{
    path: string;
    message: string;
  }>; // Solo presente en errores de validación
}
```

### Códigos de Error HTTP
- `400`: Bad Request - Error de validación
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No tiene permisos
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto con estado actual
- `422`: Unprocessable Entity - Datos inválidos
- `429`: Too Many Requests - Límite de peticiones excedido
- `500`: Internal Server Error - Error interno del servidor
- `503`: Service Unavailable - Servicio no disponible temporalmente

### Ejemplos de Errores

#### Error de Validación (400)
```json
{
  "status": "error",
  "message": "Error de validación",
  "code": 400,
  "errors": [
    {
      "path": "email",
      "message": "El email es obligatorio"
    },
    {
      "path": "password",
      "message": "La contraseña debe tener al menos 8 caracteres"
    }
  ]
}
```

#### Recurso No Encontrado (404)
```json
{
  "status": "error",
  "message": "Material no encontrado",
  "code": 404
}
```

#### Error del Servidor (500)
```json
{
  "status": "error",
  "message": "Error interno del servidor",
  "code": 500
}
```

## Formatos de Respuesta

Todas las respuestas exitosas siguen este formato:

```typescript
{
  status: "success";
  data: any; // Datos específicos del endpoint
  message?: string; // Mensaje opcional
}
```

### Respuestas Paginadas
Los endpoints que devuelven listas incluyen información de paginación:

```typescript
{
  status: "success";
  data: {
    items: any[]; // Array de elementos
    pagination: {
      total: number; // Total de elementos
      page: number; // Página actual
      limit: number; // Elementos por página
      pages: number; // Total de páginas
    }
  }
}
``` 