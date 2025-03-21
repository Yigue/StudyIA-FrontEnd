import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/auth/auth.service';
import { User } from '../types';
import { userLoginDTO, userRegisterDTO } from '../types/user/userRequest';
import axios from 'axios';

// Implementación simple de debounce para checkAuth
let checkAuthTimeout: NodeJS.Timeout | null = null;

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  
  // Actions
  login: (userLogin:userLoginDTO) => Promise<void>;
  register: (userData: userRegisterDTO) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: false,
      error: null,

      login: async (userLogin) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(userLogin);
          
          const token = response.data;
          set({
            token,
            isAuthenticated: true,
          });
          if (!get().isCheckingAuth) {
            const userRes = await authService.getMe();
            set({
              user: userRes.data
            });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error de autenticación' });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(userData);
          const token = response.data;
         
          set({
            token,
            isAuthenticated: true,
          });
          if (!get().isCheckingAuth) {
            const userRes = await authService.getMe();
            set({
              user: userRes.data
            });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error en el registro' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        // Evitar llamadas simultáneas
        if (get().isLoading || get().isCheckingAuth) return;
        
        // Implementar debounce
        if (checkAuthTimeout) {
          clearTimeout(checkAuthTimeout);
        }
        
        checkAuthTimeout = setTimeout(async () => {
          try {
            const token = get().token;
            if (!token) return;
            
            // Marcar como en proceso
            set({ isCheckingAuth: true, isLoading: true });
            
            const response = await authService.getMe();
            // Si no hay error, actualizar el usuario
            set({
              user: response.data,
              isAuthenticated: true,
              error: null // Limpiar cualquier error previo
            });
          } catch (error) {
            console.error('Error en checkAuth:', error);
            
            // Solo limpiar tokens en caso de errores de autenticación
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              set({
                user: null,
                token: null,
                isAuthenticated: false,
              });
              
              const message = 'La sesión ha expirado, por favor inicia sesión nuevamente.';
              set({ error: message });
            } else if (!(error instanceof Error && error.message.includes('Network Error'))) {
              // No mostrar errores de red, pueden ser temporales
              const message = error instanceof Error ? error.message : 'Error al verificar la sesión';
              set({ error: message });
            }
          } finally {
            set({ isLoading: false, isCheckingAuth: false });
            checkAuthTimeout = null;
          }
        }, 300); // Esperar 300ms antes de ejecutar
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);