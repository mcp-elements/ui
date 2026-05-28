import { Minus, Plus } from 'lucide-react'

const BEFORE = `// Build a tool-call card from scratch
import { useState, useEffect } from 'react'
import { ToolStateApi } from '@modelcontextprotocol/sdk'

type Status = 'idle' | 'pending' | 'running' | 'done' | 'error'

export function ToolCallCard({ tool, args, onRetry }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ToolResult>()
  const [error, setError] = useState<Error>()
  const [progress, setProgress] = useState(0)

  // …subscribe to the SDK, validate transitions, handle race
  // conditions, render 6 states, manage retry, accessibility,
  // theme tokens, keyboard nav, focus rings, ARIA live regions…

  return (
    <div role="region" aria-live="polite" className="…">
      <header>
        <span>{tool}</span>
        <StatusBadge status={status} />
      </header>
      {args && <ArgsBlock args={args} />}
      {status === 'running' && <Progress value={progress} />}
      {status === 'done' && <ResultBlock result={result} />}
      {status === 'error' && (
        <ErrorBlock error={error} onRetry={onRetry} />
      )}
    </div>
  )
}

// 47 lines later… and you still haven't shipped consent or scopes.`

const AFTER = `// One component. Same flow.
import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
state.start({ tool: 'search_files', args: { path: '/src' } })

<McpToolCall state={state} onRetry={() => state.reset()} />`

export function BeforeAfterSection() {
  return (
    <section className="site-section site-section-divider relative overflow-hidden">
      <div className="site-container">
        <div className="mb-12 max-w-2xl">
          <p className="site-eyebrow mb-3">Before / after</p>
          <h2 className="site-h2">
            Less code.{' '}
            <span className="site-text-muted">Same product.</span>
          </h2>
          <p className="site-lede mt-4">
            The tool-call card alone is a week of work — state machine, accessibility, theme tokens, retry logic, six render states. You can hand-roll it, or you can drop in a component.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-5">
          {/* Before */}
          <article
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: '1px solid var(--site-border)',
              background: 'var(--site-bg-elevated)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <header
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: 'oklch(0.62 0.22 25 / 0.18)', color: 'var(--site-error)' }}
                >
                  <Minus className="h-3 w-3" strokeWidth={3} />
                </span>
                <p className="text-sm font-semibold site-text">Without mcp-elements</p>
              </div>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-text-subtle)' }}
              >
                47 lines · 1 component
              </span>
            </header>
            <pre
              className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7]"
              style={{ background: 'var(--site-bg)', color: 'var(--site-text-muted)' }}
            >
              <code>{BEFORE}</code>
            </pre>
          </article>

          {/* After */}
          <article
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: '1px solid var(--site-accent)',
              background: 'var(--site-bg-elevated)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <header
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--site-border)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
                >
                  <Plus className="h-3 w-3" strokeWidth={3} />
                </span>
                <p className="text-sm font-semibold site-text">With mcp-elements</p>
              </div>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                style={{ background: 'var(--site-accent-glow)', border: '1px solid var(--site-accent)', color: 'var(--site-accent)' }}
              >
                6 lines · ready
              </span>
            </header>
            <pre
              className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7]"
              style={{ background: 'var(--site-bg)', color: 'var(--site-text)' }}
            >
              <code>{AFTER}</code>
            </pre>

            {/* Subtle gradient accent on bottom edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--site-accent), transparent)',
              }}
            />
          </article>
        </div>

        {/* Bullets below the comparison */}
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { stat: '88%', label: 'less code per component' },
            { stat: '7', label: 'MCP components shipped, not rebuilt' },
            { stat: '0', label: 'runtime dependencies — you own the source' },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-baseline gap-3 rounded-xl px-4 py-3"
              style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
            >
              <span
                className="font-bold tracking-tight site-text-accent"
                style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
              >
                {item.stat}
              </span>
              <span className="text-sm site-text-muted">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
