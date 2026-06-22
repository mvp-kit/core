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

type CheckStatus = 'idle' | 'running' | 'success' | 'failure'

export const Route = createFileRoute('/_app/')({
  component: AppHome,
})

function AppHome() {
  const ping = trpc.ping.useQuery(undefined, {
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const userProfile = trpc.user.get.useQuery(undefined, {
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const storageList = trpc.storage.list.useQuery(
    { prefix: 'core-smoke/' },
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [message, setMessage] = useState('Click Test to verify API, auth, and storage readiness.')

  const runApiHealthCheck = async () => {
    setStatus('running')
    setMessage('Running baseline checks...')

    const [pingResult, userResult, storageResult] = await Promise.all([
      ping.refetch(),
      userProfile.refetch(),
      storageList.refetch(),
    ])

    const failedChecks = [
      pingResult.error ? 'API' : null,
      userResult.error ? 'Auth' : null,
      storageResult.error ? 'Storage' : null,
    ].filter(Boolean)

    if (failedChecks.length > 0) {
      setStatus('failure')
      setMessage(`${failedChecks.join(', ')} check failed. Confirm local bindings and auth setup.`)
      return
    }

    setStatus('success')
    setMessage(
      `${pingResult.data?.message ?? 'Core API is running'} Authenticated as ${
        userResult.data?.email ?? 'current user'
      }. Storage listed ${storageResult.data?.objects.length ?? 0} object(s).`
    )
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
              <p className="text-sm font-medium">Baseline Readiness</p>
              <p className="text-xs text-muted-foreground">API, auth session, and R2 storage</p>
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

            <p className="mt-2 text-sm">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
