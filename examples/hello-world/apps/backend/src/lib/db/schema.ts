import * as authSchema from './auth.schema'

// Combine all schemas here for migrations
export const schema = {
  ...authSchema,
  // ... your other application schemas
} as const
