import { useCallback, useMemo, useState, useEffect } from 'react';
import { 
  useUserQuery, 
  useLoginMutation, 
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationEmailMutation
} from './queries/useAuthQuery';
import { 
  User, 
  UserLoginDTO, 
  UserRegisterDTO, 
  ForgotPasswordDTO, 
  ResetPasswordDTO 
} from '../types/auth/index';
import { setAuthToken } from '../services/api/httpClient';
// import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para gestionar la autenticación de usuarios usando React Query
 * pero manteniendo la interfaz compatible con la versión anterior.
 */
export const useAuth = () => {
  // const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(localStorage.getItem('token')));
  
  // Queries y Mutaciones
  const { 
    data, 
    isLoading, 
    error, 
    refetch: fetchUser 
  } = useUserQuery();
  
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const refreshTokenMutation = useRefreshTokenMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  
  // Definir la función refreshAccessToken primero para evitar problemas de hoisting
  const refreshAccessToken = useCallback(async () => {
    try {
      const result = await refreshTokenMutation.mutateAsync();
      const success = !!result.data?.accessToken;
      setHasToken(success);
      return success;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      setHasToken(false);
      return false;
    }
  }, [refreshTokenMutation]);
  
  // Configurar el token almacenado al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, []);
  
  // Comprobar si hay token al iniciar
  useEffect(() => {
    if (hasToken) {
      // Usar setTimeout para asegurar que el token se ha configurado en Axios
      setTimeout(() => {
        fetchUser().catch(error => {
          console.error('Error al cargar usuario:', error);
          setHasToken(false);
        });
      }, 0);
    }
  }, [hasToken, fetchUser]);

  // Funciones con interfaz compatible con la versión anterior
  const checkAuth = useCallback(async () => {
    // Intentar obtener el token directamente
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      console.log('No hay token almacenado');
      return null;
    }
    
    console.log('Token almacenado:', storedToken.substring(0, 10) + '...');
    
    // Asegurar que el token esté configurado en Axios
    setAuthToken(storedToken);
    
    try {
      console.log('Intentando verificar sesión...');
      const result = await fetchUser();
      console.log('Resultado de verificación:', result);
      return result.data?.data;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      
      // Verificar si el problema es de token
      if (error instanceof Error && 
          (error.message.includes('No hay token disponible') || 
           error.message.includes('Unauthorized'))) {
        console.log('Problema detectado con el token. Intentando refrescar...');
      }
      
      // Intentar refrescar el token
      console.log('Intentando refrescar token...');
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        console.log('Token refrescado correctamente, reintentando...');
        try {
          const retryResult = await fetchUser();
          return retryResult.data?.data;
        } catch (retryError) {
          console.error('Error al reintentar después de refrescar token:', retryError);
        }
      }
      console.log('No se pudo refrescar el token');
      return null;
    }
  }, [fetchUser, refreshAccessToken]);

  const login = useCallback(async (credentials: UserLoginDTO) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      setHasToken(true);
      return result.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }, [loginMutation]);

  const register = useCallback(async (userData: UserRegisterDTO) => {
    try {
      const result = await registerMutation.mutateAsync(userData);
      setHasToken(true);
      return result.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setHasToken(false);
    }
  }, [logoutMutation]);

  const forgotPassword = useCallback(async (data: ForgotPasswordDTO) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      throw error;
    }
  }, [forgotPasswordMutation]);

  const resetPassword = useCallback(async (token: string, data: ResetPasswordDTO) => {
    try {
      await resetPasswordMutation.mutateAsync({ token, passwordData: data });
    } catch (error) {
      console.error('Error en cambio de contraseña:', error);
      throw error;
    }
  }, [resetPasswordMutation]);

  const sendVerificationEmail = useCallback(async () => {
    try {
      await sendVerificationEmailMutation.mutateAsync();
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      throw error;
    }
  }, [sendVerificationEmailMutation]);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query
  }, []);

  // Datos derivados
  const user = useMemo<User | null>(() => data?.data || null, [data]);
  const isAuthenticated = useMemo(() => Boolean(user), [user]);
  
  // Retornar objeto con misma estructura que el hook original
  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    isCheckingAuth: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    
    login,
    register,
    logout,
    checkAuth,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    clearError
  }), [
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    clearError
  ]);
};