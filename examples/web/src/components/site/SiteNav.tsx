import Link from 'next/link'
import { Star, Menu } from 'lucide-react'
import { getGitHubStars } from '@/lib/github'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '/components', label: 'Components' },
  { href: '/mcp', label: 'MCP' },
  { href: '/playground', label: 'Playground' },
  { href: '/themes', label: 'Themes' },
]

export async function SiteNav() {
  const stars = await getGitHubStars('mcp-elements/mcp-elements')

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        borderBottom: '1px solid var(--site-border)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'oklch(0.06 0.005 286 / 0.85)',
      }}
    >
      <div className="site-container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold"
          style={{ color: 'var(--site-text)' }}
        >
          <span style={{ color: 'var(--site-accent)' }}>●</span>
          <span>mcp-elements</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
              style={{ color: 'var(--site-text-muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span
            className="hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text-muted)',
            }}
          >
            v0.1
          </span>

          <a
            href="https://github.com/mcp-elements/mcp-elements"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text)',
            }}
          >
            <Star className="h-3.5 w-3.5" style={{ color: 'var(--site-warning)' }} />
            <span>{stars > 0 ? (stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars) : 'Star'}</span>
          </a>

          <ThemeToggle />

          <button
            className="md:hidden rounded-md p-2"
            style={{ color: 'var(--site-text-muted)' }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
