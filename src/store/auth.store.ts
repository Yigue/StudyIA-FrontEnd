import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/auth/auth.service';
import { User } from '../types/user/user';
import { userLoginDTO, userRegisterDTO, ForgotPasswordDTO, ResetPasswordDTO, UpdateProfileDTO, ChangePasswordDTO } from '../types/user/userRequest';
import axios from 'axios';

// Implementación simple de debounce para checkAuth
let checkAuthTimeout: NodeJS.Timeout | null = null;

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  
  // Actions
  login: (userLogin: userLoginDTO) => Promise<void>;
  register: (userData: userRegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordDTO) => Promise<void>;
  resetPassword: (token: string, data: ResetPasswordDTO) => Promise<void>;
  updateProfile: (data: UpdateProfileDTO) => Promise<void>;
  changePassword: (data: ChangePasswordDTO) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: false,
      error: null,

      login: async (userLogin) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(userLogin);
          
          if (response.data) {
            set({
              token: response.data.accessToken || null,
              refreshToken: response.data.refreshToken || null,
              user: {
                ...response.data,
                id: response.data.id || '',
                email: response.data.email || '',
                name: response.data.nombre || '',
                role_id: response.data.role_id || '',
                isEmailVerified: response.data.isEmailVerified || false,
                createdAt: response.data.created_at || '', // Usamos createdAt por ahora
                updatedAt: response.data.updated_at || '' // Usamos createdAt por ahora
            
              },
              isAuthenticated: true,
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
          
          if (response.data) {
            set({
              token: response.data.accessToken || null,
              refreshToken: response.data.refreshToken || null,
              user: {
                ...response.data,
                id: response.data.id || '',
                email: response.data.email || '',
                name: response.data.nombre || '',
                role_id: response.data.role_id || '',
                isEmailVerified: response.data.isEmailVerified || false,
                createdAt: response.data.created_at || '', // Usamos createdAt por ahora
                updatedAt: response.data.updated_at || '' // Usamos createdAt por ahora
            
              },
              isAuthenticated: true,
            });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error en el registro' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authService.logout();
          console.log('Sesión cerrada exitosamente');
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          // El logout debe funcionar incluso si hay un error en el servidor
          // Cerramos sesión localmente de todas formas
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'Error al cerrar sesión en el servidor'
          });
        } finally {
          set({ isLoading: false });
        }
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
              user: response.data || null,
              isAuthenticated: true,
              error: null // Limpiar cualquier error previo
            });
          } catch (error) {
            console.error('Error en checkAuth:', error);
            
            // Intentar refrescar el token si hay un error 401
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              const success = await get().refreshAccessToken();
              if (!success) {
                set({
                  user: null,
                  token: null,
                  refreshToken: null,
                  isAuthenticated: false,
                  error: 'La sesión ha expirado, por favor inicia sesión nuevamente.'
                });
              }
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

      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken) return false;
          
          const response = await authService.refreshToken(refreshToken);
          if (response.data && response.data.accessToken) {
            set({ token: response.data.accessToken });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error al refrescar el token:', error);
          return false;
        }
      },

      forgotPassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          await authService.forgotPassword(data);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al solicitar recuperación de contraseña' });
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (token, data) => {
        try {
          set({ isLoading: true, error: null });
          await authService.resetPassword(token, data);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al restablecer la contraseña' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data: UpdateProfileDTO) => {
        try {
          set({ isLoading: true, error: null });
          // Esta función está comentada porque no tenemos el servicio implementado
          console.log('Datos para actualizar perfil:', data); // Uso temporal para evitar warnings
          set({ error: 'Función no implementada' });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al actualizar el perfil' });
        } finally {
          set({ isLoading: false });
        }
      },

      changePassword: async (data: ChangePasswordDTO) => {
        try {
          set({ isLoading: true, error: null });
          // Esta función está comentada porque no tenemos el servicio implementado
          console.log('Datos para cambiar contraseña:', data); // Uso temporal para evitar warnings
          set({ error: 'Función no implementada' });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al cambiar la contraseña' });
        } finally {
          set({ isLoading: false });
        }
      },

      sendVerificationEmail: async () => {
        try {
          set({ isLoading: true, error: null });
          await authService.sendVerificationEmail();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al enviar el correo de verificación' });
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
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);