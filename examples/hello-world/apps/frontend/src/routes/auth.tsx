import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AuthLayout } from '@/components/auth/auth-layout'

export const Route = createFileRoute('/auth')({
  component: Auth,
})

function Auth() {
  const search = useSearch({ from: '/auth' }) as { tab?: 'signin' | 'signup' }
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    if (search?.tab === 'signup') {
      setActiveTab('signup')
    } else if (search?.tab === 'signin') {
      setActiveTab('signin')
    }
  }, [search?.tab])

  return <AuthLayout activeTab={activeTab} onTabChange={setActiveTab} />
}
