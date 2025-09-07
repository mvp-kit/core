import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'

export function createDB(db: D1Database) {
  return drizzle(db)
}

export type DB = ReturnType<typeof createDB>
