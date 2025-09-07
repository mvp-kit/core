import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    cloudflare({
      // Cloudflare Workers configuration
    }),
  ],
  build: {
    rollupOptions: {
      external: ['__STATIC_CONTENT_MANIFEST'],
    },
  },
})
