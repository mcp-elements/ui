import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { InstallCommand } from '@/components/site/InstallCommand'

const CLI_OUTPUT = [
  '✓  css/components/mcp-tool-call.css',
  '✓  react/mcp/mcp-tool-call.tsx',
  '✓  core/mcp/tool-state.ts',
]

export function CopyPasteCta() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container">
        <div className="mx-auto max-w-3xl rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Own your code.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
            Run one command. The CLI copies source files into your project.
            No npm dependency for components — just code you control.
          </p>
          <div className="mt-8 text-left">
            <InstallCommand componentName="mcp-tool-call" animate />
          </div>
          <div className="mt-3 rounded-lg p-4 text-left font-mono text-sm"
            style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
            {CLI_OUTPUT.map((line) => (
              <div key={line} style={{ color: 'var(--site-success)' }}>{line}</div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/components"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--site-accent)', color: 'oklch(1 0 0)' }}>
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
