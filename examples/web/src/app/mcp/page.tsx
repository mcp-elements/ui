import Link from 'next/link'
import { COMPONENTS } from '@/data/components'
import { CodeBlock } from '@/components/site/CodeBlock'

const MCP_COMPONENTS = COMPONENTS.filter((c) => c.isMcp)

const PROTOCOL_STEPS = [
  {
    icon: '🔌',
    title: 'Connect',
    description:
      'McpServerStatus shows live connection state. McpResourceBrowser lets users explore available tools and resources.',
    slug: 'mcp-server-status',
    component: 'McpServerStatus',
  },
  {
    icon: '🔐',
    title: 'Authenticate',
    description:
      'McpConsentDialog presents OAuth scopes for user approval. McpScopeInspector explains what each permission means.',
    slug: 'mcp-consent-dialog',
    component: 'McpConsentDialog',
  },
  {
    icon: '⚡',
    title: 'Execute',
    description:
      'McpToolForm renders JSON Schema inputs. McpToolCall shows real-time execution state: idle → running → done/error.',
    slug: 'mcp-tool-call',
    component: 'McpToolCall',
  },
  {
    icon: '🖼️',
    title: 'Render',
    description:
      'McpAppFrame sandboxes MCP App iframes with a bidirectional postMessage bridge following the MCP Apps spec.',
    slug: 'mcp-app-frame',
    component: 'McpAppFrame',
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
toolState.start('search_repos', { query: 'mcp-elements' })

<McpToolCall state={toolState} onRetry={() => toolState.reset()} />`

export default function McpPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <div className="site-container mb-20">
        <div className="max-w-3xl">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text-muted)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--site-accent)' }}
            />
            MCP UI Kit · 7 components · React · Angular · Vue
          </div>
          <h1
            className="text-4xl font-bold sm:text-5xl"
            style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}
          >
            The full UI stack
            <br />
            <span style={{ color: 'var(--site-accent)' }}>for MCP applications.</span>
          </h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--site-text-muted)' }}>
            Every component you need to build a first-class MCP client — from connection status to
            OAuth consent to tool execution.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/components"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--site-accent)' }}
            >
              Browse components
            </Link>
            <Link
              href="/playground"
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ border: '1px solid var(--site-border)', color: 'var(--site-text)' }}
            >
              Try playground →
            </Link>
          </div>
        </div>
      </div>

      {/* Protocol flow */}
      <div className="site-container mb-20">
        <h2
          className="mb-2 text-2xl font-bold"
          style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}
        >
          Built for the MCP protocol flow
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--site-text-muted)' }}>
          Components map directly to MCP lifecycle stages.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {PROTOCOL_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl p-5"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--site-text-muted)' }}>
                    Step {i + 1}
                  </p>
                  <h3 className="font-semibold" style={{ color: 'var(--site-text)' }}>
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
                {step.description}
              </p>
              <Link
                href={`/components/${step.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: 'var(--site-accent)' }}
              >
                <code>{step.component}</code> →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Component grid */}
      <div className="site-container mb-20">
        <h2
          className="mb-2 text-2xl font-bold"
          style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}
        >
          All 7 MCP components
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MCP_COMPONENTS.map((c) => (
            <Link
              key={c.slug}
              href={`/components/${c.slug}`}
              className="group rounded-xl p-4 transition-colors"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                <code
                  className="font-mono text-sm font-semibold"
                  style={{ color: 'var(--site-text)' }}
                >
                  {c.name}
                </code>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--site-accent)', color: '#fff' }}
                >
                  NEW
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="site-container mb-20">
        <h2
          className="mb-4 text-2xl font-bold"
          style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}
        >
          Quick start
        </h2>
        <CodeBlock code={QUICK_START} lang="tsx" />
      </div>
    </div>
  )
}
