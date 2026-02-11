import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/70">
      <div className="mx-auto flex h-10 w-full max-w-5xl items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </div>
        <p className="hidden sm:block">Powered by tRPC</p>
      </div>
    </footer>
  )
}
