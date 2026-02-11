/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOMAIN?: string
  readonly VITE_APP_DOMAIN?: string
  readonly VITE_API_URL?: string
  readonly VITE_APP_URL?: string
  readonly VITE_PROJECT_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
