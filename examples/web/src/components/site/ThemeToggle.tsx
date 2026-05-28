'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('mcp-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
    } else {
      // Ensure data-theme is always set so component tokens resolve correctly
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('mcp-theme', next)
    // Always set explicitly — never remove. Site tokens (--site-*) and
    // component tokens (--color-*) have inverse defaults, so missing
    // data-theme means they desync.
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md p-2 transition-colors duration-150 hover:opacity-80"
      style={{
        color: 'var(--site-text-muted)',
        border: '1px solid var(--site-border)',
        backgroundColor: 'transparent',
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
