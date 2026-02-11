import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useState } from 'react'
import {
  applyThemeToDocument,
  getInitialThemePreference,
  getSystemTheme,
  type ResolvedTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from './theme'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
)

type ThemeContextValue = {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type TrpcProviderProps<TClient> = {
  children: ReactNode
  client: TClient
  queryClient: QueryClient
}

type TrpcLike<TClient> = {
  Provider: (props: TrpcProviderProps<TClient>) => ReactNode
}

type CreateProvidersOptions<TClient> = {
  trpc: TrpcLike<TClient>
  createTrpcClient: () => TClient
  createQueryClient: () => QueryClient
  renderAfterChildren?: () => ReactNode
  enableDevtools?: boolean
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>(() => getInitialThemePreference())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme))

  useEffect(() => {
    const nextResolved = resolveTheme(theme)
    setResolvedTheme(nextResolved)
    applyThemeToDocument(nextResolved)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const nextResolved = getSystemTheme()
      setResolvedTheme(nextResolved)
      applyThemeToDocument(nextResolved)
    }

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within Providers')
  }

  return context
}

export function createProviders<TClient>(options: CreateProvidersOptions<TClient>) {
  return function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => options.createQueryClient())
    const [trpcClient] = useState(() => options.createTrpcClient())

    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <options.trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
            {options.renderAfterChildren?.()}
            {options.enableDevtools && (
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
              </Suspense>
            )}
          </options.trpc.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    )
  }
}
