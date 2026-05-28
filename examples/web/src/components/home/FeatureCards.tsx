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
    <section className="border-t py-24" style={{ borderColor: 'var(--site-border)', backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
            How it works
          </p>
          <h2 className="text-3xl font-bold lg:text-4xl" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Three steps. No runtime.{' '}
            <span style={{ color: 'var(--site-text-muted)' }}>You own the code.</span>
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3"
          style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
          {STEPS.map(({ n, icon: Icon, title, body, code, codeLabel }) => (
            <div key={n} className="flex flex-col gap-5 p-7" style={{ background: 'var(--site-bg)' }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
                  {n}
                </span>
                <Icon className="h-5 w-5" style={{ color: 'var(--site-accent)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--site-text)' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{body}</p>
              </div>
              <div className="mt-auto rounded-md p-3"
                style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
                <p className="mb-1.5 text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: 'var(--site-text-subtle)' }}>
                  {codeLabel}
                </p>
                <code className="block break-all font-mono text-xs leading-relaxed"
                  style={{ color: 'var(--site-text)' }}>
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
