import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../backend/src/routes'

// Backend URL - change this to your deployed Worker URL for remote testing
// For local development: http://localhost:8787
// For remote testing: https://your-worker.your-subdomain.workers.dev
const BACKEND_URL = 'http://localhost:8787'

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
    }),
  ],
})