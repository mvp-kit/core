import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/footer'
import { SiteHeader } from '@/components/header'

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="core-page-bg flex min-h-screen flex-col text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:py-5">{children}</main>
      <SiteFooter />
    </div>
  )
}
