import { initTRPC } from '@trpc/server'
import { z } from 'zod'

// Initialize tRPC for type definitions
const t = initTRPC.create()

// Define explicit input/output types to avoid conflicts
export type HelloInput = {
  name?: string
}

export type HelloOutput = {
  greeting: string
  timestamp: string
  version: string
}

export type PingOutput = {
  status: string
  message: string
  timestamp: string
}

export type SignupInput = {
  email: string
  password: string
  name: string
}

export type SignupOutput = {
  success: boolean
  message: string
  user: SignupInput
}

export type UserOutput = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

export type StorageUploadInput = {
  key: string
  data: string
  contentType?: string
}

export type StorageUploadOutput = {
  success: boolean
  key: string
}

export type StorageListInput = {
  prefix?: string
}

export type StorageListOutput = {
  objects: Array<{
    key: string
    size: number
    uploaded: string
  }>
}

// Extension point for future licensing integration
// License-related types and procedures will be added via CLI-based kit extensions

// Define all the API procedures and their types
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

  signup: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
      })
    )
    .mutation(async ({ input }) => {
      // This is just for type definition - actual implementation is in backend
      return {
        success: true,
        message: 'Account created successfully',
        user: input,
      }
    }),

  getUser: t.procedure.query(() => ({
    id: 'user-id',
    name: 'User Name',
    email: 'user@example.com',
    emailVerified: true,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  storageUpload: t.procedure
    .input(
      z.object({
        key: z.string(),
        data: z.string(),
        contentType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => ({
      success: true,
      key: input.key,
    })),

  storageList: t.procedure
    .input(z.object({ prefix: z.string().optional() }))
    .query(({ input }) => ({
      objects: [
        { key: `${input?.prefix || ''}test-key`, size: 1024, uploaded: new Date().toISOString() },
      ],
    })),

  // Extension point: Additional procedures can be added here via CLI-based kit extensions
  // For example: licensing, analytics, premium features, etc.
})

// Create explicit type definitions to avoid tRPC inference conflicts
export type AppRouter = typeof appRouter
