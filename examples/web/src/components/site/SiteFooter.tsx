import Link from 'next/link'

const FOOTER_COLS = [
  {
    label: 'Documentation',
    links: [
      { href: '/components', label: 'Components' },
      { href: '/mcp', label: 'MCP Primitives' },
      { href: '/playground', label: 'Playground' },
      { href: '/themes', label: 'Themes' },
    ],
  },
  {
    label: 'Community',
    links: [
      { href: 'https://github.com/mcp-elements/mcp-elements', label: 'GitHub', external: true },
      { href: 'https://github.com/mcp-elements/mcp-elements/issues', label: 'Issues', external: true },
      { href: 'https://github.com/mcp-elements/mcp-elements/discussions', label: 'Discussions', external: true },
    ],
  },
  {
    label: 'Frameworks',
    links: [
      { href: '/components?framework=react', label: 'React' },
      { href: '/components?framework=angular', label: 'Angular' },
      { href: '/components?framework=vue', label: 'Vue' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer
      className="w-full mt-24"
      style={{ borderTop: '1px solid var(--site-border)', backgroundColor: 'var(--site-bg)' }}
    >
      <div className="site-container py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo col */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-mono text-sm font-semibold" style={{ color: 'var(--site-text)' }}>
              <span style={{ color: 'var(--site-accent)' }}>●</span> mcp-elements
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              The UI kit for MCP applications. Copy-paste into any framework.
            </p>
            <span
              className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-mono"
              style={{
                backgroundColor: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text-subtle)',
              }}
            >
              MIT License
            </span>
          </div>

          {/* Link cols */}
          {FOOTER_COLS.map((col) => (
            <div key={col.label} className="flex flex-col gap-3">
              <p
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--site-text-subtle)' }}
              >
                {col.label}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
                        style={{ color: 'var(--site-text-muted)' }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
                        style={{ color: 'var(--site-text-muted)' }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-center text-xs sm:flex-row"
          style={{ borderColor: 'var(--site-border)', color: 'var(--site-text-subtle)' }}
        >
          <p>© 2026 mcp-elements · MIT License</p>
          <p>
            Built by{' '}
            <a
              href="https://github.com/mayurrawte"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-[var(--site-text)]"
            >
              Mayur Rawte
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
