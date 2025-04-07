/**
 * Tipos relacionados con la autenticación de usuarios
 */

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  nombre: string;
  role_id: string;
  accessToken: string;
  refreshToken: string;
  isEmailVerified: boolean;
  created_at: string;
  updated_at: string;
}
export interface RefreshTokenResponse {
  accessToken: string;

}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserRegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  password: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthError {
  status: "error";
  message: string;
  code: number;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export interface ConnectionError {
  message: string;
} 