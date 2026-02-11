export function getWebEnvironment() {
  return {
    domain: import.meta.env.VITE_DOMAIN || 'localhost',
    appDomain: import.meta.env.VITE_APP_DOMAIN || '',
    appUrl: import.meta.env.VITE_APP_URL || '',
  }
}
