import { useEffect } from "react";
import { AuthInitializer } from "./components/auth/AuthInitializer";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from './components/ui/Toast';
import { useTheme } from './components/ui/useTheme';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './lib/router';

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
  </div>
);

// Componente principal que contiene toda la aplicación
function App() {
  const { isLoading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Aplicar la clase dark al elemento body
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <ErrorBoundary>
        <AuthInitializer />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </>
  );
}

export default App;
