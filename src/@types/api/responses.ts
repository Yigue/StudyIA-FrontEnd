/**
 * Tipos para las respuestas de la API
 */

// Respuesta exitosa genérica
export interface ApiSuccessResponse<T> {
  status: "success";
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

// Respuesta de error
export interface ApiErrorResponse {
  status: "error";
  message: string;
  code: number;
  errors?: Array<{ path: string; message: string }>;
}

// Unión de tipos de respuesta
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error de API para manejar errores
export interface ApiError {
  status: "error";
  message: string;
  code: number;
}

// Estructura para respuestas paginadas
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
}

// Tipos para respuestas del módulo de autenticación
export interface UserPublicProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: UserPublicProfile;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface UserProfileResponse {
  user: UserPublicProfile;
}

// Respuestas generales
export interface GenericIdResponse {
  id: string;
}

// Permite añadir campos adicionales a una respuesta existente
export type ExtendedResponse<T, E> = T & E; 