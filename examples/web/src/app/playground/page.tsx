'use client'

import { useState } from 'react'
import { FileCode2 } from 'lucide-react'
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
  // Playground previews are React; use the React variant when usage is per-framework.
  const code = typeof doc?.usage === 'string' ? doc.usage : (doc?.usage?.react ?? '')

  return (
    <div className="site-section">
      <div className="site-container">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <p className="site-eyebrow site-eyebrow-accent mb-3">Playground</p>
          <h1 className="site-h1" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)' }}>
            Tap a component.{' '}
            <span className="site-text-muted">See it run.</span>
          </h1>
          <p className="site-lede mt-4">
            Every example below is a real <code className="font-mono text-sm site-text-accent">@mcp-elements/react</code> component running in this page — no screenshots, no mockups.
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
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  background: isActive ? 'var(--site-text)' : 'var(--site-bg-elevated)',
                  color: isActive ? 'var(--site-bg)' : 'var(--site-text-muted)',
                  border: `1px solid ${isActive ? 'var(--site-text)' : 'var(--site-border)'}`,
                  boxShadow: isActive ? 'var(--shadow-sm)' : undefined,
                }}
              >
                {ex.label}
              </button>
            )
          })}
        </div>

        {/* Active example — preview + code */}
        <div className="site-mosaic lg:grid-cols-2">
          {/* Preview */}
          <div style={{ background: 'var(--site-bg-elevated)' }}>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}
            >
              <div>
                <p className="text-sm font-semibold site-text">{example.label}</p>
                <p className="text-xs site-text-muted mt-0.5">{example.description}</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider site-text-subtle">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--site-success)', boxShadow: '0 0 6px var(--site-success)' }}
                />
                live
              </span>
            </div>
            <div
              className="flex min-h-[320px] items-center justify-center p-8"
              style={{ background: 'var(--site-bg)' }}
            >
              {Demo ? <Demo /> : <p className="text-sm site-text-muted">No demo available</p>}
            </div>
          </div>

          {/* Code */}
          <div className="flex flex-col" style={{ background: 'var(--site-bg-elevated)' }}>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}
            >
              <span className="site-codeblock-filename text-xs">
                <FileCode2 className="site-codeblock-filename-icon h-3.5 w-3.5" aria-hidden />
                <span>{example.slug}.tsx</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="site-codeblock-lang">TSX</span>
                <CopyButton text={code} />
              </span>
            </div>
            <pre
              className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed site-text-muted"
              style={{ background: 'var(--site-bg)' }}
            >
              <code>{code || '// No example yet'}</code>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-12 flex flex-col items-start gap-4 rounded-2xl p-6 sm:p-7 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: 'var(--site-bg-elevated)',
            border: '1px solid var(--site-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <p className="text-base font-semibold site-text">Ready to build?</p>
            <p className="site-body-sm mt-1">Install the package and start dropping components in.</p>
          </div>
          <code
            className="w-full sm:w-auto rounded-lg px-4 py-2 font-mono text-sm"
            style={{
              background: 'var(--site-bg)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-accent)',
            }}
          >
            npm install @mcp-elements/react @mcp-elements/core
          </code>
        </div>
      </div>
    </div>
  )
}
