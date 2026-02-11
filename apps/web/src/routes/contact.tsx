import { createFileRoute } from '@tanstack/react-router'
import { SiteLayout } from '@/components/layout'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <SiteLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-muted-foreground">Reach us at support@example.com</p>
    </SiteLayout>
  )
}
