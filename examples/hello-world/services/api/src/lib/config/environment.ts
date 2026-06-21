import type { AppBindings } from '@/lib/context'

function requireEnv(name: string, value: string | undefined): string {
  const resolved = value?.trim()
  if (!resolved) {
    throw new Error(`${name} must be configured`)
  }

  return resolved
}

export function getCorsOrigins(env: AppBindings): string[] {
  const trusted = requireEnv('TRUSTED_ORIGINS', env.TRUSTED_ORIGINS)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (trusted.length === 0) {
    throw new Error('TRUSTED_ORIGINS must contain at least one origin')
  }

  return trusted
}
