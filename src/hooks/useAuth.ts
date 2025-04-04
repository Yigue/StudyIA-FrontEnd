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
import { User, userLoginDTO, userRegisterDTO, ForgotPasswordDTO, ResetPasswordDTO } from '../types';
// import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para gestionar la autenticación de usuarios usando React Query
 * pero manteniendo la interfaz compatible con la versión anterior.
 */
export const useAuth = () => {
  // const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(Boolean(localStorage.getItem('token')));
  
  // Queries y Mutaciones
  const { 
    data: userData, 
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
  
  // Comprobar si hay token al iniciar
  useEffect(() => {
    if (hasToken) {
      fetchUser();
    }
  }, [hasToken, fetchUser]);

  // Funciones con interfaz compatible con la versión anterior
  const checkAuth = useCallback(async () => {
    if (!hasToken) return null;
    
    try {
      const { data } = await fetchUser();
      return data;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Si hay error de autenticación, intentar refrescar el token
      await refreshAccessToken();
      return null;
    }
  }, [hasToken, fetchUser]);

  const login = useCallback(async (credentials: userLoginDTO) => {
    const result = await loginMutation.mutateAsync(credentials);
    setHasToken(true);
    return result.data;
  }, [loginMutation]);

  const register = useCallback(async (userData: userRegisterDTO) => {
    const result = await registerMutation.mutateAsync(userData);
    setHasToken(true);
    return result.data;
  }, [registerMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setHasToken(false);
  }, [logoutMutation]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const result = await refreshTokenMutation.mutateAsync();
      setHasToken(!!result.data?.accessToken);
      return !!result.data?.accessToken;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      setHasToken(false);
      return false;
    }
  }, [refreshTokenMutation]);

  const forgotPassword = useCallback(async (data: ForgotPasswordDTO) => {
    await forgotPasswordMutation.mutateAsync(data);
  }, [forgotPasswordMutation]);

  const resetPassword = useCallback(async (token: string, data: ResetPasswordDTO) => {
    await resetPasswordMutation.mutateAsync({ token, passwordData: data });
  }, [resetPasswordMutation]);

  const sendVerificationEmail = useCallback(async () => {
    await sendVerificationEmailMutation.mutateAsync();
  }, [sendVerificationEmailMutation]);

  const clearError = useCallback(() => {
    // No hay equivalente directo en React Query
  }, []);

  // Datos derivados
  const user = useMemo<User | null>(() => userData || null, [userData]);
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