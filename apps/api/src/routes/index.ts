import { initTRPC, TRPCError } from '@trpc/server'
import type { Context as HonoContext } from 'hono'
import { z } from 'zod'
import type { AppContext, HonoAppEnv } from '@/lib/context'
import { createStorageService } from '@/lib/storage'

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

const t = initTRPC.context<AppContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure that requires authentication
const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
    },
  })
})

// Create backend router that extends the API router with actual implementations
export const appRouter = router({
  // Use public procedures from API router
  hello: publicProcedure.input(z.object({ name: z.string().optional() })).query(({ input }) => ({
    greeting: `Hello ${input?.name ?? 'World'}!`,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })),

  ping: publicProcedure.query(() => ({
    status: 'ok',
    message: 'Core API is running',
    timestamp: new Date().toISOString(),
  })),

  // Authentication with actual implementation
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth

      try {
        const result = await auth.api.signUpEmail({
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
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'An account with this email already exists',
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        })
      }
    }),

  // Protected procedures
  getUser: protectedProcedure.query(async ({ ctx }) => ({
    id: ctx.user.id,
    name: ctx.user.name,
    email: ctx.user.email,
    emailVerified: ctx.user.emailVerified,
    image: ctx.user.image,
    createdAt: ctx.user.createdAt,
    updatedAt: ctx.user.updatedAt,
  })),

  storageUpload: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        data: z.string(),
        contentType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const key = await ctx.storage.upload(input.key, input.data, input.contentType)
      return { success: true, key }
    }),

  storageList: protectedProcedure
    .input(z.object({ prefix: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const objects = await ctx.storage.list(input.prefix)
      return {
        objects: objects.map((obj: { key: string; size: number; uploaded: string }) => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded,
        })),
      }
    }),
})

// Re-export the AppRouter type from api to ensure type consistency
export type AppRouter = typeof appRouter
