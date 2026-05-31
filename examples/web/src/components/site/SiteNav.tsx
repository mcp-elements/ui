import Link from 'next/link'
import { Star, Menu } from 'lucide-react'
import { getGitHubStars } from '@/lib/github'
import { ThemeToggle } from './ThemeToggle'
import { ScrollObserver } from './ScrollObserver'
import { Logo } from './Logo'

const NAV_LINKS = [
  { href: '/components', label: 'Components' },
  { href: '/mcp', label: 'MCP' },
  { href: '/playground', label: 'Playground' },
  { href: '/themes', label: 'Themes' },
]

export async function SiteNav() {
  const stars = await getGitHubStars('mcp-elements/ui')

  return (
    <header className="site-nav">
      <ScrollObserver />
      <div className="site-container flex h-14 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-sm font-semibold site-text transition-opacity hover:opacity-90"
          aria-label="mcp-elements home"
        >
          <Logo size={28} />
          <span>mcp-elements</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-link text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span
            className="hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-mono"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text-subtle)',
            }}
          >
            v0.1
          </span>

          <a
            href="https://github.com/mcp-elements/ui"
            target="_blank"
            rel="noopener noreferrer"
            className="site-btn site-btn-secondary hidden md:inline-flex h-8 gap-1.5 px-3 text-xs"
          >
            <Star className="h-3.5 w-3.5" style={{ color: 'var(--site-warning)' }} aria-hidden />
            <span>{stars > 0 ? (stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars) : 'Star'}</span>
          </a>

          <ThemeToggle />

          <button
            className="md:hidden rounded-md p-2 site-link"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
