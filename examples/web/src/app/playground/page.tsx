'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/site/CopyButton'

interface Example {
  id: string
  label: string
  description: string
  code: string
  lang: 'tsx' | 'ts'
}

const EXAMPLES: Example[] = [
  {
    id: 'server-status',
    label: 'Server Status',
    description: 'Show MCP server connection state',
    lang: 'tsx',
    code: `import { McpServerStatus } from '@mcp-elements/react'

export function ServerStatusExample() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <McpServerStatus status="connected" serverName="github-mcp" />
      <McpServerStatus status="connecting" serverName="linear-mcp" />
      <McpServerStatus status="disconnected" />
      <McpServerStatus status="error" serverName="jira-mcp" />
    </div>
  )
}`,
  },
  {
    id: 'tool-call',
    label: 'Tool Call',
    description: 'Display tool execution state machine',
    lang: 'tsx',
    code: `import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'
import { useState } from 'react'

export function ToolCallExample() {
  const [state] = useState(() => {
    const s = createToolState()
    s.start('search_repos', { query: 'mcp-elements', sort: 'stars' })
    return s
  })

  return (
    <div className="p-4">
      <McpToolCall state={state} onRetry={() => state.reset()} />
    </div>
  )
}`,
  },
  {
    id: 'tool-form',
    label: 'Tool Form',
    description: 'Render a form from JSON Schema',
    lang: 'tsx',
    code: `import { McpToolForm } from '@mcp-elements/react'

const SCHEMA = {
  type: 'object' as const,
  properties: {
    query: { type: 'string', title: 'Search query', minLength: 1 },
    language: {
      type: 'string',
      title: 'Language',
      enum: ['TypeScript', 'Python', 'Go', 'Rust'],
    },
    limit: { type: 'number', title: 'Max results', minimum: 1, maximum: 100, default: 10 },
  },
  required: ['query'],
}

export function ToolFormExample() {
  return (
    <div className="p-4 max-w-sm">
      <McpToolForm
        schema={SCHEMA}
        onSubmit={(args) => console.log('Submit:', args)}
      />
    </div>
  )
}`,
  },
  {
    id: 'scope-inspector',
    label: 'Scope Inspector',
    description: 'Expand OAuth scope details',
    lang: 'tsx',
    code: `import { McpScopeInspector } from '@mcp-elements/react'

export function ScopeInspectorExample() {
  return (
    <div className="p-4 max-w-md">
      <McpScopeInspector
        scopes="repo:read user.email:read notifications:write"
        descriptions={{
          'repo:read': 'Read access to your repositories, including code, issues, and pull requests.',
          'user.email:read': 'Access your verified email address to identify your account.',
          'notifications:write': 'Create and manage notifications on your behalf.',
        }}
      />
    </div>
  )
}`,
  },
  {
    id: 'consent-dialog',
    label: 'Consent Dialog',
    description: 'OAuth consent flow for MCP servers',
    lang: 'tsx',
    code: `import { McpConsentDialog } from '@mcp-elements/react'
import { useState } from 'react'

export function ConsentDialogExample() {
  const [open, setOpen] = useState(true)
  const [result, setResult] = useState<string>()

  return (
    <div className="p-4">
      {result && <p className="mb-3 text-sm text-muted-foreground">Result: {result}</p>}
      <button
        onClick={() => setOpen(true)}
        className="mcpe-btn mcpe-btn-primary mcpe-btn-sm"
      >
        Show consent dialog
      </button>
      <McpConsentDialog
        open={open}
        serverName="GitHub MCP"
        scopes={['repo:read', 'user.email:read', 'notifications:write']}
        onApprove={() => { setOpen(false); setResult('Approved ✓') }}
        onDeny={() => { setOpen(false); setResult('Denied') }}
      />
    </div>
  )
}`,
  },
]

export default function PlaygroundPage() {
  const [active, setActive] = useState(EXAMPLES[0].id)
  const example = EXAMPLES.find((e) => e.id === active)!

  return (
    <div className="py-16">
      <div className="site-container">
        <div className="mb-10">
          <h1
            className="text-4xl font-bold"
            style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}
          >
            Playground
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            Copy-paste ready examples for all 7 MCP components.
          </p>
        </div>

        {/* Example tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActive(ex.id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                background:
                  active === ex.id ? 'var(--site-accent)' : 'var(--site-bg-elevated)',
                color: active === ex.id ? '#fff' : 'var(--site-text-muted)',
                border: `1px solid ${active === ex.id ? 'transparent' : 'var(--site-border)'}`,
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Active example */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ border: '1px solid var(--site-border)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              background: 'var(--site-bg-elevated)',
              borderBottom: '1px solid var(--site-border)',
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--site-text)' }}>
                {example.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>
                {example.description}
              </p>
            </div>
            <CopyButton text={example.code} />
          </div>

          {/* Code */}
          <pre
            className="overflow-x-auto p-5 text-xs font-mono leading-relaxed"
            style={{
              background: 'oklch(0.08 0.005 286)',
              color: 'oklch(0.88 0.01 286)',
              margin: 0,
            }}
          >
            <code>{example.code}</code>
          </pre>
        </div>

        {/* CTA */}
        <div
          className="mt-10 rounded-xl p-6 text-center"
          style={{
            background: 'var(--site-bg-elevated)',
            border: '1px solid var(--site-border)',
          }}
        >
          <p className="mb-3 text-sm font-medium" style={{ color: 'var(--site-text)' }}>
            Ready to build? Install the packages.
          </p>
          <code className="text-sm font-mono" style={{ color: 'var(--site-accent)' }}>
            npm install @mcp-elements/react @mcp-elements/core
          </code>
        </div>
      </div>
    </div>
  )
}
