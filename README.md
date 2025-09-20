# MVPKit - Core

Production-ready React TypeScript starter kit with edge computing.

## 🚀 Quick Start

### Option 1: Use the CLI (Recommended)

Create a new project using the MVPKit CLI:

```bash
# Create a new MVPKit application
npx @mvp-kit/create my-app

# Or with pnpm (recommended)
pnpm create @mvp-kit my-app

# Or with bun
bun create @mvp-kit my-app
```

The CLI will automatically:
- Set up the project structure
- Install dependencies with your preferred package manager
- Configure environment files
- Initialize git repository
- Optionally set up and seed the database

### Option 2: Clone and Set Up Manually

If you prefer to clone this repository directly:

#### Prerequisites

- **Node.js** 20+
- **pnpm** 8+ or **bun** 1.0+ (recommended)
- **Cloudflare Account** (free tier available)

#### 1. Important: Template Structure

**Note**: This repository contains template files with `.template` and `.tpl` extensions. These are not meant to be used directly but are processed by the MVPKit CLI to generate actual project files.

The CLI automatically:
- Processes template files (removes `.template`/`.tpl` extensions)
- Transforms variables (e.g., `{{projectName}}` → your project name)
- Removes workspace configurations to prevent nested workspace conflicts
- Generates proper package.json files with correct naming

#### 2. Install Dependencies

```bash
# With pnpm (recommended)
pnpm install

# Or with bun
bun install
```

### 3. Environment Setup

```bash
# Copy environment templates
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.dev.vars.example apps/backend/.dev.vars

# Configure your environment variables
```

#### 4. Database Setup

```bash
# Create local D1 database
cd apps/backend

# With pnpm
pnpm db:create
pnpm db:migrate

# Or with bun
bun db:create
bun db:migrate
```

#### 5. Start Development

```bash
# Start both frontend and backend
pnpm dev  # or bun dev

# Or start individually
pnpm dev:frontend  # Frontend only (or bun dev:frontend)
pnpm dev:backend   # Backend only (or bun dev:backend)
```

Visit [http://localhost:5173](http://localhost:5173) to see your application!

#### 6. Deploy to Production

```bash
# Deploy backend to Cloudflare Workers
pnpm deploy:backend  # or bun deploy:backend

# Deploy frontend to Cloudflare Pages
pnpm deploy:frontend  # or bun deploy:frontend

# Or deploy everything
pnpm deploy  # or bun deploy
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Powerful data synchronization
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Vite** - Lightning-fast development

### Backend
- **Cloudflare Workers** - Edge runtime environment
- **Hono** - Ultra-fast web framework
- **tRPC** - End-to-end type safety
- **Better Auth** - Modern authentication
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Runtime type validation

### Infrastructure
- **Cloudflare D1** - Distributed SQLite database
- **Cloudflare KV** - Global key-value storage
- **Cloudflare R2** - Object storage (S3-compatible)
- **Cloudflare Pages** - Static site hosting

### Development
- **Turbo** - High-performance monorepo build system
- **pnpm/bun** - Fast, efficient package managers
- **TypeScript** - Static type checking
- **Biome** - Fast formatter and linter

## 📁 Project Structure

```
{{projectKebabCase}}/
├── apps/
│   ├── frontend/           # React application
│   │   ├── src/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── routes/     # File-based routing
│   │   │   └── lib/        # Utilities and config
│   │   └── package.json
│   └── backend/            # Cloudflare Workers API
│       ├── src/
│       │   ├── routes/     # tRPC API routes
│       │   └── lib/        # Database, auth, utilities
│       └── wrangler.toml   # Cloudflare configuration
├── packages/
│   ├── api/                # Shared API types
│   └── config/             # Shared configuration
└── package.json            # Root configuration
```

## 🌟 Features

### 🔥 Edge-Native Performance
- **Global CDN**: Sub-100ms response times worldwide via Cloudflare Pages
- **Zero Cold Starts**: Instant scaling with Cloudflare Workers
- **Edge Computing**: Process requests close to your users

### 🛡️ Security First
- **Built-in Authentication**: Production-ready auth with Better Auth
- **Type-safe APIs**: End-to-end type safety with tRPC
- **Input Validation**: Runtime validation with Zod schemas
- **CORS & Rate Limiting**: Configurable security middleware

### 🏗️ Modern Architecture
- **Monorepo Structure**: Clean separation with workspaces (pnpm/bun)
- **TypeScript Everywhere**: Full type safety across the stack
- **Database Included**: SQLite-compatible D1 with Drizzle ORM
- **File Storage**: Integrated R2 object storage (S3-compatible)

### 🎨 Developer Experience
- **Hot Reload**: Instant feedback during development
- **Code Quality**: Biome for linting and formatting
- **Testing Ready**: Framework setup for unit and integration tests
- **Type Safety**: End-to-end TypeScript coverage

---

**Built with ❤️ using [MVPKit](https://mvpkit.dev)**