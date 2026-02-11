export function withQuery(path: string, params: Record<string, string | undefined>): string {
  const url = new URL(path, 'http://local')
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    url.searchParams.set(key, value)
  }
  return `${url.pathname}${url.search}`
}
