import { useEffect, useRef } from 'react';
import { useAuthActions, useAuth } from '../../hook/useAuth';

export const AuthInitializer = () => {
  const { checkAuth } = useAuthActions();
  const { isAuthenticated } = useAuth();
  
  // Usar una referencia para rastrear si ya se ha hecho la verificación
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Si ya verificamos o ya estamos autenticados, no hacer nada
    if (hasCheckedAuth.current || isAuthenticated) {
      return;
    }

    // Marcar que ya se inició la verificación
    hasCheckedAuth.current = true;
    
    // Solo verificar si hay un token almacenado
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) {
          // Solo llamar a checkAuth una vez
          checkAuth();
        }
      } catch (error) {
        console.error('Error al parsear auth-storage:', error);
      }
    }
    
    // Este efecto solo se ejecuta una vez al montar el componente
  }, []);

  return null;
};
