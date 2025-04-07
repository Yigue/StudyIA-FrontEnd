import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/react-query'
import './index.css'
import { ThemeProvider } from './components/ui/useTheme'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './lib/router'

// Inicializar el router antes de renderizar
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Asegurar que el router está listo
const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement) throw new Error('No se pudo encontrar el elemento root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
