import { codeToHtml } from 'shiki'

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
state.start({
  tool: 'search_files',
  args: { path: '/src' },
})

<McpToolCall state={state} onRetry={() => state.reset()} />`

export async function BeforeAfterSection() {
  const [beforeHtml, afterHtml] = await Promise.all([
    codeToHtml(BEFORE, {
      lang: 'tsx',
      themes: { dark: 'github-dark-dimmed', light: 'github-light' },
      defaultColor: false,
    }),
    codeToHtml(AFTER, {
      lang: 'tsx',
      themes: { dark: 'github-dark-dimmed', light: 'github-light' },
      defaultColor: false,
    }),
  ])

  return (
    <section className="site-section site-section-divider relative overflow-hidden">
      <div className="site-container relative">
        <div className="mb-12 max-w-3xl">
          <p className="site-eyebrow mb-3">Before / after</p>
          <h2 className="site-h2">
            Less code.{' '}
            <span className="site-text-muted">Same product.</span>
          </h2>
          <p className="site-lede mt-4">
            The tool-call card alone is a week of work — state machine, accessibility, theme tokens, retry logic, six render states.
            You can hand-roll it, or you can drop in a component.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:gap-6">
          {/* Before — dimmed, slightly faded */}
          <article className="site-codeblock relative overflow-hidden">
            <header className="site-codeblock-header">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full shrink-0"
                  style={{ background: 'oklch(0.66 0.22 25 / 0.18)', color: 'var(--site-error)' }}
                  aria-hidden
                >
                  <svg viewBox="0 0 14 14" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 7h10" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold site-text">Without mcp-elements</span>
                <code className="site-codeblock-lang ml-1">tsx</code>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] site-text-subtle">
                47 lines · still incomplete
              </span>
            </header>
            <div
              className="site-codeblock-body shiki-host"
              style={{ maxHeight: '520px', overflow: 'auto' }}
              dangerouslySetInnerHTML={{ __html: beforeHtml }}
            />
            {/* Fade overlay at the bottom to suggest "even longer than shown" */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background: 'linear-gradient(180deg, transparent, var(--site-bg-elevated))',
              }}
            />
          </article>

          {/* After — clean accent-edged card */}
          <article
            className="relative overflow-hidden rounded-[var(--radius-lg)]"
            style={{
              background: 'var(--site-bg-elevated)',
              border: '1px solid oklch(0.71 0.22 5 / 0.30)',
              boxShadow: 'var(--shadow-md)',
              isolation: 'isolate',
            }}
          >
            <header className="site-codeblock-header relative z-[2]">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full shrink-0"
                  style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
                  aria-hidden
                >
                  <svg viewBox="0 0 14 14" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 2v10M2 7h10" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold site-text">With mcp-elements</span>
                <code className="site-codeblock-lang ml-1">tsx</code>
              </div>
              <span
                className="text-[11px] font-mono uppercase tracking-[0.15em] rounded-md px-2 py-0.5"
                style={{
                  background: 'var(--site-accent-glow)',
                  color: 'var(--site-accent)',
                }}
              >
                7 lines · ready
              </span>
            </header>
            <div
              className="site-codeblock-body shiki-host relative z-[2]"
              dangerouslySetInnerHTML={{ __html: afterHtml }}
            />
          </article>
        </div>

        {/* Stats row — bigger, more confident */}
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            { stat: '88%', label: 'less code per component', accent: false },
            { stat: '7', label: 'MCP components shipped, not rebuilt', accent: true },
            { stat: '0', label: 'runtime dependencies — you own the source', accent: false },
          ].map((item) => (
            <div
              key={item.label}
              className="site-card flex items-end gap-4 px-5 py-4"
            >
              <span
                className="font-bold leading-none"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  letterSpacing: '-0.04em',
                  color: item.accent ? 'var(--site-accent)' : 'var(--site-text)',
                }}
              >
                {item.stat}
              </span>
              <span className="text-sm leading-snug site-text-muted pb-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
