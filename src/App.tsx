import { useState, lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthInitializer } from "./components/auth/AuthInitializer";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./components/layouts/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import AuthPage from "./features/auth/AuthPage";
import { ToastContainer } from './components/ui/Toast';
import { useTheme } from './components/ui/useTheme';
import LibraryPage from "./features/library/LibraryPage";

// Importación dinámica de páginas para mejor rendimiento
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const AnalyticsPage = lazy(() => import("./features/dashboard/AnalyticsPage"));
const StudyAreaPage = lazy(() => import("./features/study/StudyAreaPage"));
const FlashcardsReviewPage = lazy(() => import("./features/flashcards/FlashcardsReviewPage"));
const FlashcardsExplorerPage = lazy(() => import("./features/flashcards/FlashcardsExplorerPage"));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isLoading } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    // Aplicar la clase dark al elemento body
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <ErrorBoundary>
        <Router>
          <AuthInitializer />
          <Routes>
            <Route path="/" element={<AuthPage />} />
          
            <Route
              path="/*"
              element={
                <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route
                        path="dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="analytics"
                        element={
                          <ProtectedRoute>
                            <AnalyticsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="flashcards"
                        element={
                          <ProtectedRoute>
                            <FlashcardsReviewPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="flashcards/explorador"
                        element={
                          <ProtectedRoute>
                            <FlashcardsExplorerPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="study"
                        element={
                          <ProtectedRoute>
                            <StudyAreaPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="library"
                        element={
                          <ProtectedRoute>
                            <LibraryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="settings"
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<div>Página no encontrada</div>} />
                    </Routes>
                  </Suspense>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </>
  );
}

export default App;
