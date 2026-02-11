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
import { SiteLayout } from '@/components/layout'
import { appPath } from '@/lib/config/paths'
import { trpc } from '@/lib/trpc'

export const Route = createFileRoute('/')({
  component: WebHome,
})

function WebHome() {
  const ping = trpc.ping.useQuery()
  const user = trpc.user.get.useQuery(undefined, {
    retry: false,
  })

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-xl flex-col items-center justify-center gap-5 py-1 text-center">
        <div className="space-y-2.5">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            Hello World
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-[2.2rem]">Hello World!</h1>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            Your full-stack is running. Use this polished baseline to launch quickly, then evolve it
            into your product.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild className="sm:min-w-44">
            <a href="https://mvpkit.dev/docs" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </Button>
          <Button asChild variant="outline" className="sm:min-w-36">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </div>

        <Card className="w-full border-border/80 shadow-sm">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-center text-lg">Test</CardTitle>
            <CardDescription className="text-center">
              Verify your backend and database are working
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="core-test-item">
              <div>
                <p className="text-sm font-medium">Health</p>
                <p className="text-xs text-muted-foreground">
                  {ping.isLoading
                    ? 'Checking API'
                    : ping.isError
                      ? 'API unavailable'
                      : ping.data?.status === 'ok'
                        ? 'API connected'
                        : 'Status unknown'}
                </p>
              </div>
              <Button size="sm" className="h-8 px-3" onClick={() => ping.refetch()}>
                Test
              </Button>
            </div>
            <div className="core-test-item">
              <div>
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">
                  {user.isLoading
                    ? 'Checking auth'
                    : user.isError
                      ? 'Sign in required'
                      : 'Auth and database connected'}
                </p>
              </div>
              <Button
                asChild
                size="sm"
                className="h-8 px-3"
                variant={user.isError ? 'outline' : 'default'}
              >
                <a href={user.isError ? appPath('/auth/sign-in') : appPath('/')}>
                  {user.isError ? 'Sign In' : 'Open'}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  )
}
