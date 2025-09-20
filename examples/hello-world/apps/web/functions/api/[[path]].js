// Cloudflare Pages Function to proxy API calls to Workers backend
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  // Get the backend URL from environment variables or use localhost for development
  const backendUrl = env.VITE_API_URL || 'http://localhost:8787'

  // Build the target URL for the Workers backend
  const targetUrl = new URL(`${backendUrl}${url.pathname}${url.search}`)

  // Forward the request to the Workers backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  })

  // Return the response from the Workers backend
  return response
}
