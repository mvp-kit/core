import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

type AuthLayoutProps = {
  children: ReactNode
  activeView: 'sign-in' | 'sign-up'
}

export function AuthLayout({ children, activeView }: AuthLayoutProps) {
  return (
    <div className="core-page-bg min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto grid h-12 w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4">
          <Link
            to="/"
            className="justify-self-start text-sm text-muted-foreground hover:text-foreground"
          >
            Back
          </Link>
          <Link to="/" className="mx-auto inline-flex items-center gap-2">
            <span className="core-logo-mark" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">hello-world</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Core
            </span>
          </Link>
          <div className="justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="grid min-h-[calc(100svh-5.5rem)] place-items-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="grid grid-cols-2 rounded-lg border border-border/80 bg-muted/35 p-1 text-sm">
            <Link
              to="/auth/$authView"
              params={{ authView: 'sign-in' }}
              className={`rounded-md px-3 py-2 text-center font-medium transition-colors ${
                activeView === 'sign-in'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/auth/$authView"
              params={{ authView: 'sign-up' }}
              className={`rounded-md px-3 py-2 text-center font-medium transition-colors ${
                activeView === 'sign-up'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </Link>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm sm:p-7">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/80 bg-background/70">
        <div className="mx-auto flex h-10 w-full max-w-5xl items-center justify-between px-4 text-xs text-muted-foreground">
          <p>hello-world Core</p>
          <p>Secure auth powered by Better Auth + tRPC</p>
        </div>
      </footer>
    </div>
  )
}
