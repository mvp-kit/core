import type { ReactNode } from 'react'
import { useSession } from '@/lib/auth-client'

export function SignedOut({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()
  if (isPending || session) return null
  return <>{children}</>
}
