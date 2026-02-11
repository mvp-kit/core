import { createFileRoute } from '@tanstack/react-router'
import { SiteLayout } from '@/components/layout'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <SiteLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-2 text-muted-foreground">Add your terms of service content here.</p>
    </SiteLayout>
  )
}
