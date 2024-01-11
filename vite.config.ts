import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxImportSource: "@emotion/react" })],
  build: {
    minify: false
  },
  optimizeDeps: {
    include: [],
  },
  server: {
    port: 5555,
    proxy: {
      "/mecchi": {
        target: 'http://127.0.0.1:4444/',
        changeOrigin: true,
        secure: false
      },
    }
  }
})
