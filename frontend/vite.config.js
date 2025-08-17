import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/user': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/logout': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
