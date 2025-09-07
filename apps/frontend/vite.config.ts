import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, '../../packages/config'),
      '@types': path.resolve(__dirname, '../../packages/types'),
      '@utils': path.resolve(__dirname, '../../packages/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/trpc': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err.message);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})