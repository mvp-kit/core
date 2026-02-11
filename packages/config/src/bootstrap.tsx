import { createRouter, RouterProvider } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

type ProvidersComponent = (props: { children: ReactNode }) => ReactNode

export function renderRouterApp({
  routeTree,
  Providers,
  rootElementId = 'root',
}: {
  routeTree: Parameters<typeof createRouter>[0]['routeTree']
  Providers: ProvidersComponent
  rootElementId?: string
}) {
  const router = createRouter({ routeTree })

  createRoot(document.getElementById(rootElementId)!).render(
    <StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>
  )

  return router
}
