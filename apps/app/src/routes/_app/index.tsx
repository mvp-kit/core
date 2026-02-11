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
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/_app/')({
  component: AppHome,
})

function AppHome() {
  const ping = trpc.ping.useQuery()

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
            <Button type="button" size="sm" className="h-8 px-3" onClick={() => ping.refetch()}>
              Test
            </Button>
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/35 px-3 py-2 text-sm">
            {ping.isLoading ? 'Checking API status...' : (ping.data?.message ?? 'No response yet')}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
