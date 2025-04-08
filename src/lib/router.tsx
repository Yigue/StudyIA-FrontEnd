import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet
} from '@tanstack/react-router';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout';
import AuthPage from '../features/auth/AuthPage';
import { queryClient } from './react-query';
import { useState } from 'react';
import NotFoundPage from '../components/common/NotFoundPage';

// Componente para el layout principal con estado interno
const LayoutWithNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <ProtectedRoute>
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};

// Definición de la ruta raíz
export const rootRoute = createRootRoute({
  component: () => <Outlet />
});

// Ruta de autenticación
export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthPage
});

// Ruta del layout principal que contiene todas las rutas protegidas
export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: LayoutWithNavigation
});

// Rutas protegidas
export const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: lazyRouteComponent(() => import('../features/dashboard/DashboardPage'))
});

export const analyticsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/analytics',
  component: lazyRouteComponent(() => import('../features/dashboard/AnalyticsPage'))
});

export const studySessionRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/sesion',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/StudySessionPage'))
});

export const libraryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/library',
  component: lazyRouteComponent(() => import('../features/library/LibraryPage'))
});

export const studyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/study',
  component: lazyRouteComponent(() => import('../features/uploadArea/UploadAreaPage'))
});

// Rutas de flashcards
export const flashcardsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/FlashcardsExplorerPage'))
});

export const flashcardsStudyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards/study',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/StudySessionPage'))
});

export const flashcardsExplorerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards/explorador',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/FlashcardsExplorerPage'))
});

export const flashcardsStatsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards/stats',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/FlashcardsAnalyticsPage'))
});

export const flashcardsHomeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards/home',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/FlashcardsExplorerPage'))
});

export const flashcardsDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/flashcards/dashboard',
  component: lazyRouteComponent(() => import('../features/flashcards/pages/FlashcardsExplorerPage'))
});

export const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/settings',
  component: lazyRouteComponent(() => import('../features/settings/SettingsPage'))
});

// Creación de las rutas
const routeTree = rootRoute.addChildren([
  authRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    analyticsRoute,
    studySessionRoute,
    libraryRoute,
    studyRoute,
    flashcardsRoute,
    flashcardsStudyRoute,
    flashcardsExplorerRoute,
    flashcardsStatsRoute,
    flashcardsHomeRoute,
    flashcardsDashboardRoute,
    settingsRoute
  ])
]);

// Creación del router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient
  },
  defaultErrorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">¡Oops! Ha ocurrido un error</h1>
          <p className="text-gray-700 dark:text-gray-300">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  },
  defaultNotFoundComponent: () => <NotFoundPage />
});

// Registra las rutas en el tipo del router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
} 