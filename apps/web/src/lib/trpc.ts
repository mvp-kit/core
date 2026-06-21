import type { AppRouter } from '@repo/types'
import type { CreateTRPCReact } from '@trpc/react-query'
import { createTRPCReact } from '@trpc/react-query'

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>()
