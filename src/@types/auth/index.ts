/**
 * Tipos relacionados con autenticación y usuarios
 */

// Usuario autenticado
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tokens de autenticación
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Estado de autenticación
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Credenciales de inicio de sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Datos de actualización de perfil
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

// Datos de cambio de contraseña
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Resultado de verificación de token
export interface TokenVerificationResult {
  valid: boolean;
  expired: boolean;
  decodedToken?: {
    userId: string;
    exp: number;
  };
} 