import { useState } from 'react'
import { Toaster } from '@mcp-elements/react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { FeaturesSection } from './components/FeaturesSection'
import { ComponentShowcase } from './components/ComponentShowcase'
import { ArchitectureSection } from './components/ArchitectureSection'
import { CliDemo } from './components/CliDemo'
import { ThemeShowcase } from './components/ThemeShowcase'
import { Footer } from './components/Footer'

type Theme = 'light' | 'dark' | 'glass'

export function App() {
  const [theme, setTheme] = useState<Theme>('dark')

  useState(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  })

  const switchTheme = (t: Theme) => {
    setTheme(t)
    if (t === 'light') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', t)
    }
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground antialiased"
      style={theme === 'glass' ? {
        backgroundImage: 'linear-gradient(135deg, oklch(0.4 0.15 280), oklch(0.3 0.2 200), oklch(0.4 0.18 330))',
      } : undefined}
    >
      <Navbar theme={theme} onThemeChange={switchTheme} />

      <Hero />

      <FeaturesSection />

      <ComponentShowcase />

      <ArchitectureSection />

      <CliDemo />

      <ThemeShowcase />

      <Footer />

      <Toaster />
    </div>
  )
}
