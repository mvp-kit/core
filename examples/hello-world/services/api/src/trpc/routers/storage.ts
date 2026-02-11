import { z } from 'zod'
import { protectedProcedure, router } from '@/trpc/procedures'

export const storageRouter = router({
  upload: protectedProcedure
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

  list: protectedProcedure
    .input(z.object({ prefix: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const objects = await ctx.storage.list(input?.prefix)
      return {
        objects: objects.map((obj) => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded,
        })),
      }
    }),
})
