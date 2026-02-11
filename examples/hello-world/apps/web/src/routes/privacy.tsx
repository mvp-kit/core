import { createFileRoute } from '@tanstack/react-router'
import { SiteLayout } from '@/components/layout'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <SiteLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-2 text-muted-foreground">Add your privacy policy content here.</p>
    </SiteLayout>
  )
}
