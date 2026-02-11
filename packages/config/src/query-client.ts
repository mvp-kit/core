import { QueryClient, type QueryClientConfig } from '@tanstack/react-query'

export function createQueryClient(defaultOptions?: QueryClientConfig['defaultOptions']) {
  return new QueryClient({
    defaultOptions,
  })
}
