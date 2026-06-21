import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { sitemapPlugin } from '@mvp-kit/vite-sitemap-plugin'

function requireEnv(name: string, value: string | undefined): string {
  const resolved = value?.trim()
  if (!resolved) {
    throw new Error(`${name} must be configured`)
  }

  return resolved
}

function parseAllowedHosts(value: string): string[] {
  const allowedHosts = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (allowedHosts.length === 0) {
    throw new Error('VITE_ALLOWED_HOSTS must contain at least one host')
  }

  return allowedHosts
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const server =
    command === 'serve'
      ? {
          port: 3001,
          allowedHosts: parseAllowedHosts(
            requireEnv('VITE_ALLOWED_HOSTS', env.VITE_ALLOWED_HOSTS)
          ),
          proxy: {
            '/api': {
              target: requireEnv('VITE_API_URL', env.VITE_API_URL),
              secure: false,
            },
          },
        }
      : undefined

  return {
    plugins: [
      tsconfigPaths(),
      tanstackRouter({ target: 'react' }),
      mdx(),
      react(),
      tailwindcss(),
      sitemapPlugin({
        baseUrl: 'https://hello-world.mvpkit.dev',
        routeTreePath: 'src/routeTree.gen.ts',
        enabled: mode === 'production',
      }),
    ],
    server,
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})
