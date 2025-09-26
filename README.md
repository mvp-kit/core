# MVPKit Core

A production-ready Cloudflare-native starter template for building modern web applications.

Create your next project with MVPKit Core and get a fully-featured, type-safe application in minutes.

## Quick Start

### Create a New Project

```bash
# Create a new project using MVPKit Core
npx create-mvpkit@latest my-project

# Or with other package managers
pnpm create mvpkit my-project
yarn create mvpkit my-project
bun create mvpkit my-project
```

### Development Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/app/.env.example apps/app/.env.local
cp services/api/.dev.vars.example services/api/.dev.vars

# Set up database (if using database features)
cd services/api
pnpm db:migrate:local
pnpm db:seed:local

# Start development servers
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your application!

## Template Structure

This template includes:

- `apps/app/` - React application with Vite
- `services/api/` - Cloudflare Workers API with Hono
- `packages/types/` - Shared API types
- `packages/config/` - Shared configuration
- `packages/ui/` - Shared UI components
- `examples/` - Example implementations
- `*.template` - Template files for project generation

## Features

- 🚀 **Cloudflare Stack**: Workers, Pages, D1, KV, R2
- ⚡ **Modern Frontend**: React 19, TanStack Router & Query
- 🎨 **Styling**: Tailwind CSS v4 + shadcn/ui components
- 🔐 **Authentication**: Better Auth with social providers
- 🗄️ **Database**: D1 with Drizzle ORM
- 📡 **Type-Safe APIs**: tRPC for end-to-end type safety
- 🏗️ **Monorepo**: Turbo for fast builds and caching
- 📝 **Template System**: Handlebars-based project generation

## Development Commands

```bash
pnpm dev          # Start development servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm test         # Run tests
```

## Template Development

### Working with Templates

Template files use Handlebars syntax and are processed during project creation:

```bash
# Files with .template extension are processed
package.json.template -> package.json
tsconfig.json.template -> tsconfig.json
```

### Template Variables

Common template variables:
- `{{projectName}}` - Project name
- `{{projectDescription}}` - Project description
- `{{packageManager}}` - Package manager (npm/pnpm/yarn/bun)
- `{{packageManagerVersion}}` - Package manager version

### Testing Templates

```bash
# Test template generation locally
cd examples/hello-world
pnpm install
pnpm dev
```

## Examples

- `examples/hello-world/` - Complete example project
- See [MVPKit Examples](https://github.com/mvp-kit/core/examples) for more

## Deployment

Generated projects can be deployed to Cloudflare:

```bash
# Deploy API to Cloudflare Workers
pnpm deploy:api

# Deploy app to Cloudflare Pages
pnpm deploy:app

# Deploy both
pnpm deploy:all
```

## Learn More

- [MVPKit Website](https://mvpkit.dev)
- [MVPKit Documentation](https://docs.mvpkit.dev)
- [Cloudflare Developer Platform](https://developers.cloudflare.com/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes with the example project
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.