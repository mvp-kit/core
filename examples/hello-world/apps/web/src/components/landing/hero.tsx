import { Badge, Button } from '@repo/ui'
import { BookOpen, Check, ExternalLink, Github } from 'lucide-react'

interface HeroProps {
  projectName: string
}

export function Hero({ projectName }: HeroProps) {
  return (
    <div className="text-center space-y-6">
      <Badge className="mb-4">
        <Check className="w-4 h-4 mr-2" />
        {projectName}
      </Badge>
      <h1 className="text-3xl font-bold mb-2">Hello World!</h1>
      <p className="text-muted-foreground">Your full-stack is running. Test it below.</p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Button className="w-full justify-center" asChild>
          <a href="https://docs.mvpkit.dev" target="_blank" rel="noopener noreferrer">
            <BookOpen className="w-4 h-4 mr-2" />
            Documentation
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>

        <Button variant="outline" className="w-full justify-center" asChild>
          <a href="https://github.com/mvpkit/core" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2" />
            GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  )
}
