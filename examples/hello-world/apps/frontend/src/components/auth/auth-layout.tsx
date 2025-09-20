import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { NavLogo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'

interface AuthLayoutProps {
  activeTab: 'signin' | 'signup'
  onTabChange: (tab: 'signin' | 'signup') => void
}

export function AuthLayout({ activeTab, onTabChange }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6">
            <button
              type="button"
              onClick={() => onTabChange('signin')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'signin'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onTabChange('signup')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'signup'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'signin' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  )
}
