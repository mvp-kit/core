/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
  // Environment variables for ClientConfig
  readonly NODE_ENV?: string
  readonly PROJECT_NAME?: string
  readonly DOMAIN?: string
  readonly FRONTEND_PORT?: string
  readonly API_URL?: string
  readonly ALLOWED_HOSTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}