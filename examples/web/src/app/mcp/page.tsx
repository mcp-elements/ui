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
    description: 'McpAppFrame sandboxes the iframe and brokers postMessage according to the MCP Apps spec.',
    components: [
      { name: 'McpAppFrame', slug: 'mcp-app-frame' },
    ],
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
    <div className="pb-24 pt-20">
      {/* Hero */}
      <div className="site-container mb-24">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-accent)' }}>
            MCP UI Kit · 7 components
          </p>
          <h1
            className="text-4xl font-bold sm:text-5xl"
            style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}
          >
            Every part of an MCP client,{' '}
            <span style={{ color: 'var(--site-accent)' }}>already built.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
            From the moment a server connects to the moment a tool finishes running — the screens, buttons, and dialogs your users see are all here, ready to drop in.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--site-text)', color: 'var(--site-bg)' }}
            >
              Browse components
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{ border: '1px solid var(--site-border)', color: 'var(--site-text)' }}
            >
              Try the playground
            </Link>
          </div>
        </div>
      </div>

      {/* Protocol flow */}
      <div className="site-container mb-24">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
            The flow
          </p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Every step in the MCP lifecycle has a component.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2"
          style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
          {PROTOCOL_STEPS.map(({ icon: Icon, title, summary, description, components }, i) => (
            <div key={title} className="p-7" style={{ background: 'var(--site-bg-elevated)' }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--site-accent)' }} />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--site-text)' }}>
                {title} <span style={{ color: 'var(--site-text-muted)' }}>— {summary}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
                {description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {components.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/components/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors"
                    style={{
                      background: 'var(--site-bg)',
                      border: '1px solid var(--site-border)',
                      color: 'var(--site-text)',
                    }}
                  >
                    {c.name}
                    <ArrowUpRight className="h-3 w-3" style={{ color: 'var(--site-text-subtle)' }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component grid */}
      <div className="site-container mb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            All 7 MCP components
          </h2>
          <Link
            href="/components"
            className="hidden text-sm font-medium sm:inline-flex items-center gap-1.5"
            style={{ color: 'var(--site-accent)' }}
          >
            See all 38 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
          {MCP_COMPONENTS.map((c) => (
            <Link
              key={c.slug}
              href={`/components/${c.slug}`}
              className="group p-5 transition-colors hover:opacity-95"
              style={{ background: 'var(--site-bg-elevated)' }}
            >
              <div className="mb-2 flex items-center justify-between">
                <code
                  className="font-mono text-sm font-semibold"
                  style={{ color: 'var(--site-text)' }}
                >
                  {c.name}
                </code>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--site-text-subtle)' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="site-container">
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
            Quick start
          </p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Three components, one full MCP flow.
          </h2>
        </div>
        <CodeBlock code={QUICK_START} lang="tsx" />
      </div>
    </div>
  )
}
