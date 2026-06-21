import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: '',
  fetchOptions: {
    credentials: 'include',
  },
})

export const useSession: typeof authClient.useSession = authClient.useSession
