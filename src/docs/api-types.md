# Documentación de Tipos de Datos - API StudyIA

## Índice
1. [Introducción](#introducción)
2. [Tipos Primitivos y Comunes](#tipos-primitivos-y-comunes)
3. [Entidades Principales](#entidades-principales)
   - [Usuario (User)](#usuario-user)
   - [Token de Refresco (RefreshToken)](#token-de-refresco-refreshtoken)
   - [Material de Estudio (Material)](#material-de-estudio-material)
   - [Etiqueta (Tag)](#etiqueta-tag)
   - [Resumen (Summary)](#resumen-summary)
   - [Flashcard](#flashcard)
   - [Revisión de Flashcard (FlashcardReview)](#revisión-de-flashcard-flashcardreview)
   - [Examen (Exam)](#examen-exam)
   - [Pregunta de Examen (ExamQuestion)](#pregunta-de-examen-examquestion)
4. [Tipos de Request Body](#tipos-de-request-body)
   - [Autenticación](#autenticación-requests)
   - [Usuarios](#usuarios-requests)
   - [Materiales](#materiales-requests)
   - [Resúmenes](#resúmenes-requests)
   - [Flashcards](#flashcards-requests)
   - [Exámenes](#exámenes-requests)
   - [Etiquetas](#etiquetas-requests)
5. [Tipos de Response Body](#tipos-de-response-body)
   - [Respuestas Genéricas](#respuestas-genéricas)
   - [Respuestas Paginadas](#respuestas-paginadas)
   - [Autenticación](#autenticación-responses)
   - [Usuarios](#usuarios-responses)
   - [Materiales](#materiales-responses)
   - [Resúmenes](#resúmenes-responses)
   - [Flashcards](#flashcards-responses)
   - [Exámenes](#exámenes-responses)
   - [Etiquetas](#etiquetas-responses)
6. [Tipos Literales y Enums](#tipos-literales-y-enums)

## Introducción

Esta documentación describe detalladamente todos los tipos de datos utilizados en la API de StudyIA. Sirve como referencia para entender las estructuras de datos esperadas en las solicitudes y las devueltas en las respuestas.

## Tipos Primitivos y Comunes

- `string`: Cadena de texto.
- `string (UUID)`: Cadena de texto representando un Identificador Único Universal (ej: "123e4567-e89b-12d3-a456-426614174000"). Usado como clave primaria para la mayoría de las entidades.
- `string (ISO 8601)`: Cadena de texto representando una fecha y hora en formato ISO 8601 (ej: "2023-10-27T10:30:00.000Z").
- `string (email)`: Cadena de texto representando una dirección de correo electrónico válida.
- `string (password)`: Cadena de texto con requisitos específicos (mínimo 8 caracteres, etc.). En la base de datos se almacena hasheada.
- `string (hexColor)`: Cadena de texto representando un color en formato hexadecimal (ej: "#FF5733").
- `number`: Número (entero o decimal).
- `number (integer)`: Número entero.
- `boolean`: Valor booleano (`true` o `false`).
- `null`: Representa la ausencia intencional de un valor de objeto.
- `Array<T>`: Arreglo de elementos del tipo `T`.
- `object`: Objeto genérico de JavaScript.

## Entidades Principales

Estos tipos representan las entidades principales almacenadas en la base de datos.

### Usuario (User)
Representa a un usuario registrado en la aplicación.
```typescript
{
  id: string; // UUID, Clave primaria
  name: string; // Nombre del usuario
  email: string; // Email único del usuario
  password: string; // Contraseña hasheada (no expuesta en API)
  emailVerified: boolean; // Indica si el email ha sido verificado
  verificationToken: string | null; // Token para verificar email (no expuesto)
  passwordResetToken: string | null; // Token para resetear contraseña (no expuesto)
  passwordResetExpires: Date | null; // Expiración del token de reseteo (no expuesto)
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Token de Refresco (RefreshToken)
Almacena los tokens de refresco válidos para los usuarios.
```typescript
{
  id: string; // UUID, Clave primaria
  token: string; // El token de refresco (hasheado en BD)
  userId: string; // UUID, ID del usuario al que pertenece
  expires: string; // ISO 8601, Fecha de expiración del token
  createdAt: string; // ISO 8601, Fecha de creación
}
```

### Material de Estudio (Material)
Representa un material de estudio, que puede ser texto o un archivo.
```typescript
{
  id: string; // UUID, Clave primaria
  title: string; // Título del material
  description: string | null; // Descripción opcional
  file_url: string | null; // URL del archivo subido (si aplica)
  content: string | null; // Contenido textual (si aplica)
  userId: string; // UUID, ID del usuario propietario
  processingStatus: "pending" | "completed" | "failed" | null; // Estado del procesamiento IA
  // Relaciones (pobladas en respuestas API):
  tags?: Tag[]; // Etiquetas asociadas
  summaries?: Summary[]; // Resúmenes asociados
  flashcards?: Flashcard[]; // Flashcards asociadas
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Etiqueta (Tag)
Permite categorizar materiales, flashcards, etc.
```typescript
{
  id: string; // UUID, Clave primaria
  name: string; // Nombre de la etiqueta (único por usuario)
  color: string; // string (hexColor), Color asociado a la etiqueta
  userId: string; // UUID, ID del usuario propietario
  // Propiedades calculadas (pobladas en API):
  count?: number; // Número de elementos asociados (calculado)
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Resumen (Summary)
Representa un resumen generado (o creado) a partir de un material.
```typescript
{
  id: string; // UUID, Clave primaria
  content: string; // Contenido del resumen
  format: "bullet_points" | "paragraph" | "structured"; // Formato del resumen
  materialId: string; // UUID, ID del material asociado
  userId: string; // UUID, ID del usuario propietario
  // Relaciones (pobladas en respuestas API):
  material?: Material; // Material asociado
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Flashcard
Representa una tarjeta de estudio individual (pregunta/respuesta).
```typescript
{
  id: string; // UUID, Clave primaria
  question: string; // Pregunta de la flashcard
  answer: string; // Respuesta de la flashcard
  difficulty: "easy" | "medium" | "hard"; // Nivel de dificultad
  archived: boolean; // Indica si la flashcard está archivada
  materialId: string; // UUID, ID del material asociado
  userId: string; // UUID, ID del usuario propietario
  lastReviewed: string | null; // ISO 8601, Fecha de la última revisión
  // Relaciones (pobladas en respuestas API):
  tags?: Tag[]; // Etiquetas asociadas
  reviews?: FlashcardReview[]; // Historial de revisiones
  material?: Material; // Material asociado
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Revisión de Flashcard (FlashcardReview)
Registra una sesión de estudio de una flashcard específica.
```typescript
{
  id: string; // UUID, Clave primaria
  rating: number; // number (integer), Calificación dada (1-5)
  notes: string | null; // Notas opcionales de la revisión
  flashcardId: string; // UUID, ID de la flashcard revisada
  userId: string; // UUID, ID del usuario que revisó
  createdAt: string; // ISO 8601, Fecha de la revisión
}
```

### Examen (Exam)
Representa un examen generado a partir de uno o más materiales.
```typescript
{
  id: string; // UUID, Clave primaria
  title: string; // Título del examen (probablemente generado)
  description: string; // Descripción del examen
  total_points: number; // number (integer), Puntuación total posible
  duration_minutes: number; // number (integer), Duración estimada en minutos
  difficulty: "easy" | "medium" | "hard"; // Dificultad general del examen
  userId: string; // UUID, ID del usuario propietario
  // Relaciones (pobladas en respuestas API):
  questions?: ExamQuestion[]; // Preguntas del examen
  materials?: Material[]; // Materiales base del examen
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

### Pregunta de Examen (ExamQuestion)
Representa una pregunta individual dentro de un examen.
```typescript
{
  id: string; // UUID, Clave primaria
  examId: string; // UUID, ID del examen al que pertenece
  type: "multiple_choice" | "true_false" | "short_answer"; // Tipo de pregunta
  question: string; // Texto de la pregunta
  options: string[] | null; // Opciones para multiple_choice
  correct_answer: string; // Respuesta correcta
  explanation: string | null; // Explicación opcional de la respuesta
  points: number; // number (integer), Puntos asignados a la pregunta
  createdAt: string; // ISO 8601, Fecha de creación
  updatedAt: string; // ISO 8601, Fecha de última actualización
}
```

## Tipos de Request Body

Estos tipos definen la estructura esperada en el cuerpo (`body`) de las solicitudes `POST` y `PUT`.

### Autenticación (Requests)

**POST /auth/register**
```typescript
{
  email: string; // email
  password: string; // password
  name: string;
}
```

**POST /auth/login**
```typescript
{
  email: string; // email
  password: string; // password
}
```

**POST /auth/refresh-token**
```typescript
{
  refreshToken: string; // Opcional si se usan cookies
}
```

**POST /auth/forgot-password**
```typescript
{
  email: string; // email
}
```

**POST /auth/reset-password/:token**
```typescript
{
  password: string; // Nueva contraseña
}
```

### Usuarios (Requests)

**PUT /users/profile**
```typescript
{
  name?: string; // Nombre opcional a actualizar
  email?: string; // Email opcional a actualizar
}
```

**PUT /users/change-password**
```typescript
{
  currentPassword: string; // Contraseña actual
  newPassword: string; // Nueva contraseña
}
```

### Materiales (Requests)

**POST /materials (Texto)**
```typescript
{
  title: string;
  description?: string; // Opcional
  content: string; // Contenido textual
  tags?: string[]; // Array de IDs (UUID) de etiquetas existentes (opcional)
}
```

**POST /materials (Archivo)**
(multipart/form-data)
- `file`: Archivo (tipos permitidos: PDF, TXT, DOCX, MD)
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional, array de IDs (UUID) de etiquetas)

**POST /materials/process**
(multipart/form-data)
- `file`: Archivo
- `title`: string
- `description`: string (opcional)
- `tags`: string[] (opcional)
- `generate_summary`: boolean (opcional, default: false)
- `generate_flashcards`: boolean (opcional, default: false)
- `summary_format`: "bullet_points" | "paragraph" | "structured" (opcional)
- `summary_length`: "short" | "medium" | "long" (opcional)
- `flashcards_count`: number (opcional)
- `flashcards_difficulty`: "easy" | "medium" | "hard" (opcional)

**POST /materials/:id/summary**
```typescript
{
  format?: "bullet_points" | "paragraph" | "structured";
  length?: "short" | "medium" | "long";
  complexity?: "easy" | "medium" | "hard";
}
```

**POST /materials/:id/flashcards**
```typescript
{
  count?: number; // number (integer)
  difficulty?: "easy" | "medium" | "hard";
}
```

### Resúmenes (Requests)

**POST /summaries**
```typescript
{
  material_id: string; // UUID
  content: string;
  format: "bullet_points" | "paragraph" | "structured";
}
```

**PUT /summaries/:id**
```typescript
{
  content?: string;
  format?: "bullet_points" | "paragraph" | "structured";
}
```

### Flashcards (Requests)

**POST /flashcards**
```typescript
{
  material_id: string; // UUID
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard"; // Default: medium
  tags?: string[]; // Array de IDs (UUID) de etiquetas (opcional)
}
```

**PUT /flashcards/:id/review**
```typescript
{
  rating: number; // number (integer) entre 1 y 5
  notes?: string; // Opcional
}
```

**PUT /flashcards/:id**
```typescript
{
  question?: string;
  answer?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[]; // Array de IDs (UUID) de etiquetas (opcional)
}
```

### Exámenes (Requests)

**POST /exams**
```typescript
{
  material_ids: string[]; // Array de IDs (UUID) de materiales
  difficulty?: "easy" | "medium" | "hard";
  duration_minutes?: number; // number (integer)
  questions_count?: number; // number (integer)
}
```

### Etiquetas (Requests)

**POST /tags**
```typescript
{
  name: string;
  color?: string; // string (hexColor), opcional
}
```

**PUT /tags/:id**
```typescript
{
  name?: string;
  color?: string; // string (hexColor)
}
```

## Tipos de Response Body

Define la estructura de los datos (`data`) dentro de las respuestas exitosas.

### Respuestas Genéricas

**Respuesta Exitosa Simple**
```typescript
{
  status: "success";
  data: T | null; // El tipo de dato específico o null
  message?: string; // Mensaje opcional
}
```

**Respuesta de Error**
```typescript
{
  status: "error";
  message: string;
  code: number; // Código de estado HTTP
  errors?: Array<{ path: string; message: string }>; // Para errores de validación
}
```

### Respuestas Paginadas
Usado en endpoints que devuelven listas (ej: `GET /materials`, `GET /flashcards`).
```typescript
{
  status: "success";
  data: {
    items: T[]; // Array de elementos del tipo T
    pagination: {
      total: number; // Total de elementos encontrados
      page: number; // Página actual
      limit: number; // Límite de elementos por página
      pages: number; // Número total de páginas
    }
  }
}
```
Donde `T` es el tipo del elemento listado (ej: `Material`, `Flashcard`).

### Autenticación (Responses)

**POST /auth/register (201)**
```typescript
{
  status: "success";
  data: {
    user: UserPublicProfile; // Ver abajo
    tokens: { accessToken: string; refreshToken: string; };
  };
  message: string;
}
```

**POST /auth/login (200)**
```typescript
{
  status: "success";
  data: {
    user: UserPublicProfile;
    tokens: { accessToken: string; refreshToken: string; };
  };
  message: string;
}
```

**POST /auth/refresh-token (200)**
```typescript
{
  status: "success";
  data: {
    accessToken: string;
  };
  message: string;
}
```

**GET /auth/me (200)**
```typescript
{
  status: "success";
  data: {
    user: UserPublicProfile;
  };
  message: string;
}
```

**UserPublicProfile** (Datos del usuario expuestos en la API)
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

### Usuarios (Responses)

**GET /users/profile (200)**
```typescript
{
  status: "success";
  data: {
    user: UserPublicProfile;
  };
}
```

**PUT /users/profile (200)**
```typescript
{
  status: "success";
  data: {
    user: UserPublicProfile;
  };
}
```

### Materiales (Responses)

**GET /materials (200)** - Ver [Respuestas Paginadas](#respuestas-paginadas) con `T = MaterialApiResponse`

**GET /materials/:id (200)**
```typescript
{
  status: "success";
  data: {
    material: MaterialApiResponse;
  };
}
```

**GET /materials/:id/status (200)**
```typescript
{
  status: "success";
  data: {
    processingStatus: "pending" | "completed" | "failed" | null;
    message: string; // Mensaje descriptivo del estado
  };
}
```

**POST /materials (Texto) (201)**
```typescript
{
  status: "success";
  data: {
    material: MaterialApiResponse;
  };
}
```

**POST /materials (Archivo) (201)**
```typescript
{
  status: "success";
  data: {
    material: MaterialApiResponse;
  };
}
```

**POST /materials/process (202)**
```typescript
{
  status: "success";
  data: {
    material: {
      id: string; // UUID
      title: string;
      description: string | null;
      file_url: string | null;
      processingStatus: "pending";
      createdAt: string; // ISO 8601
    };
  };
  message: string;
}
```

**POST /materials/:id/summary (200)**
```typescript
{
  status: "success";
  data: {
    summary: SummaryApiResponse;
  };
}
```

**POST /materials/:id/flashcards (200)**
```typescript
{
  status: "success";
  data: {
    flashcards: FlashcardApiResponse[];
  };
}
```

**MaterialApiResponse** (Material expuesto en la API)
```typescript
{
  id: string; // UUID
  title: string;
  description: string | null;
  file_url: string | null;
  content: string | null;
  processingStatus: "pending" | "completed" | "failed" | null;
  tags: TagApiResponse[]; // Etiquetas asociadas
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Resúmenes (Responses)

**GET /summaries (200)** - Ver [Respuestas Paginadas](#respuestas-paginadas) con `T = SummaryApiResponse`

**GET /summaries/:id (200)**
```typescript
{
  status: "success";
  data: {
    summary: SummaryDetailedApiResponse;
  };
}
```

**GET /summaries/material/:material_id (200)**
```typescript
{
  status: "success";
  data: {
    summaries: SummaryApiResponse[];
  };
}
```

**POST /summaries (201)**
```typescript
{
  status: "success";
  data: {
    summary: SummaryApiResponse;
  };
}
```

**PUT /summaries/:id (200)**
```typescript
{
  status: "success";
  data: {
    summary: SummaryApiResponse;
  };
}
```

**SummaryApiResponse**
```typescript
{
  id: string; // UUID
  content: string; // Solo un extracto corto podría ser devuelto en listas
  format: "bullet_points" | "paragraph" | "structured";
  materialId: string; // UUID
  // Opcional, si se incluye info del material:
  material?: {
    id: string; // UUID
    title: string;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**SummaryDetailedApiResponse**
```typescript
{
  id: string; // UUID
  content: string; // Contenido completo
  format: "bullet_points" | "paragraph" | "structured";
  material: {
    id: string; // UUID
    title: string;
    description: string | null;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Flashcards (Responses)

**GET /flashcards (200)** - Ver [Respuestas Paginadas](#respuestas-paginadas) con `T = FlashcardApiResponse`

**GET /flashcards/material/:material_id (200)**
```typescript
{
  status: "success";
  data: {
    flashcards: FlashcardApiResponse[];
  };
}
```

**GET /flashcards/:id (200)**
```typescript
{
  status: "success";
  data: {
    flashcard: FlashcardDetailedApiResponse;
  };
}
```

**GET /flashcards/study/... (200)**
```typescript
{
  status: "success";
  data: {
    flashcards: FlashcardStudyApiResponse[];
  };
}
```

**POST /flashcards (201)**
```typescript
{
  status: "success";
  data: {
    flashcard: FlashcardApiResponse;
  };
}
```

**PUT /flashcards/:id/review (200)**
```typescript
{
  status: "success";
  data: {
    review: FlashcardReviewApiResponse;
    flashcard: { // Info actualizada de la flashcard
      id: string; // UUID
      lastReviewed: string; // ISO 8601
    }
  };
}
```

**PUT /flashcards/:id/archive (200)**
```typescript
{
  status: "success";
  data: {
    flashcard: {
      id: string; // UUID
      archived: boolean;
      updatedAt: string; // ISO 8601
    }
  };
  message: string;
}
```

**PUT /flashcards/:id (200)**
```typescript
{
  status: "success";
  data: {
    flashcard: FlashcardApiResponse;
  };
}
```

**FlashcardApiResponse**
```typescript
{
  id: string; // UUID
  question: string;
  answer: string; // Podría estar oculto en algunos listados
  difficulty: "easy" | "medium" | "hard";
  tags: TagApiResponse[];
  archived: boolean;
  materialId: string; // UUID
  material?: {
    id: string; // UUID
    title: string;
  };
  lastReviewed: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**FlashcardDetailedApiResponse**
```typescript
{
  id: string; // UUID
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: TagApiResponse[];
  archived: boolean;
  material: {
    id: string; // UUID
    title: string;
  };
  reviews: FlashcardReviewApiResponse[];
  lastReviewed: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**FlashcardStudyApiResponse**
```typescript
{
  id: string; // UUID
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  material?: {
    id: string; // UUID
    title: string;
  };
  lastReviewed: string | null; // ISO 8601
}
```

**FlashcardReviewApiResponse**
```typescript
{
  id: string; // UUID
  rating: number; // 1-5
  notes: string | null;
  flashcardId: string; // UUID
  createdAt: string; // ISO 8601
}
```

### Exámenes (Responses)

**POST /exams (201)**
```typescript
{
  status: "success";
  data: {
    exam: ExamApiResponse;
  };
}
```

**ExamApiResponse**
```typescript
{
  id: string; // UUID
  title: string;
  description: string;
  questions: Array<{
    type: "multiple_choice" | "true_false" | "short_answer";
    question: string;
    options?: string[]; // Solo para multiple_choice
    // correct_answer NO se expone aquí
    explanation?: string;
    points: number; // integer
  }>;
  materials: Array<{
    id: string; // UUID
    title: string;
  }>;
  total_points: number; // integer
  duration_minutes: number; // integer
  difficulty: "easy" | "medium" | "hard";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```
*(Nota: Los endpoints GET de exámenes parecen estar en `archived` y podrían necesitar ser revisados)*

### Etiquetas (Responses)

**GET /tags (200)**
```typescript
{
  status: "success";
  data: {
    tags: TagApiResponse[];
  };
}
```

**POST /tags (201)**
```typescript
{
  status: "success";
  data: {
    tag: TagApiResponse;
  };
}
```

**PUT /tags/:id (200)**
```typescript
{
  status: "success";
  data: {
    tag: TagApiResponse;
  };
}
```

**TagApiResponse**
```typescript
{
  id: string; // UUID
  name: string;
  color: string; // hexColor
  count?: number; // Número de elementos asociados (puede incluirse en GET all)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

## Tipos Literales y Enums

Valores específicos permitidos para ciertos campos.

**Dificultad (Difficulty)**
```typescript
"easy" | "medium" | "hard"
```
Utilizado en Flashcards y Exámenes.

**Formato de Resumen (SummaryFormat)**
```typescript
"bullet_points" | "paragraph" | "structured"
```
Utilizado en Resúmenes.

**Longitud de Resumen (SummaryLength)**
```typescript
"short" | "medium" | "long"
```
Utilizado en opciones de generación de Resúmenes.

**Tipo de Pregunta de Examen (ExamQuestionType)**
```typescript
"multiple_choice" | "true_false" | "short_answer"
```
Utilizado en Preguntas de Examen.

**Estado de Procesamiento (ProcessingStatus)**
```typescript
"pending" | "completed" | "failed"
```
Utilizado en Materiales para indicar el estado del análisis IA.