import { useMemo } from "react";
import { useAuthStore } from "../store/auth.store";

// Hook para acceder a la información de autenticación
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const error = useAuthStore((state) => state.error);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    error,
  };
};

// Hook para acceder a las acciones de autenticación
export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const sendVerificationEmail = useAuthStore((state) => state.sendVerificationEmail);
  const clearError = useAuthStore((state) => state.clearError);
  
  return {
    login,
    register,
    logout,
    checkAuth,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    sendVerificationEmail,
    clearError,
  };
};

// Hook para acceder al estado de autenticación
export const useAuthStatus = () => {
  // Obtenemos el estado directamente
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);
  const token = useAuthStore(state => state.token);
  const refreshToken = useAuthStore(state => state.refreshToken);
  
  // Cacheamos el objeto de retorno con useMemo
  return useMemo(() => ({
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    token,
    refreshToken
  }), [isAuthenticated, isLoading, isCheckingAuth, token, refreshToken]);
};