import type { HonoRequest } from 'hono'
import type { DB } from './db'

export interface Context {
  req: HonoRequest
  resHeaders: Headers
  env: {
    DB: D1Database
    KV: KVNamespace
    R2: R2Bucket
    // SESSION: DurableObjectNamespace
  }
  db: DB
}
