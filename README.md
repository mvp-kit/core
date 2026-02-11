# Hello World

A generated MVPKit Core project aligned with the current Core subset architecture.

## Quick Start

```bash
pnpm install
pnpm dev
```

Local services:

- Marketing web: http://localhost:3001
- App dashboard: http://localhost:3002
- API worker: http://localhost:3011

## Project Structure

- `apps/app/` - Authenticated app surface
- `apps/web/` - Public marketing surface
- `services/api/` - Cloudflare Worker API (Hono + tRPC)
- `packages/types/` - Shared API contracts
- `packages/ui/` - Shared UI primitives/components
- `packages/utils/` - Shared utility helpers

## Commands

```bash
pnpm typecheck
pnpm build
pnpm lint
```
