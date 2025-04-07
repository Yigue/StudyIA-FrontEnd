import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../../services/auth/auth.service';
import { 
  UserLoginDTO, 
  UserRegisterDTO, 
  ForgotPasswordDTO, 
  ResetPasswordDTO 
} from '../../types/auth/index';
import { setAuthToken } from '../../services/api/httpClient';

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
    queryFn: () => {
      // Verificar que tenemos token antes de intentar la petición
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Intentando obtener datos de usuario sin token');
        return Promise.reject(new Error('No hay token disponible'));
      }
      console.debug('Solicitando datos de usuario con token');
      return authService.getMe();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    // No realizar la consulta automáticamente, sólo cuando haya token
    enabled: false,
    retry: 1,
  });
};

/**
 * Hook para iniciar sesión
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: UserLoginDTO) => authService.login(credentials),
    onSuccess: async (response) => {
      // Guardar token en localStorage y configurar axios

      if (response.data.accessToken) {
        const token = response.data.accessToken;
        
        console.debug('Login exitoso, guardando token...');
        
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        
        // Si hay refresh token, guardarlo también
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Configurar el token en axios (ambas formas para asegurar compatibilidad)
        setAuthToken(token);
        
        console.debug('Token configurado, obteniendo datos de usuario...');
        
        // Esperar un momento para que se aplique el token
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Invalidar user query para forzar recarga
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        
        // Obtener los datos del usuario inmediatamente
        try {
          await queryClient.fetchQuery({ queryKey: authKeys.user() });
          console.debug('Datos de usuario obtenidos correctamente');
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
        }
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
    mutationFn: (userData: UserRegisterDTO) => authService.register(userData),
    onSuccess: async (response) => {
      // Guardar token en localStorage y configurar axios
      if (response.data?.accessToken) {
        const token = response.data.accessToken;
        
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        
        // Si hay refresh token, guardarlo también
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Configurar el token en axios (ambas formas para asegurar compatibilidad)
        setAuthToken(token);
        
        // Invalidar user query para forzar recarga
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        
        // Obtener los datos del usuario inmediatamente
        await queryClient.fetchQuery({ queryKey: authKeys.user() });
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
      
      // Eliminar el token de las peticiones
      setAuthToken('');
      
      // Limpiar caché de usuario
      queryClient.removeQueries({ queryKey: authKeys.user() });
      
      // Reiniciar el estado del cliente de consulta por completo
      queryClient.clear();
    },
    // Aunque falle el logout en el servidor, seguimos limpiando localmente
    onError: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Eliminar el token de las peticiones
      setAuthToken('');
      
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
        
        // Establecer el nuevo token para todas las peticiones
        setAuthToken(response.data.accessToken);
        
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