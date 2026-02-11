import { Button } from '@repo/ui/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'
import { authClient, useSession } from '@/lib/auth-client'

export function AppHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-12 w-full max-w-5xl grid-cols-[auto_1fr_auto] items-center px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src="/icon.svg" alt="MVP Kit" className="h-4 w-4 rounded-sm" />
          <span className="text-sm font-semibold tracking-tight">MVP Kit</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Core
          </span>
        </Link>

        <p className="justify-self-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="hidden text-xs text-muted-foreground md:inline">
            {session?.user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={async () => {
              await authClient.signOut()
              window.location.assign('/auth/sign-in')
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
