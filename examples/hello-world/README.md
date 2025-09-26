# Hello World

A new MVPKit Core application: Hello World

Built with [MVPKit Core](https://mvpkit.dev) - A production-ready Cloudflare-native starter.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/app/.env.example apps/app/.env.local
cp services/api/.dev.vars.example services/api/.dev.vars

# Set up database (if not done during project creation)
# cd services/api
# pnpm db:migrate:local
# pnpm db:seed:local

# Start development servers
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your application!

## Project Structure

- `apps/app/` - React application with Vite
- `services/api/` - Cloudflare Workers API with Hono
- `packages/types/` - Shared API types
- `packages/config/` - Shared configuration
- `packages/ui/` - Shared UI components

## Features

- 🚀 **Cloudflare Stack**: Workers, Pages, D1, KV, R2
- ⚡ **Modern Frontend**: React 19, TanStack Router & Query
- 🎨 **Styling**: Tailwind CSS v4 + shadcn/ui components
- 🔐 **Authentication**: Better Auth with social providers
- 🗄️ **Database**: D1 with Drizzle ORM
- 📡 **Type-Safe APIs**: tRPC for end-to-end type safety
- 🏗️ **Monorepo**: Turbo for fast builds and caching

## Development Commands

```bash
pnpm dev          # Start development servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm test         # Run tests
```

## Deployment

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
- [MVPKit Examples](https://github.com/mvp-kit/core/examples)
