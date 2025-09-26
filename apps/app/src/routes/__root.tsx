import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Providers } from '@/lib/providers'

export const Route = createRootRoute({
  component: () => (
    <Providers>
      <Outlet />
    </Providers>
  ),
})
