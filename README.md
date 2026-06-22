# MVPKit Core

An opinionated TypeScript monorepo for building on [Cloudflare](https://www.cloudflare.com).

Core is for developers who want a practical full-stack starting point:

- [Bun](https://bun.sh) workspaces with [Turbo](https://turbo.build)
- [React](https://react.dev) + [Vite](https://vite.dev) public web app
- [React](https://react.dev) + [Vite](https://vite.dev) authenticated app shell
- [Hono](https://hono.dev) + [tRPC](https://trpc.io) [Cloudflare Workers](https://developers.cloudflare.com/workers/) API
- [Better Auth](https://www.better-auth.com) email/password sessions
- [Drizzle](https://orm.drizzle.team) schema for [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/) and [Cloudflare R2](https://developers.cloudflare.com/r2/) bindings wired in
- Shared UI, config, utilities, and API types
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Cloudflare Pages](https://developers.cloudflare.com/pages/) deploy scripts

## Why Cloudflare

- The [Cloudflare free plan](https://www.cloudflare.com/plans/free/) is enough to start most small apps.
- [Workers](https://developers.cloudflare.com/workers/), [Pages](https://developers.cloudflare.com/pages/), [D1](https://developers.cloudflare.com/d1/), [KV](https://developers.cloudflare.com/kv/), and [R2](https://developers.cloudflare.com/r2/) keep early infrastructure costs low.
- The stack scales without needing to move to a traditional cloud.

## Try It

```bash
bun create @mvp-kit my-app --template core
cd my-app
bun install
bun run dev
```

Local services:

- Web: http://localhost:3001
- App: http://localhost:3002
- API: http://localhost:3011

## Layout

- `apps/web`: public marketing site
- `apps/app`: authenticated product app
- `services/api`: [Cloudflare Workers](https://developers.cloudflare.com/workers/) API
- `packages/types`: shared [tRPC](https://trpc.io) router contracts
- `packages/ui`: shared UI primitives
- `packages/config`: shared client/runtime config
- `packages/utils`: shared helpers
- `docs/llm`: context docs for coding agents

## Daily Commands

- `bun run dev`: start every workspace
- `bun run dev:web`: start only the marketing site
- `bun run dev:app`: start only the app
- `bun run dev:api`: start only the API
- `bun run check`: typecheck, lint, and build
- `bun run typecheck`: typecheck all workspaces
- `bun run lint`: run Biome checks
- `bun run build`: build every workspace

## Deploy

Create Cloudflare resources:

```bash
cd services/api
bun run setup:remote
```

Then update `services/api/wrangler.toml` with the generated D1 and KV IDs, and deploy:

```bash
bun run deploy
```

Focused deploys:

- `bun run deploy:api`
- `bun run deploy:web`
- `bun run deploy:app`

The generated production env files target the default `*.pages.dev` URLs so the first deploy is reachable without custom DNS. After your custom domain is live, update the app/web env files, add the custom origins to `TRUSTED_ORIGINS`, and set `COOKIE_DOMAIN` only if the web and app hosts share the same parent domain.
