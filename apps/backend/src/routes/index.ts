import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { Context } from '../lib/context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  hello: publicProcedure.input(z.object({ name: z.string().optional() })).query(({ input }) => {
    return {
      greeting: `Hello ${input?.name ?? 'World'}!`,
    }
  }),
  getUser: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    // Example query - replace with actual database logic
    return {
      id: input.id,
      name: 'John Doe',
      email: 'john@example.com',
    }
  }),
})

export type AppRouter = typeof appRouter
