import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const MCP_COMPONENTS = [
  { name: 'McpToolCall', slug: 'mcp-tool-call', status: 'stable', description: 'Tool execution card: idle → running → done/error with retry' },
  { name: 'McpToolForm', slug: 'mcp-tool-form', status: 'stable', description: 'JSON Schema → dynamic form with validation' },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', status: 'stable', description: 'OAuth consent UI: scope list, approve/deny' },
  { name: 'McpScopeInspector', slug: 'mcp-scope-inspector', status: 'stable', description: 'Expandable scope tree with human-readable descriptions' },
  { name: 'McpResourceBrowser', slug: 'mcp-resource-browser', status: 'stable', description: 'Browse MCP resources with type icons and preview' },
  { name: 'McpServerStatus', slug: 'mcp-server-status', status: 'stable', description: 'Connection badge: connected/disconnected/error/reconnecting' },
  { name: 'McpAppFrame', slug: 'mcp-app-frame', status: 'stable', description: 'MCP Apps (SEP-1865) host renderer: sandboxed iframe + JSON-RPC bridge' },
]

export function McpSection() {
  return (
    <section className="py-24"
      style={{ borderTop: '1px solid var(--site-accent)', backgroundColor: 'var(--site-bg)' }}>
      <div className="site-container">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: 'var(--site-accent-glow)', border: '1px solid var(--site-accent)', color: 'var(--site-accent)' }}>
            MCP Primitives
          </span>
        </div>
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
              The primitives MCP was missing.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              Every MCP application needs server consent, tool call UI, and scope inspection.
              Nobody ships them as copy-paste primitives. Until now.
            </p>
          </div>
          <Link href="/mcp" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
            style={{ color: 'var(--site-accent)' }}>
            Explore MCP components <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MCP_COMPONENTS.map((c) => (
            <Link key={c.slug} href={`/mcp/${c.slug}`}
              className="group flex flex-col gap-3 rounded-xl p-5 transition-all duration-200"
              style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--site-text)' }}>{c.name}</span>
                <span className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: c.status === 'stable' ? 'oklch(0.72 0.17 145 / 0.15)' : 'oklch(0.82 0.18 85 / 0.15)',
                    color: c.status === 'stable' ? 'var(--site-success)' : 'var(--site-warning)',
                  }}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{c.description}</p>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: 'var(--site-accent)' }}>
                Docs <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
