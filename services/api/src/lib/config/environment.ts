import type { AppBindings } from '@/lib/context'

export function getCorsOrigins(env: AppBindings): string[] {
  const trusted = env.TRUSTED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (trusted && trusted.length > 0) {
    return trusted
  }

  const domain = env.DOMAIN?.trim()
  if (!domain) {
    return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
  }

  return [`https://${domain}`, `https://app.${domain}`, `https://www.${domain}`]
}
