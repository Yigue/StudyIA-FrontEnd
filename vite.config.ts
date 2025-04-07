import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'lucide-react': 'lucide-react/dist/esm/lucide-react'
    }
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-query',
      '@tanstack/react-router'
    ]
  }
});
