import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import { APIDemo } from '@/components/landing/demo'
import { Hero } from '@/components/landing/hero'
import { Navigation } from '@/components/landing/navigation'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-8">
          <Hero projectName="Hello World" />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center">Test</CardTitle>
              <CardDescription className="text-center">
                Verify your backend and database are working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APIDemo />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
