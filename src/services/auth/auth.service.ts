import { User } from '../../types/auth/index';
import { 
  UserLoginDTO, 
  UserRegisterDTO, 
  AuthResponse,
  RefreshTokenResponse,
  ForgotPasswordDTO, 
  ResetPasswordDTO 
} from '../../types/auth/index';
import { httpClient } from '../api/httpClient';

// Autenticación: Login
export async function login(credentials: UserLoginDTO) {
  return httpClient<AuthResponse, UserLoginDTO>('/auth/login', {
    method: 'POST',
    data: credentials,
    withCredentials: false
  });
}

// Autenticación: Registro
export async function register(userData: UserRegisterDTO) {
  return httpClient<AuthResponse, UserRegisterDTO>('/auth/register', {
    method: 'POST',
    data: userData,
    withCredentials: false
  });
}

// Obtener perfil del usuario actual
export async function getMe() {
  const token = localStorage.getItem('token');
  
  return httpClient<User>('/auth/me', {
    method: 'GET',
    withCredentials: false,
    headers: token ? {
      'Authorization': `Bearer ${token}`
    } : undefined
  });
}

// Cerrar sesión
export async function logout() {
  return httpClient<null>('/auth/logout', {
    method: 'POST',
    withCredentials: false
  });
}

// Renovar token de acceso
export async function refreshToken(token?: string) {
  return httpClient<RefreshTokenResponse, { refreshToken?: string }>('/auth/refresh-token', {
    method: 'POST',
    data: token ? { refreshToken: token } : undefined,
    withCredentials: false
  });
}

// Solicitar restablecimiento de contraseña
export async function forgotPassword(data: ForgotPasswordDTO) {
  return httpClient<null, ForgotPasswordDTO>('/auth/forgot-password', {
    method: 'POST',
    data,
    withCredentials: false
  });
}

// Restablecer contraseña
export async function resetPassword(token: string, data: ResetPasswordDTO) {
  return httpClient<null, ResetPasswordDTO>(`/auth/reset-password/${token}`, {
    method: 'POST',
    data,
    withCredentials: false
  });
}

// Enviar email de verificación
export async function sendVerificationEmail() {
  return httpClient<null>('/auth/send-verification', {
    method: 'POST',
    withCredentials: false
  });
}




