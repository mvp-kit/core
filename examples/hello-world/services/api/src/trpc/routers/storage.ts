import { storageListSchema, storageUploadSchema } from '@repo/types/schemas/storage'
import { protectedProcedure, router } from '@/trpc/procedures'

export const storageRouter = router({
  upload: protectedProcedure.input(storageUploadSchema).mutation(async ({ ctx, input }) => {
    const key = await ctx.storage.upload(input.key, input.data, input.contentType)
    return { success: true, key }
  }),

  list: protectedProcedure.input(storageListSchema.optional()).query(async ({ ctx, input }) => {
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
