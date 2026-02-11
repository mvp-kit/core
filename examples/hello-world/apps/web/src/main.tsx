import { renderRouterApp } from '@repo/config/bootstrap'
import { Providers } from '@/lib/providers'
import { routeTree } from './routeTree.gen'
import './styles.css'

const router = renderRouterApp({ routeTree, Providers })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
