import { z } from 'zod'

// Environment validation schemas
const BaseConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PROJECT_NAME: z.string().default('mvpkit-core'),
  DOMAIN: z.string().default('mvpkit.dev'),
})

const ServerConfigSchema = BaseConfigSchema.extend({
  WORKER_NAME: z.string().optional(),
  API_PORT: z.coerce.number().default(8787),
  BUCKET_NAME: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  // Cloudflare credentials for Drizzle Studio/migrations
  CLOUDFLARE_D1_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_DATABASE_ID: z.string().optional(),
  CLOUDFLARE_D1_API_TOKEN: z.string().optional(),
})

const ClientConfigSchema = BaseConfigSchema.extend({
  FRONTEND_PORT: z.coerce.number().default(3000),
  VITE_API_URL: z.string().optional(),
  VITE_ALLOWED_HOSTS: z.string().optional(),
})

// Configuration class for server-side
export class ServerConfig {
  private config: z.infer<typeof ServerConfigSchema>

  // biome-ignore lint/suspicious/noExplicitAny: needed to handle Cloudflare Worker env objects
  constructor(env: Record<string, string | undefined> | any = process.env) {
    // Handle Cloudflare Workers env objects that have additional properties
    const envVars =
      typeof env === 'object' && env !== null
        ? Object.fromEntries(
            Object.entries(env).filter(
              ([_, value]) => typeof value === 'string' || typeof value === 'undefined'
            )
          )
        : env

    this.config = ServerConfigSchema.parse(envVars)
  }

  get nodeEnv() {
    return this.config.NODE_ENV
  }
  get isProduction() {
    return this.config.NODE_ENV === 'production'
  }
  get isDevelopment() {
    return this.config.NODE_ENV === 'development'
  }
  get projectName() {
    return this.config.PROJECT_NAME
  }
  get domain() {
    return this.config.DOMAIN
  }

  get workerName() {
    return this.config.WORKER_NAME || this.config.PROJECT_NAME
  }

  get apiPort() {
    return this.config.API_PORT
  }

  get bucketName() {
    return this.config.BUCKET_NAME || `${this.config.PROJECT_NAME}-bucket`
  }

  get apiUrl() {
    if (this.isProduction) {
      return `https://${this.workerName}.${this.domain}.workers.dev`
    }
    return `http://localhost:${this.apiPort}`
  }

  get corsOrigins() {
    // With proxying, we can be more restrictive with CORS
    if (this.config.CORS_ORIGINS) {
      return this.config.CORS_ORIGINS.split(',').map((s: string) => s.trim())
    }

    if (this.isProduction) {
      // Production: Only allow Pages Functions (same origin) and direct access
      return [`https://${this.domain}`, `https://*.${this.domain}`]
    }

    // Development: Allow Vite dev server
    return [
      `http://localhost:5173`, // Vite dev server
      `http://localhost:${this.apiPort}`, // Direct Worker access
    ]
  }

  get trustedOrigins() {
    // With proxying, trusted origins are simpler
    if (this.config.TRUSTED_ORIGINS) {
      return this.config.TRUSTED_ORIGINS.split(',').map((s: string) => s.trim())
    }

    if (this.isProduction) {
      return [`https://${this.domain}`, `https://*.${this.domain}`]
    }

    return [`localhost:*`]
  }

  get cloudflareCredentials() {
    return {
      accountId: this.config.CLOUDFLARE_D1_ACCOUNT_ID,
      databaseId: this.config.CLOUDFLARE_DATABASE_ID,
      token: this.config.CLOUDFLARE_D1_API_TOKEN,
    }
  }
}

// Configuration class for client-side (browser)
export class ClientConfig {
  private config: z.infer<typeof ClientConfigSchema>

  constructor(env: Record<string, string | undefined>) {
    this.config = ClientConfigSchema.parse(env)
  }

  get nodeEnv() {
    return this.config.NODE_ENV
  }
  get isProduction() {
    return this.config.NODE_ENV === 'production'
  }
  get isDevelopment() {
    return this.config.NODE_ENV === 'development'
  }
  get projectName() {
    return this.config.PROJECT_NAME
  }
  get domain() {
    return this.config.DOMAIN
  }
  get frontendPort() {
    return this.config.FRONTEND_PORT
  }

  get apiUrl() {
    if (this.config.VITE_API_URL) {
      return this.config.VITE_API_URL
    }

    if (this.isProduction) {
      return `https://${this.config.PROJECT_NAME}.${this.domain}.workers.dev`
    }

    return 'http://localhost:8787'
  }

  get allowedHosts() {
    if (this.config.VITE_ALLOWED_HOSTS) {
      return this.config.VITE_ALLOWED_HOSTS.split(',').map((s: string) => s.trim())
    }

    if (this.isProduction) {
      return [this.domain, `*.${this.domain}`]
    }

    return ['localhost', '127.0.0.1', this.domain, `*.${this.domain}`]
  }
}

// Convenience exports for common usage patterns
// biome-ignore lint/suspicious/noExplicitAny: needed to handle Cloudflare Worker env objects
export const createServerConfig = (env?: Record<string, string | undefined> | any) =>
  new ServerConfig(env)

export const createClientConfig = (env: Record<string, string | undefined>) => new ClientConfig(env)

// Type exports
export type ServerConfigType = ServerConfig
export type ClientConfigType = ClientConfig
