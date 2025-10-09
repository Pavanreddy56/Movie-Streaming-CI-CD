import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.', // default is project root
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './frontend/index.html', // specify index.html location
    },
  },
  plugins: [react()],
});
