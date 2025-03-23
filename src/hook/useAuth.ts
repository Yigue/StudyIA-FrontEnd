import { useAuthStore } from "../store/auth.store";
import { useMemo } from "react";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isCheckingAuth, error } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    error,
  };
};

export const useAuthActions = () => {
  const { login, register, logout, checkAuth, clearError } = useAuthStore();
  
  return {
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};

// Usando useMemo para cachear el resultado y evitar bucles infinitos
export const useAuthStatus = () => {
  // Obtenemos el estado directamente
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);
  const token = useAuthStore(state => state.token);
  
  // Cacheamos el objeto de retorno con useMemo
  return useMemo(() => ({
    isAuthenticated,
    isLoading,
    isCheckingAuth,
    token
  }), [isAuthenticated, isLoading, isCheckingAuth, token]);
};