import type {
  D1Database,
  IncomingRequestCfProperties,
  KVNamespace,
} from '@cloudflare/workers-types'

// Flexible type to handle Cloudflare type conflicts
type FlexibleKVNamespace = KVNamespace

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { withCloudflare } from 'better-auth-cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import type { AppBindings } from '@/lib/context'
import { schema } from '@/lib/db/schema'

function createAuth(
  env?: AppBindings,
  cf?: IncomingRequestCfProperties
): ReturnType<typeof betterAuth> {
  // biome-ignore lint/suspicious/noExplicitAny: needed for fallback type
  const db = env ? drizzle(env.DB, { schema, logger: false }) : ({} as any)

  // Simple helper to get trusted origins without createServerConfig
  const getTrustedOrigins = (env?: AppBindings) => {
    if (!env) return ['localhost:*']

    const nodeEnv = env.NODE_ENV || 'development'
    const domain = env.DOMAIN || 'hello-world.mvpkit.dev'
    const trustedOrigins = env.TRUSTED_ORIGINS

    if (trustedOrigins) {
      return trustedOrigins.split(',').map((s: string) => s.trim())
    }

    if (nodeEnv === 'production') {
      return [`https://${domain}`, `https://*.${domain}`]
    }

    return [`localhost:*`, `https://${domain}`, `https://*.${domain}`]
  }

  // Cloudflare configuration
  const cloudflareConfig = {
    autoDetectIpAddress: true,
    geolocationTracking: true,
    cf: cf || {},
    d1: env
      ? {
          db: db,
          options: {
            usePlural: true,
            debugLogs: false,
          },
        }
      : undefined,
    kv: env?.KV as FlexibleKVNamespace,
  }

  const authConfig = {
    emailAndPassword: {
      enabled: true,
    },
    rateLimit: {
      enabled: true,
    },
    trustedOrigins: getTrustedOrigins(env),
  }

  const config = {
    ...withCloudflare(cloudflareConfig, authConfig),
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: 'sqlite',
            usePlural: true,
            debugLogs: false,
          }),
        }),
  }

  return betterAuth(config)
}

// Export for CLI Schema ONLY
export const auth: ReturnType<typeof betterAuth> = createAuth()
export default auth

// Export for runtime usage
export { createAuth }
