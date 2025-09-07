import { useState } from 'react'
import { Button } from './ui/button'
import { trpcClient } from '../lib/trpc-client'

// Import the backend URL from the client config
const BACKEND_URL = 'http://localhost:8787' // This should match the URL in trpc-client.tsx

export function BackendTest() {
  const [helloResult, setHelloResult] = useState<string>('')
  const [userResult, setUserResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const testHello = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await trpcClient.hello.query({ name: 'Frontend' })
      setHelloResult(JSON.stringify(result, null, 2))
    } catch (err) {
      setError(`Failed to connect to backend: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGetUser = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await trpcClient.getUser.query({ id: 'test-user-123' })
      setUserResult(JSON.stringify(result, null, 2))
    } catch (err) {
      setError(`Failed to connect to backend: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold">Backend Connection Test</h2>
      <p className="text-muted-foreground">
        Test the connection between frontend and backend using tRPC
      </p>

      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Current Backend URL:</h3>
        <code className="text-sm">{BACKEND_URL}</code>
        <p className="text-xs text-muted-foreground mt-1">
          Update this in <code>src/lib/trpc-client.tsx</code> for remote testing
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={testHello}
          disabled={isLoading}
          variant="default"
        >
          {isLoading ? 'Testing...' : 'Test Hello Endpoint'}
        </Button>

        <Button
          onClick={testGetUser}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Testing...' : 'Test Get User Endpoint'}
        </Button>
      </div>

      {error && (
        <div className="p-4 border border-destructive rounded-md bg-destructive/10">
          <p className="text-destructive font-medium">Error:</p>
          <p className="text-destructive text-sm mt-1">{error}</p>
        </div>
      )}

      {helloResult && (
        <div className="space-y-2">
          <h3 className="font-medium">Hello Response:</h3>
          <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
            {helloResult}
          </pre>
        </div>
      )}

      {userResult && (
        <div className="space-y-2">
          <h3 className="font-medium">User Response:</h3>
          <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
            {userResult}
          </pre>
        </div>
      )}

      <div className="space-y-2 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium">For Local Testing:</h4>
          <p>Start backend: <code className="bg-muted px-1 py-0.5 rounded">cd apps/backend && pnpm dev</code></p>
        </div>

        <div>
          <h4 className="font-medium">For Remote Testing:</h4>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Deploy backend: <code className="bg-muted px-1 py-0.5 rounded">cd apps/backend && pnpm deploy</code></li>
            <li>Update BACKEND_URL in <code>src/lib/trpc-client.tsx</code></li>
            <li>Rebuild frontend: <code className="bg-muted px-1 py-0.5 rounded">cd apps/frontend && pnpm build</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}