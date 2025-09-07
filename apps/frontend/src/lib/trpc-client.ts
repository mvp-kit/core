import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../backend/src/routes'

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc', // Use relative URL for Vite proxy
    }),
  ],
})