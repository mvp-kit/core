import type { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types'
import type { Session, User } from 'better-auth/types'
import type { HonoRequest } from 'hono'
import type { createAuth } from '@/lib/auth'

export interface AppBindings {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  // Environment variables for configuration
  NODE_ENV?: string
  DOMAIN?: string
  TRUSTED_ORIGINS?: string
}

export type AppVariables = {
  auth: ReturnType<typeof createAuth>
  user?: User
  session?: Session
}

export interface AppContext extends Record<string, unknown> {
  req: HonoRequest
  resHeaders: Headers
  env: AppBindings
  auth: ReturnType<typeof createAuth>
  user?: User
  session?: Session
  storage: import('./storage').StorageService
}

export type HonoAppEnv = { Bindings: AppBindings; Variables: AppVariables }
