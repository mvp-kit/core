import type { R2Bucket } from '@cloudflare/workers-types'

export interface StorageService {
  upload: (key: string, data: ArrayBuffer | string, contentType?: string) => Promise<string>
  download: (key: string) => Promise<ArrayBuffer | null>
  delete: (key: string) => Promise<boolean>
  list: (prefix?: string) => Promise<Array<{ key: string; size: number; uploaded: string }>>
}

export function createStorageService(bucket: R2Bucket): StorageService {
  return {
    async upload(key: string, data: ArrayBuffer | string, contentType?: string): Promise<string> {
      const body = typeof data === 'string' ? data : data
      const options: R2PutOptions = {}

      if (contentType) {
        options.httpMetadata = { contentType }
      }

      const object = await bucket.put(key, body, options)
      return object.key
    },

    async download(key: string): Promise<ArrayBuffer | null> {
      const object = await bucket.get(key)
      return object ? await object.arrayBuffer() : null
    },

    async delete(key: string): Promise<boolean> {
      await bucket.delete(key)
      return true
    },

    async list(prefix?: string): Promise<Array<{ key: string; size: number; uploaded: string }>> {
      const objects = await bucket.list({ prefix })
      return objects.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded.toISOString(),
      }))
    },
  }
}

interface R2PutOptions {
  httpMetadata?: {
    contentType?: string
  }
}
