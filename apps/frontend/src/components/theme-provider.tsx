import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    applyTheme(stored)
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)

    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // Ignore localStorage errors
    }

    applyTheme(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
