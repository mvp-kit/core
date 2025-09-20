// Cloudflare Pages Function to proxy API calls to Workers backend
export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  // Build the target URL for the Workers backend
  const targetUrl = new URL(`https://workers.{{domainName}}${url.pathname}${url.search}`)

  // Forward the request to the Workers backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  })

  // Return the response from the Workers backend
  return response
}
