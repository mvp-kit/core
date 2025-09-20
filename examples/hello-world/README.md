# Hello World

A new MVPKit Core application: Hello World

Built with [MVPKit Core](https://mvpkit.dev) - A production-ready Cloudflare-native starter.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.dev.vars.example apps/backend/.dev.vars

# Set up database (if not done during project creation)
# cd apps/backend
# pnpm db:migrate:local
# pnpm db:seed:local

# Start development servers
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your application!

## Project Structure

- `apps/frontend/` - React application with Vite
- `apps/backend/` - Cloudflare Workers API with Hono
- `packages/api/` - Shared API types
- `packages/config/` - Shared configuration

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
# Deploy backend to Cloudflare Workers
pnpm deploy:backend

# Deploy frontend to Cloudflare Pages
pnpm deploy:frontend

# Deploy both
pnpm deploy:apps
```

## Learn More

- [MVPKit Website](https://mvpkit.dev)
- [MVPKit Documentation](https://docs.mvpkit.dev)
- [MVPKit Examples](https://github.com/mvp-kit/core/examples)
