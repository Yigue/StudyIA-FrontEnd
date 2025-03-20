import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/auth/auth.service';
import { User } from '../types';
import { userLoginDTO, userRegisterDTO } from '../types/user/userRequest';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
      error: null,

      login: async (userLogin) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(userLogin);
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
          });
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
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
          });
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
        try {
          const token = get().token;
          if (!token) return;

          set({ isLoading: true });
          const response = await authService.getMe(token);
          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          const message = error instanceof Error ? error.message : 'Session expired';
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
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