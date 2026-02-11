import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AppLayout } from '@/components/app/layout'
import { SignedIn } from '@/components/auth/signed-in'
import { useSession } from '@/lib/auth-client'

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
})

function AppLayoutRoute() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.navigate({
        to: '/auth/$authView',
        params: { authView: 'sign-in' },
      })
    }
  }, [isPending, router, session])

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <SignedIn>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </SignedIn>
  )
}
