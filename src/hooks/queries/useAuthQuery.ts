import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../../services/auth/auth.service';
import { ForgotPasswordDTO, ResetPasswordDTO, userLoginDTO } from '../../types';
import { userRegisterDTO } from '../../types/user/userRequest';

// Claves de query estructuradas
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  token: () => [...authKeys.all, 'token'] as const,
};

/**
 * Hook para obtener datos del usuario actual
 */
export const useUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getMe(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // No realizar la consulta automáticamente, sólo cuando haya token
    enabled: false,
    retry: false,
  });
};

/**
 * Hook para iniciar sesión
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: userLoginDTO) => authService.login(credentials),
    onSuccess: async (response) => {
      // Guardar token en localStorage
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken || '');
        
        // Invalidar user query para forzar recarga
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        
        // Actualizar estado actual de usuario
        queryClient.setQueryData(authKeys.user(), { data: response.data });
      }
    },
  });
};

/**
 * Hook para registrar nuevo usuario
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: userRegisterDTO) => authService.register(userData),
    onSuccess: async (response) => {
      // Guardar token en localStorage
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken || '');
        
        // Invalidar user query para forzar recarga
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        
        // Actualizar estado actual de usuario
        queryClient.setQueryData(authKeys.user(), { data: response.data });
      }
    },
  });
};

/**
 * Hook para cerrar sesión
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Eliminar tokens del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Limpiar caché de usuario
      queryClient.removeQueries({ queryKey: authKeys.user() });
      
      // Reiniciar el estado del cliente de consulta por completo
      queryClient.clear();
    },
    // Aunque falle el logout en el servidor, seguimos limpiando localmente
    onError: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      queryClient.removeQueries({ queryKey: authKeys.user() });
      queryClient.clear();
    },
  });
};

/**
 * Hook para refrescar el token de acceso
 */
export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      return authService.refreshToken(refreshToken || undefined);
    },
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        // Invalidar consultas relevantes
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
  });
};

/**
 * Hook para solicitar recuperación de contraseña
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDTO) => authService.forgotPassword(data),
  });
};

/**
 * Hook para restablecer contraseña
 */
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string; passwordData: ResetPasswordDTO }) => 
      authService.resetPassword(data.token, data.passwordData),
  });
};

/**
 * Hook para enviar correo de verificación
 */
export const useSendVerificationEmailMutation = () => {
  return useMutation({
    mutationFn: () => authService.sendVerificationEmail(),
  });
}; 