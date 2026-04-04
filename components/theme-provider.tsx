'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('fintrack-theme') as Theme
    if (saved) {
      setThemeState(saved)
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    let resolved: 'light' | 'dark'
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = theme
    }
    
    setResolvedTheme(resolved)
    root.classList.add(resolved)
    localStorage.setItem('fintrack-theme', theme)
  }, [theme, mounted])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      if (prev === 'system') {
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return systemIsDark ? 'light' : 'dark'
      }
      return prev === 'dark' ? 'light' : 'dark'
    })
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => React.useContext(ThemeContext)
