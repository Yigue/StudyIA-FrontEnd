import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
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

export const useAuthStatus = () => useAuthStore(state => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading
}));