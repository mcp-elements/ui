import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const SHOWCASE = [
  { name: 'McpToolCall', slug: 'mcp-tool-call', category: 'MCP' },
  { name: 'Button', slug: 'button', category: 'Form' },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', category: 'MCP' },
  { name: 'Input', slug: 'input', category: 'Form' },
  { name: 'Badge', slug: 'badge', category: 'Display' },
  { name: 'Card', slug: 'card', category: 'Display' },
  { name: 'Switch', slug: 'switch', category: 'Form' },
  { name: 'Progress', slug: 'progress', category: 'Display' },
  { name: 'ChatBubble', slug: 'chat-bubble', category: 'AI' },
  { name: 'Alert', slug: 'alert', category: 'Feedback' },
  { name: 'Tabs', slug: 'tabs', category: 'Navigation' },
  { name: 'McpServerStatus', slug: 'mcp-server-status', category: 'MCP' },
]

export function ComponentShowcase() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            38 components.{' '}
            <span style={{ color: 'var(--site-text-muted)' }}>Ready to copy.</span>
          </h2>
          <Link href="/components" className="hidden items-center gap-1.5 text-sm font-medium sm:flex"
            style={{ color: 'var(--site-accent)' }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SHOWCASE.map((c) => {
            const isMcp = c.category === 'MCP'
            return (
              <Link
                key={c.slug}
                href={`/${isMcp ? 'mcp' : 'components'}/${c.slug}`}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 transition-all duration-200"
                style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
              >
                <span
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: isMcp ? 'var(--site-accent-glow)' : 'var(--site-bg-subtle)',
                    color: isMcp ? 'var(--site-accent)' : 'var(--site-text-subtle)',
                  }}
                >
                  {c.category}
                </span>
                <div className="flex min-h-20 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--site-text-subtle)' }}>{c.name}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--site-text)' }}>{c.name}</p>
                <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ border: '1px solid var(--site-accent)' }} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
