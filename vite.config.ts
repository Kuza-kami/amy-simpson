import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/amy-simpson', // CHANGE THIS to your repository name, e.g., '/my-portfolio/'
});