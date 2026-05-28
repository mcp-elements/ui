import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { InstallCommand } from '@/components/site/InstallCommand'

const CLI_OUTPUT = [
  'css/components/mcp-tool-call.css',
  'react/mcp/mcp-tool-call.tsx',
  'core/mcp/tool-state.ts',
]

export function CopyPasteCta() {
  return (
    <section
      className="site-section site-section-divider"
      style={{ backgroundColor: 'var(--site-bg-elevated)' }}
    >
      <div className="site-container">
        <div
          className="mx-auto max-w-3xl rounded-2xl p-8 sm:p-12 text-center"
          style={{
            backgroundColor: 'var(--site-bg)',
            border: '1px solid var(--site-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="site-eyebrow site-eyebrow-accent mb-3">Step 1 of 1</p>
          <h2 className="site-h2">Own your code.</h2>
          <p className="site-lede mx-auto mt-4">
            Run one command. The CLI copies source files into your project. No npm dependency for
            components — just code you control.
          </p>

          <div className="mt-8 text-left max-w-xl mx-auto">
            <InstallCommand componentName="mcp-tool-call" animate />
          </div>

          <div
            className="mt-3 max-w-xl mx-auto rounded-lg p-4 text-left font-mono text-sm"
            style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
          >
            {CLI_OUTPUT.map((line) => (
              <div key={line} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--site-success)' }} aria-hidden />
                <span className="site-text-muted truncate">{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/components" className="site-btn site-btn-primary">
              Read the docs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/playground" className="site-btn site-btn-secondary">
              Try the playground
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
