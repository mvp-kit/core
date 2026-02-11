import { protectedProcedure, router } from '@/trpc/procedures'

export const userRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => ({
    id: ctx.user.id,
    name: ctx.user.name,
    email: ctx.user.email,
    emailVerified: ctx.user.emailVerified,
    image: ctx.user.image,
    createdAt: ctx.user.createdAt,
    updatedAt: ctx.user.updatedAt,
  })),
})
