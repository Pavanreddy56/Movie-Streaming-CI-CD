import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',       // root is frontend folder itself
  build: {
    outDir: 'dist', // output folder for build
  },
});
