# Hello World

A generated MVPKit Core project aligned with the current Core subset architecture.

## Quick Start

```bash
# pnpm
pnpm install
pnpm dev

# bun
bun install
bun run dev
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
# pnpm
pnpm typecheck
pnpm build
pnpm lint

# bun
bun run typecheck
bun run build
bun run lint
```

## LLM Documentation Strategy

Generated LLM support files are treated as source-controlled artifacts and are enforced in validation:

- `docs/llm/context-map.md.template`
- `docs/llm/change-playbooks.md.template`
- `examples/hello-world/docs/llm/context-map.md`
- `examples/hello-world/docs/llm/change-playbooks.md`

Generation and drift checks:

```bash
# write template docs from code/contracts
node docs/scripts/context-sync.mjs --mode write-template

# write example docs from code/contracts
node docs/scripts/context-sync.mjs --mode write-example

# strict drift + contract check (template + example)
node docs/scripts/context-sync.mjs --mode check
```
