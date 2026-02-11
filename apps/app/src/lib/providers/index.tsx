import { createCookieBatchLink, createProviders, createQueryClient, useTheme } from '@repo/config'
import { Toaster } from 'sonner'
import { trpc } from '@/lib/trpc'

export { useTheme }

export const Providers = createProviders({
  trpc,
  createQueryClient: () =>
    createQueryClient({
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    }),
  createTrpcClient: () =>
    trpc.createClient({
      links: [createCookieBatchLink('/api')],
    }),
  renderAfterChildren: () => <Toaster />,
  enableDevtools: import.meta.env.DEV,
})
