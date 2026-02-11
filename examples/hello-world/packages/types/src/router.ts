import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { storageListSchema, storageUploadSchema } from './schemas/storage'

const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure.input(z.object({ name: z.string().optional() })).query(({ input }) => ({
    greeting: `Hello ${input?.name ?? 'World'}!`,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })),

  ping: t.procedure.query(() => ({
    status: 'ok',
    message: 'Core API is running',
    timestamp: new Date().toISOString(),
  })),

  user: t.router({
    get: t.procedure.query(() => ({
      id: 'user-id',
      name: 'User Name',
      email: 'user@example.com',
      emailVerified: true,
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  }),

  storage: t.router({
    upload: t.procedure.input(storageUploadSchema).mutation(({ input }) => ({
      success: true,
      key: input.key,
    })),
    list: t.procedure.input(storageListSchema.optional()).query(() => ({
      objects: [],
    })),
  }),

  auth: t.router({
    signup: t.procedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
          name: z.string().min(2),
        })
      )
      .mutation(({ input }) => ({
        success: true,
        message: 'Account created successfully',
        user: input,
      })),
  }),
})

export type AppRouter = typeof appRouter
