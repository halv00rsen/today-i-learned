import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer(),
    checker({
      typescript: true,
      enableBuild: false,
      overlay: { initialIsOpen: false, position: 'tr' },
    }),
  ],
  server: {
    proxy: {
      // Local proxy to function "user"
      '/user': 'http://localhost:5123',
    },
  },
});
