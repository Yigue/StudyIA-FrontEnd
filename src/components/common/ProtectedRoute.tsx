import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si no está autenticado después de cargar
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Si no está autenticado, no renderizar los hijos
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};