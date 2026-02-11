import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@/lib/auth'
import { getCorsOrigins } from '@/lib/config/environment'
import type { AppBindings, AppVariables } from '@/lib/context'
import { appRouter, createTRPCContext } from '@/trpc'

export function createApp() {
  const app = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>()

  app.use('*', async (c, next) => {
    return cors({
      origin: getCorsOrigins(c.env),
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    })(c, next)
  })

  app.use('*', async (c, next) => {
    const auth = createAuth(
      c.env,
      ((c.req.raw as { cf?: unknown }).cf || {}) as IncomingRequestCfProperties
    )
    c.set('auth', auth)

    try {
      const session = await auth.api.getSession({
        headers: new Headers(c.req.header()),
      })

      if (session) {
        c.set('user', session.user)
        c.set('session', session.session)
      }
    } catch {
      // no session available
    }

    await next()
  })

  app.get('/health', (c) => c.json({ status: 'ok' }))

  app.all('/api/auth/*', async (c) => {
    const auth = c.get('auth')
    return auth.handler(c.req.raw)
  })

  app.use(
    '/api/*',
    trpcServer({
      router: appRouter,
      createContext: (_, c) => createTRPCContext(c),
    })
  )

  return app
}
