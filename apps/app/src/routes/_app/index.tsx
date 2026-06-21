import { Badge } from '@repo/ui/components/ui/badge'
import { Button } from '@repo/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/_app/')({
  component: AppHome,
})

function AppHome() {
  const ping = trpc.ping.useQuery(undefined, {
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failure'>('idle')

  const runApiHealthCheck = async () => {
    setStatus('running')
    const result = await ping.refetch()
    setStatus(result.error ? 'failure' : 'success')
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
          Core Dashboard
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Your foundation is live. Run a quick connectivity check and continue building your
          product.
        </p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">System Check</CardTitle>
          <CardDescription>Verify API connectivity and baseline app readiness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="core-test-item">
            <div>
              <p className="text-sm font-medium">API Health</p>
              <p className="text-xs text-muted-foreground">tRPC ping endpoint</p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-8 px-3"
              onClick={runApiHealthCheck}
              disabled={status === 'running'}
            >
              {status === 'running' ? 'Testing...' : 'Test'}
            </Button>
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/35 px-3 py-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant={
                  status === 'success'
                    ? 'default'
                    : status === 'failure'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {status === 'running'
                  ? 'Testing'
                  : status === 'success'
                    ? 'Success'
                    : status === 'failure'
                      ? 'Failure'
                      : 'Not tested'}
              </Badge>
            </div>

            <p className="mt-2 text-sm">
              {status === 'running'
                ? 'Running API health check...'
                : status === 'success'
                  ? (ping.data?.message ?? 'Core API is running')
                  : status === 'failure'
                    ? 'Could not reach the API. Please try again.'
                    : 'Click Test to verify API connectivity.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
