import { createCookieBatchLink, createProviders, createQueryClient, useTheme } from '@repo/config'
import { trpc } from '@/lib/trpc'

export { useTheme }

export const Providers = createProviders({
  trpc,
  createQueryClient: () =>
    createQueryClient({
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    }),
  createTrpcClient: () =>
    trpc.createClient({
      links: [createCookieBatchLink('/api')],
    }),
  enableDevtools: import.meta.env.DEV,
})
