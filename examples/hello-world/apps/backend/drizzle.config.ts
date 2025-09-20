import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

function getLocalD1DB() {
  try {
    const basePath = path.resolve('.wrangler')

    // Check if .wrangler directory exists
    if (!fs.existsSync(basePath)) {
      // Return a placeholder that won't cause errors during generation
      return ':memory:'
    }

    const dbFile = fs
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .find((f) => f.endsWith('.sqlite'))

    if (!dbFile) {
      // Return memory database if no sqlite file found
      return ':memory:'
    }

    const url = path.resolve(basePath, dbFile)
    return url
  } catch (_err) {
    // Return memory database on any error
    return ':memory:'
  }
}

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/index.ts',
  out: './drizzle',
  ...(process.env.NODE_ENV === 'production'
    ? {
        driver: 'd1-http',
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
          databaseId: process.env.CLOUDFLARE_DATABASE_ID,
          token: process.env.CLOUDFLARE_D1_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalD1DB(),
        },
      }),
})
