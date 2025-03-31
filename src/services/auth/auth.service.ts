import { User } from '../../types/user/user';
import { userLoginDTO, userRegisterDTO, AuthResponse, ForgotPasswordDTO, ResetPasswordDTO } from '../../types/user/userRequest';
import { httpClient } from '../api/httpClient';

// La API devuelve token como string directo, no como un objeto
export async function login(userLogin: userLoginDTO) {
  return  httpClient<AuthResponse, userLoginDTO>('/auth/login', {
    method: 'POST',
    data: userLogin,
    // Necesitamos enviar cookies para recibir el refreshToken
    withCredentials: false
  });
}

export async function register(userRegister: userRegisterDTO) {
  return httpClient<AuthResponse, userRegisterDTO>('/auth/register', {
    method: 'POST',
    data: userRegister,
    // Necesitamos enviar cookies para recibir el refreshToken
    withCredentials: false
  });
}

// La función getMe devuelve un objeto de usuario directamente
export async function getMe() {
  return httpClient<User>('/auth/me', {
    method: 'GET',
    // No necesitamos enviar cookies aquí, el token va en el header
    withCredentials: false
  });
}

export async function logout() {
  return httpClient<void>('/auth/logout', {
    method: 'POST',
    // En el logout no enviamos cookies para evitar problemas de CORS
    withCredentials: false
  });
}

export async function refreshToken(refreshToken?: string) {
  return httpClient<{ accessToken: string }, { refreshToken?: string }>('/auth/refresh-token', {
    method: 'POST',
    data: refreshToken ? { refreshToken } : undefined,
    // Si se proporciona el refreshToken como parámetro, no necesitamos cookies
    // Si no, se usará la cookie pero esto podría causar problemas de CORS
    withCredentials: refreshToken ? false : true
  });
}

export async function forgotPassword(data: ForgotPasswordDTO) {
  return httpClient<void, ForgotPasswordDTO>('/auth/forgot-password', {
    method: 'POST',
    data,
    // No necesitamos cookies aquí
    withCredentials: false
  });
}

export async function resetPassword(token: string, data: ResetPasswordDTO) {
  return httpClient<void, ResetPasswordDTO>(`/auth/reset-password/${token}`, {
    method: 'POST',
    data,
    // No necesitamos cookies aquí
    withCredentials: false
  });
}

export async function sendVerificationEmail() {
  return httpClient<void>('/auth/send-verification', {
    method: 'POST',
    // No necesitamos cookies aquí, el token va en el header
    withCredentials: false
  });
}




