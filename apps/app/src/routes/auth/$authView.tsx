import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/layout'
import { SignInForm } from '@/components/auth/sign-in-form'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { SignedIn } from '@/components/auth/signed-in'
import { SignedOut } from '@/components/auth/signed-out'
import { authClient } from '@/lib/auth-client'

type AuthView = 'sign-in' | 'sign-up' | 'sign-out'

function RedirectToHome() {
  const router = useRouter()

  useEffect(() => {
    router.navigate({ to: '/' })
  }, [router])

  return null
}

function SignOutView() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const result = await authClient.signOut()
      if (result.error) {
        toast.error(result.error.message || 'Unable to sign out')
      }
      router.navigate({
        to: '/auth/$authView',
        params: { authView: 'sign-in' },
      })
    })()
  }, [router])

  return <p className="text-center text-sm text-muted-foreground">Signing you out...</p>
}

export const Route = createFileRoute('/auth/$authView')({
  component: AuthPage,
})

function AuthPage() {
  const { authView } = Route.useParams()
  const normalizedView: AuthView = useMemo(() => {
    if (authView === 'sign-up' || authView === 'sign-out') return authView
    return 'sign-in'
  }, [authView])

  return (
    <AuthLayout activeView={normalizedView === 'sign-up' ? 'sign-up' : 'sign-in'}>
      {normalizedView === 'sign-out' ? (
        <SignOutView />
      ) : (
        <>
          <SignedIn>
            <RedirectToHome />
          </SignedIn>
          <SignedOut>{normalizedView === 'sign-up' ? <SignUpForm /> : <SignInForm />}</SignedOut>
        </>
      )}
    </AuthLayout>
  )
}
