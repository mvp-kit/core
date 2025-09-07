# Starter App

A full stack application built with React 19+, TanStack Router, tRPC, and Cloudflare Workers.

## 🚀 Quick Start

### Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up Cloudflare resources (optional for remote bindings):**
   ```bash
   # Create D1 database
   npx wrangler d1 create starter-db

   # Create KV namespace
   npx wrangler kv:namespace create "KV"

   # Create R2 bucket
   npx wrangler r2 bucket create starter-bucket
   ```

3. **Start development with remote bindings:**
   ```bash
   pnpm dev:remote
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend (with remote bindings)
   cd apps/backend && pnpm dev

   # Terminal 2 - Frontend
   cd apps/frontend && pnpm dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8787

#### Development Modes

- **`pnpm dev:remote`** - Uses remote bindings (connects to real Cloudflare resources)
- **`pnpm dev:full`** - Same as above (alias for consistency)
- **`pnpm --filter @starter/backend dev:local`** - Uses local simulations only

### API Proxy Setup

The frontend Vite server automatically proxies API calls to the backend:

- **tRPC calls** (`/trpc/*`) → `http://localhost:8787/trpc`
- **WebSocket support** enabled for real-time features
- **CORS handling** managed automatically
- **Error logging** for debugging proxy issues

This means your TanStack Query and tRPC calls work transparently during development without any additional configuration!

### Testing Backend Connection

1. Start both services using `pnpm dev:full`
2. Open http://localhost:3000 in your browser
3. Look for the "Backend Connection Test" section
4. Click the test buttons to verify the connection:
   - **Test Hello Endpoint** - Tests basic tRPC communication
   - **Test Get User Endpoint** - Tests user data retrieval

## 🧪 Remote Testing with Cloudflare

Test your full stack against real Cloudflare resources instead of local development.

### Prerequisites

1. **Cloudflare Account:** Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI:** Install and authenticate
   ```bash
   npm install -g wrangler
   wrangler auth login
   ```

### Quick Setup (Automated)

Run the automated setup script:
```bash
./setup-remote.sh
```

This will:
- ✅ Create D1 database (`starter-db`)
- ✅ Create R2 bucket (`starter-bucket`)
- ✅ Deploy your Worker
- ✅ Build the frontend

### Manual Setup

If you prefer to set up manually:

1. **Create D1 Database:**
   ```bash
   wrangler d1 create starter-db
   ```
   Copy the `database_id` and update `apps/backend/wrangler.toml`

2. **Create R2 Bucket:**
   ```bash
   wrangler r2 bucket create starter-bucket
   ```

3. **Deploy Backend:**
   ```bash
   cd apps/backend
   wrangler deploy
   ```
   Note the deployed Worker URL

4. **Update Frontend:**
   - Edit `apps/frontend/src/lib/trpc-client.tsx`
   - Change `BACKEND_URL` to your deployed Worker URL
   - Example: `https://starter-backend.your-subdomain.workers.dev`

5. **Build Frontend:**
   ```bash
   cd apps/frontend
   pnpm build
   ```

### Testing Remote Connection

1. **Deploy and Update URLs:**
   ```bash
   # Deploy backend
   cd apps/backend && wrangler deploy

   # Update frontend with deployed URL
   # Edit apps/frontend/src/lib/trpc-client.tsx

   # Build frontend
   cd apps/frontend && pnpm build
   ```

2. **Test the Connection:**
   - Open your built frontend
   - Use the "Backend Connection Test" section
   - Test both endpoints with real Cloudflare resources

## 🏗️ Architecture

- **Frontend:** React 19+ with TanStack Router and Tailwind CSS v4
- **Backend:** tRPC over Hono on Cloudflare Workers
- **Database:** Cloudflare D1 with Prisma
- **Storage:** Cloudflare KV, R2, and Durable Objects
- **Auth:** BetterAuth
- **Build:** Turborepo with pnpm workspaces

## 🎨 Styling

This project uses **Tailwind CSS v4** with the following setup:

- **PostCSS Plugin:** `@tailwindcss/postcss` (required for v4)
- **CSS Variables:** Custom design tokens for theming
- **shadcn/ui:** Pre-built components with consistent styling
- **Dark Mode:** Class-based dark mode support

### Tailwind CSS v4 Features

- ✅ **CSS-first configuration** (no JavaScript config needed)
- ✅ **Native CSS variables** support
- ✅ **Better performance** with improved tree-shaking
- ✅ **Modern CSS features** support

## 🔗 Remote Bindings

This project uses **Cloudflare Remote Bindings** for development, which means:

- ✅ **Worker code runs locally** (fast development iteration)
- ✅ **Resources connect to real Cloudflare services** (accurate testing)
- ✅ **No data synchronization issues** between local and production
- ✅ **Test with real D1, KV, R2 data**

### Configured Remote Bindings

- **D1 Database:** `starter-db` (set `database_id` in wrangler.toml)
- **KV Namespace:** `KV` (set `id` and `preview_id` in wrangler.toml)
- **R2 Bucket:** `starter-bucket` (set `bucket_name` in wrangler.toml)

### Setup Instructions

1. **Create Cloudflare resources:**
   ```bash
   # D1 Database
   npx wrangler d1 create starter-db

   # KV Namespace
   npx wrangler kv:namespace create "KV"

   # R2 Bucket
   npx wrangler r2 bucket create starter-bucket
   ```

2. **Update wrangler.toml with resource IDs:**
   ```toml
   [[d1_databases]]
   database_id = "your-actual-database-id"

   [[kv_namespaces]]
   id = "your-kv-namespace-id"
   preview_id = "your-preview-kv-namespace-id"

   [[r2_buckets]]
   bucket_name = "your-actual-bucket-name"
   ```

3. **Start development:**
   ```bash
   pnpm dev:remote  # Uses remote bindings
   ```

### Benefits

- **Real Data Testing:** Test with actual production data
- **Accurate Performance:** Real network latency and performance
- **No Sync Issues:** No need to sync local vs remote data
- **Production Parity:** Closer to production behavior

## 📦 Available Scripts

- `pnpm build` - Build all packages
- `pnpm dev:remote` - Start development with remote bindings (recommended)
- `pnpm dev:full` - Same as dev:remote (alias)
- `pnpm lint` - Run linting
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm deploy` - Deploy to Cloudflare

### Backend Scripts

- `pnpm --filter @starter/backend dev` - Start backend with remote bindings
- `pnpm --filter @starter/backend dev:local` - Start backend with local simulations only
- `pnpm --filter @starter/backend build:validate` - Validate deployment with wrangler dry-run

## 🔧 Development

### Development Workflow

1. **Start both services:**
   ```bash
   pnpm dev:remote
   ```

2. **Frontend HMR:** Make changes to React components - they hot-reload instantly
3. **Backend changes:** tRPC API calls automatically proxy to wrangler dev
4. **Test with real data:** Remote bindings connect to actual Cloudflare resources

### Adding New Features

1. **Backend API:** Add procedures to `apps/backend/src/routes/index.ts`
2. **Frontend Components:** Add components to `apps/frontend/src/components/`
3. **Routes:** Add routes to `apps/frontend/src/routes/`
4. **Types:** Shared types go in `packages/types/`

### API Communication

- **tRPC calls** are automatically proxied from frontend to backend
- **No CORS issues** during development
- **WebSocket support** for real-time features
- **Error handling** with detailed logging

### Testing

- **Unit Tests:** Add to respective package's test directories
- **Integration Tests:** Test full stack communication via the test buttons
- **E2E Tests:** Use Playwright or similar for end-to-end testing

### Troubleshooting

#### Build Issues

**Tailwind CSS v4 PostCSS Error:**
```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**Solution:**
- ✅ Install `@tailwindcss/postcss`
- ✅ Update `postcss.config.js` to use `'@tailwindcss/postcss': {}`
- ✅ Update `tailwind.config.js` for v4 syntax
- ✅ Use `var(--variable)` instead of `hsl(var(--variable))`

#### API Connection Issues

If tRPC calls aren't working:

1. **Check backend is running:**
   ```bash
   curl http://localhost:8787/trpc/hello
   ```

2. **Check proxy in browser dev tools:**
   - Network tab for failed requests
   - Console for proxy error messages

3. **Verify ports:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8787

#### Common Issues

- **CORS errors:** Proxy handles CORS automatically
- **Connection refused:** Ensure backend is running with `pnpm dev:remote`
- **WebSocket issues:** Check if backend supports WebSocket connections
- **CSS not loading:** Check Tailwind CSS v4 PostCSS configuration

## 🚀 Deployment

1. **Build for production:**
   ```bash
   pnpm build
   ```

2. **Deploy to Cloudflare:**
   ```bash
   pnpm deploy
   ```

Make sure to configure your Cloudflare account and resources before deploying.

## 📚 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [tRPC Documentation](https://trpc.io/)
- [TanStack Router](https://tanstack.com/router/)