import type { Context as HonoContext } from 'hono'
import { z } from 'zod'
import { API_VERSION } from '@/lib/constants'
import type { AppContext, HonoAppEnv } from '@/lib/context'
import { createStorageService } from '@/lib/storage'
import { publicProcedure, router } from './procedures'
import { storageRouter } from './routers/storage'
import { userRouter } from './routers/user'

export function createTRPCContext(c: HonoContext<HonoAppEnv>): AppContext {
  return {
    req: c.req,
    resHeaders: new Headers(),
    env: c.env,
    auth: c.get('auth'),
    user: c.get('user'),
    session: c.get('session'),
    storage: createStorageService(c.env.R2),
  }
}

export const appRouter = router({
  hello: publicProcedure.input(z.object({ name: z.string().optional() })).query(({ input }) => ({
    greeting: `Hello ${input?.name ?? 'World'}!`,
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  })),

  ping: publicProcedure.query(() => ({
    status: 'ok',
    message: 'Core API is running',
    timestamp: new Date().toISOString(),
  })),

  auth: router({
    signup: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8, 'Password must be at least 8 characters'),
          name: z.string().min(2, 'Name must be at least 2 characters'),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
          headers: ctx.req.header() as Record<string, string>,
        })

        return {
          success: true,
          message: 'Account created successfully',
          user: result.user,
        }
      }),
  }),

  user: userRouter,
  storage: storageRouter,
})

export type AppRouter = typeof appRouter
