import { Button } from '@repo/ui/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'
import { appPath } from '@/lib/config/paths'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <span
            className="inline-flex h-6 w-6 items-center justify-center text-foreground"
            aria-hidden="true"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" />
              <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight">hello-world</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Core
          </span>
        </Link>
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="h-8 rounded-md px-3">
            <a href={appPath('/auth/sign-in')}>Sign In</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
