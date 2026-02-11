import { z } from 'zod'

export const storageUploadSchema = z.object({
  key: z.string().min(1),
  data: z.string().min(1),
  contentType: z.string().optional(),
})

export const storageListSchema = z.object({
  prefix: z.string().optional(),
})
