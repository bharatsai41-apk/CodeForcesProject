import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user-profile': {
        target: 'http://localhost:5085',
        changeOrigin: true,
      },
    },
  },
})
