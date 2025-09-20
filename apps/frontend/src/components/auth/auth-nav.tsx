import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { NavLogo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

interface AuthNavProps {
  className?: string
}

export function AuthNav({ className }: AuthNavProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b ${className}`}
    >
      <div className="flex justify-center px-4">
        <div className="max-w-6xl w-full h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <NavLogo />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
