'use client'

import { useState } from 'react'
import { DEMOS } from '@/components/demos/registry'
import { CopyButton } from '@/components/site/CopyButton'
import { getComponentDoc } from '@/lib/component-docs'

interface Example {
  slug: string
  label: string
  description: string
}

const EXAMPLES: Example[] = [
  { slug: 'mcp-server-status', label: 'Server Status', description: 'Show live MCP server connection state' },
  { slug: 'mcp-tool-call', label: 'Tool Call', description: 'Tool execution state machine: idle → running → done' },
  { slug: 'mcp-tool-form', label: 'Tool Form', description: 'Render a form from JSON Schema' },
  { slug: 'mcp-consent-dialog', label: 'Consent Dialog', description: 'OAuth consent flow for MCP servers' },
  { slug: 'mcp-scope-inspector', label: 'Scope Inspector', description: 'Expandable OAuth scope details' },
  { slug: 'mcp-resource-browser', label: 'Resource Browser', description: 'Browse MCP resources by URI + mime type' },
]

export default function PlaygroundPage() {
  const [active, setActive] = useState(EXAMPLES[0].slug)
  const example = EXAMPLES.find((e) => e.slug === active)!
  const Demo = DEMOS[example.slug]
  const doc = getComponentDoc(example.slug)
  const code = doc?.usage ?? ''

  return (
    <div className="pb-24 pt-20">
      <div className="site-container">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-accent)' }}>
            Playground
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl" style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}>
            Tap a component.{' '}
            <span style={{ color: 'var(--site-text-muted)' }}>See it run.</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
            Every example below is a real <code className="font-mono text-sm" style={{ color: 'var(--site-accent)' }}>@mcp-elements/react</code> component running in this page — no screenshots, no mockups.
          </p>
        </div>

        {/* Example pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => {
            const isActive = active === ex.slug
            return (
              <button
                key={ex.slug}
                onClick={() => setActive(ex.slug)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--site-text)' : 'var(--site-bg-elevated)',
                  color: isActive ? 'var(--site-bg)' : 'var(--site-text-muted)',
                  border: `1px solid ${isActive ? 'var(--site-text)' : 'var(--site-border)'}`,
                }}
              >
                {ex.label}
              </button>
            )
          })}
        </div>

        {/* Active example — preview + code */}
        <div className="grid gap-px overflow-hidden rounded-2xl lg:grid-cols-2"
          style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
          {/* Preview */}
          <div style={{ background: 'var(--site-bg-elevated)' }}>
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--site-text)' }}>{example.label}</p>
                <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>{example.description}</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
                style={{ color: 'var(--site-text-subtle)' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-success)' }} />
                live
              </span>
            </div>
            <div className="flex min-h-[280px] items-center justify-center p-8"
              style={{ background: 'var(--site-bg)' }}>
              {Demo ? <Demo /> : <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>No demo available</p>}
            </div>
          </div>

          {/* Code */}
          <div className="flex flex-col" style={{ background: 'var(--site-bg-elevated)' }}>
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
                Source · tsx
              </p>
              <CopyButton text={code} />
            </div>
            <pre className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed"
              style={{ background: 'var(--site-bg)', color: 'var(--site-text-muted)' }}>
              <code>{code || '// No example yet'}</code>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <div>
            <p className="text-base font-semibold" style={{ color: 'var(--site-text)' }}>Ready to build?</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--site-text-muted)' }}>
              Install the package and start dropping components in.
            </p>
          </div>
          <code className="rounded-lg px-4 py-2 font-mono text-sm"
            style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-accent)' }}>
            npm install @mcp-elements/react @mcp-elements/core
          </code>
        </div>
      </div>
    </div>
  )
}
