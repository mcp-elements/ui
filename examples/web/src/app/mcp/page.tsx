import Link from 'next/link'
import { Plug, KeyRound, Zap, MonitorPlay, ArrowRight, ArrowUpRight } from 'lucide-react'
import { COMPONENTS } from '@/data/components'
import { CodeBlock } from '@/components/site/CodeBlock'

const MCP_COMPONENTS = COMPONENTS.filter((c) => c.isMcp)

const PROTOCOL_STEPS = [
  {
    icon: Plug,
    title: 'Connect',
    summary: 'Show users which servers are online.',
    description: 'McpServerStatus reflects live WebSocket state. McpResourceBrowser lists available tools and resources.',
    components: [
      { name: 'McpServerStatus', slug: 'mcp-server-status' },
      { name: 'McpResourceBrowser', slug: 'mcp-resource-browser' },
    ],
  },
  {
    icon: KeyRound,
    title: 'Authenticate',
    summary: 'Present OAuth scopes for approval.',
    description: 'McpConsentDialog renders the consent flow. McpScopeInspector explains each permission in plain English.',
    components: [
      { name: 'McpConsentDialog', slug: 'mcp-consent-dialog' },
      { name: 'McpScopeInspector', slug: 'mcp-scope-inspector' },
    ],
  },
  {
    icon: Zap,
    title: 'Execute',
    summary: 'Run tool calls with live state.',
    description: 'McpToolForm derives inputs from JSON Schema. McpToolCall animates idle → running → done/error with built-in retry.',
    components: [
      { name: 'McpToolForm', slug: 'mcp-tool-form' },
      { name: 'McpToolCall', slug: 'mcp-tool-call' },
    ],
  },
  {
    icon: MonitorPlay,
    title: 'Render',
    summary: 'Embed MCP Apps safely.',
    description: 'McpAppFrame renders MCP Apps (SEP-1865): sandboxed iframe, spec CSP, the ui/initialize handshake, and tool-call proxying over JSON-RPC.',
    components: [{ name: 'McpAppFrame', slug: 'mcp-app-frame' }],
  },
]

const QUICK_START = `import {
  McpServerStatus,
  McpToolCall,
  McpConsentDialog,
} from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

// 1. Show connection state
<McpServerStatus status="connected" serverName="github-mcp" />

// 2. Show OAuth consent
<McpConsentDialog
  open={showConsent}
  serverName="GitHub MCP"
  scopes={['repo:read', 'user.email:read']}
  onApprove={handleApprove}
  onDeny={handleDeny}
/>

// 3. Execute a tool
const toolState = createToolState()
toolState.start({ tool: 'search_repos', args: { query: 'mcp-elements' } })

<McpToolCall state={toolState} onRetry={() => toolState.reset()} />`

export default function McpPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="site-section">
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="site-eyebrow site-eyebrow-accent mb-3">MCP UI Kit · 7 components</p>
            <h1 className="site-h1" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)' }}>
              Every part of an MCP client,{' '}
              <span className="site-text-accent">already built.</span>
            </h1>
            <p className="site-lede mt-5">
              From the moment a server connects to the moment a tool finishes running — the screens, buttons, and dialogs your users see are all here, ready to drop in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/components" className="site-btn site-btn-primary">
                Browse components
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/playground" className="site-btn site-btn-secondary">
                Try the playground
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol flow */}
      <section className="site-section site-section-divider">
        <div className="site-container">
          <div className="mb-10 max-w-2xl">
            <p className="site-eyebrow mb-2">The flow</p>
            <h2 className="site-h2">Every step in the MCP lifecycle has a component.</h2>
          </div>

          <div className="site-mosaic sm:grid-cols-2">
            {PROTOCOL_STEPS.map(({ icon: Icon, title, summary, description, components }, i) => (
              <div key={title} className="p-7" style={{ background: 'var(--site-bg-elevated)' }}>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: 'var(--site-bg)',
                      border: '1px solid var(--site-border)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <Icon className="h-4 w-4 site-text-accent" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest site-text-subtle">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold site-text">
                  {title} <span className="site-text-muted font-normal">— {summary}</span>
                </h3>
                <p className="site-body-sm mt-2">{description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {components.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/components/${c.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs site-text transition-colors duration-150 hover:bg-[var(--site-bg-subtle)]"
                      style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
                    >
                      {c.name}
                      <ArrowUpRight className="h-3 w-3 site-text-subtle" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component grid */}
      <section className="site-section site-section-divider">
        <div className="site-container">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="site-eyebrow mb-2">The set</p>
              <h2 className="site-h2">All 7 MCP components</h2>
            </div>
            <Link
              href="/components"
              className="site-link-accent hidden text-sm font-medium sm:inline-flex items-center gap-1.5"
            >
              See all 38 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="site-mosaic sm:grid-cols-2 lg:grid-cols-3">
            {MCP_COMPONENTS.map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="group relative p-5 transition-colors duration-150"
                style={{ background: 'var(--site-bg-elevated)' }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <code className="font-mono text-sm font-semibold site-text">{c.name}</code>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 site-text-subtle"
                  />
                </div>
                <p className="site-body-sm text-xs">{c.description}</p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  style={{ boxShadow: 'inset 0 0 0 1px var(--site-border-strong)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="site-section site-section-divider">
        <div className="site-container">
          <div className="mb-6 max-w-2xl">
            <p className="site-eyebrow mb-2">Quick start</p>
            <h2 className="site-h2">Three components, one full MCP flow.</h2>
          </div>
          <CodeBlock code={QUICK_START} lang="tsx" filename="mcp-quick-start.tsx" />
        </div>
      </section>
    </div>
  )
}
