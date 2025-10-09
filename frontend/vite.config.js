// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './', // optional, defaults to current folder
  build: {
    outDir: 'dist',
  },
})
