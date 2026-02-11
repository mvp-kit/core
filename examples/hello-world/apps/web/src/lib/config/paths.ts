import { getWebEnvironment } from '@/lib/config/environment'

function normalizeDomain(input: string): string {
  return input.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

function getAppBaseUrl(): string {
  const { appDomain, appUrl, domain } = getWebEnvironment()

  if (appUrl) {
    return appUrl.replace(/\/+$/, '')
  }

  if (appDomain) {
    return `https://${normalizeDomain(appDomain)}`
  }

  const appHost = normalizeDomain(appDomain || `app.${domain}`)

  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost'
    if (isLocalhost) {
      return 'http://localhost:3002'
    }
  }

  return `https://${appHost}`
}

export function appPath(path = ''): string {
  const base = getAppBaseUrl()
  if (!path) return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
