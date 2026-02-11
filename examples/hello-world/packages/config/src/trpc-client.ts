import { httpBatchLink } from '@trpc/client'

export function createCookieBatchLink(url = '/api'): ReturnType<typeof httpBatchLink> {
  return httpBatchLink({
    url,
    fetch(linkUrl, options) {
      return fetch(linkUrl, {
        ...options,
        credentials: 'include',
      })
    },
  })
}
