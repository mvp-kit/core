import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createDB } from './lib/db'
import { appRouter } from './routes'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  SESSION: DurableObjectNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/health', (c) => c.json({ status: 'ok' }))

app.use('/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({
      req: c.req,
      resHeaders: c.res.headers,
      env: c.env,
      db: createDB(c.env.DB),
    }),
  })
})

export default app
