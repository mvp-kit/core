import { trpcServer } from '@hono/trpc-server'
import { createServerConfig } from '@config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@/lib/auth'
import type { AppBindings, AppVariables } from '@/lib/context'
import { appRouter, createTRPCContext } from '@/routes'

const app = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>()

// CORS configuration - configured per request to access env vars
app.use('*', async (c, next) => {
  // biome-ignore lint/suspicious/noExplicitAny: needed for type compatibility with createServerConfig
  const config = createServerConfig(c.env as any)
  return cors({
    origin: config.corsOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  })(c, next)
})

app.use('*', async (c, next) => {
  // biome-ignore lint/suspicious/noExplicitAny: needed for fallback type
  const auth = createAuth(c.env, (c.req.raw as any).cf || {})
  c.set('auth', auth)

  // Extract user session if available
  try {
    const session = await auth.api.getSession({
      headers: new Headers(c.req.header()),
    })
    if (session) {
      c.set('user', session.user)
      c.set('session', session.session)
    }
  } catch {
    // No session available, continue without user
  }

  await next()
})

app.get('/health', (c) => c.json({ status: 'ok' }))

// Handle all auth routes
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

export default app
