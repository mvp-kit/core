import type { Fetcher, PagesFunction } from '@cloudflare/workers-types'

interface Env {
  API?: Fetcher
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)

  // Proxy /api requests to the bound API worker in production.
  if (url.pathname.startsWith('/api') && env.API) {
    return env.API.fetch(request)
  }

  return context.next()
}
