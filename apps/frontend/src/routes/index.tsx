import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { BackendTest } from '@/components/backend-test'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Starter App</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-3">
              Welcome to Starter App
            </h2>
            <p className="text-lg text-muted-foreground">
              A full stack app built with React 19+, TanStack Router, and Cloudflare
            </p>
          </div>

          <Card className="p-6">
              <BackendTest />
            </Card>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Starter App
        </div>
      </footer>
    </div>
  )
}
