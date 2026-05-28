import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LiveHeroDemo } from './LiveHeroDemo'
import { InstallCommand } from '@/components/site/InstallCommand'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/* Background grid */}
      <div
        aria-hidden
        className="site-hero-grid pointer-events-none absolute inset-0 opacity-[0.18]"
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* Left */}
          <div className="flex flex-col gap-7 max-w-2xl">
            {/* Badge — built for MCP */}
            <Link
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 hover:bg-[var(--site-bg-subtle)]"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text-muted)',
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest site-text-accent">v0.1</span>
              <span className="h-3 w-px" style={{ background: 'var(--site-border)' }} />
              Built for the Model Context Protocol
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>

            {/* Headline */}
            <h1 className="site-h1">
              The UI layer for{' '}
              <span className="site-text-accent">MCP</span>.
            </h1>

            {/* Subhead — concrete, names the parts, no jargon */}
            <p className="site-lede">
              Drop-in components for apps that talk to a Model Context Protocol server.{' '}
              <span className="site-text">Tool calls, OAuth consent, scope inspectors, resource browsers</span> — copy-paste, framework-native, no runtime to install.
            </p>

            {/* Install command */}
            <div className="max-w-md w-full">
              <InstallCommand componentName="mcp-tool-call" animate />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/components" className="site-btn site-btn-primary">
                Browse 38 components
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/mcp" className="site-btn site-btn-secondary">
                See the MCP flow
              </Link>
            </div>

            {/* Tiny footnote — frameworks */}
            <div className="mt-2 flex items-center gap-4 text-xs site-text-subtle">
              <span className="font-mono uppercase tracking-widest">Works with</span>
              <span className="flex items-center gap-3 font-mono">
                <span>React</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>Angular</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>Vue</span>
              </span>
            </div>
          </div>

          {/* Right — live demo with real components */}
          <div className="relative">
            <LiveHeroDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
