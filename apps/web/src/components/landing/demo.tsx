import { Button } from '@repo/ui'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { trpc } from '@/lib/trpc'

export const APIDemo = () => {
  const [testResults, setTestResults] = useState<{
    ping?: 'loading' | 'success' | 'error'
    user?: 'loading' | 'success' | 'error'
  }>({})
  const [userResult, setUserResult] = useState<{ user?: { name?: string; email?: string } } | null>(
    null
  )
  const [errorMessages, setErrorMessages] = useState<{
    ping?: string
    user?: string
  }>({})

  // Use queries with disabled state to control when API calls are made
  const pingQuery = trpc.ping.useQuery(undefined, { enabled: false })
  const userQuery = trpc.getUser.useQuery(undefined, { enabled: false })

  // Helper function to extract error messages from tRPC errors
  const getTRPCErrorMessage = (error: unknown, fallback: string): string => {
    if (error && typeof error === 'object') {
      if ('message' in error) {
        return error.message as string
      }
      if (
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
      ) {
        return error.data.message as string
      }
      if (
        'shape' in error &&
        error.shape &&
        typeof error.shape === 'object' &&
        'message' in error.shape
      ) {
        return error.shape.message as string
      }
    }
    if (error instanceof Error) {
      return error.message
    }
    return fallback
  }

  const testPing = async () => {
    setTestResults((prev) => ({ ...prev, ping: 'loading' }))
    setErrorMessages((prev) => ({ ...prev, ping: '' }))

    try {
      const result = await pingQuery.refetch()
      if (result.error) {
        throw result.error
      }
      setTestResults((prev) => ({ ...prev, ping: 'success' }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, ping: 'error' }))
      const errorMessage = getTRPCErrorMessage(error, 'Failed to connect to ping API')
      setErrorMessages((prev) => ({ ...prev, ping: errorMessage }))
    }
  }

  const testUser = async () => {
    setTestResults((prev) => ({ ...prev, user: 'loading' }))
    setErrorMessages((prev) => ({ ...prev, user: '' }))

    try {
      const result = await userQuery.refetch()
      if (result.error) {
        throw result.error
      }
      setUserResult({ user: result.data })
      setTestResults((prev) => ({ ...prev, user: 'success' }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, user: 'error' }))
      setUserResult(null)
      const errorMessage = getTRPCErrorMessage(
        error,
        'Failed to fetch user data - no active session'
      )
      setErrorMessages((prev) => ({ ...prev, user: errorMessage }))
    }
  }

  const getStatusIcon = (status?: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Health Check */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="font-medium text-sm">Health</div>
            <div className="text-xs text-muted-foreground">
              {pingQuery.data?.message ? '✓ Connected' : 'Test server'}
            </div>
            {errorMessages.ping && (
              <div className="text-xs text-destructive mt-1">{errorMessages.ping}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.ping)}
            <Button
              size="sm"
              onClick={testPing}
              disabled={pingQuery.isFetching || testResults.ping === 'loading'}
              className="text-xs"
            >
              Test
            </Button>
          </div>
        </div>

        {/* User Check */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="font-medium text-sm">User</div>
            <div className="text-xs text-muted-foreground">
              {userResult?.user ? `✓ User : ${userResult.user.name}` : 'Test auth and database'}
            </div>
            {errorMessages.user && (
              <div className="text-xs text-destructive mt-1">{errorMessages.user}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.user)}
            <Button
              size="sm"
              onClick={testUser}
              disabled={testResults.user === 'loading'}
              className="text-xs"
            >
              Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
