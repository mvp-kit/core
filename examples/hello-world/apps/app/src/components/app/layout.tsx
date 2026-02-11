import type { ReactNode } from 'react'
import { AppFooter } from '@/components/app/footer'
import { AppHeader } from '@/components/app/header'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="core-page-bg flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <AppFooter />
    </div>
  )
}
