import { Search, Clipboard, Sparkles } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: Search,
    title: 'Pick a component',
    body: 'Browse 38 components across 7 categories — base UI, AI primitives, and the 7 MCP-specific ones.',
    code: '/components/mcp-tool-call',
    codeLabel: 'browse',
  },
  {
    n: '02',
    icon: Clipboard,
    title: 'Copy it in',
    body: 'One command drops the source into your project. No runtime dep, no version lock-in. You own the file.',
    code: 'npx @mcp-elements/cli add mcp-tool-call',
    codeLabel: 'install',
  },
  {
    n: '03',
    icon: Sparkles,
    title: 'Wire it to state',
    body: 'Each component subscribes to a framework-free state machine from @mcp-elements/core. React, Angular, or Vue.',
    code: 'createToolState() → <McpToolCall state={…} />',
    codeLabel: 'use',
  },
]

export function FeatureCards() {
  return (
    <section
      className="site-section site-section-divider"
      style={{ backgroundColor: 'var(--site-bg-elevated)' }}
    >
      <div className="site-container">
        <div className="mb-12 max-w-2xl">
          <p className="site-eyebrow mb-2">How it works</p>
          <h2 className="site-h2">
            Three steps. No runtime.{' '}
            <span className="site-text-muted">You own the code.</span>
          </h2>
        </div>

        <div className="site-mosaic sm:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body, code, codeLabel }) => (
            <div
              key={n}
              className="flex flex-col gap-5 p-7"
              style={{ background: 'var(--site-bg)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm tracking-widest site-text-subtle">{n}</span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md"
                  style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
                >
                  <Icon className="h-4 w-4 site-text-accent" aria-hidden />
                </div>
              </div>
              <div>
                <h3 className="site-h3" style={{ fontSize: '1.0625rem' }}>{title}</h3>
                <p className="site-body-sm mt-2">{body}</p>
              </div>
              <div
                className="mt-auto rounded-md p-3"
                style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
              >
                <p className="mb-1.5 text-[10px] font-mono uppercase tracking-widest site-text-subtle">
                  {codeLabel}
                </p>
                <code className="block break-all font-mono text-xs leading-relaxed site-text">
                  {code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
