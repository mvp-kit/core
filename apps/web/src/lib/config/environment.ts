function requireEnv(name: string, value: string | undefined): string {
  const resolved = value?.trim()
  if (!resolved) {
    throw new Error(`${name} must be configured`)
  }

  return resolved
}

export function getWebEnvironment() {
  return {
    domain: requireEnv('VITE_DOMAIN', import.meta.env.VITE_DOMAIN),
    appDomain: requireEnv('VITE_APP_DOMAIN', import.meta.env.VITE_APP_DOMAIN),
    appUrl: requireEnv('VITE_APP_URL', import.meta.env.VITE_APP_URL),
  }
}
