import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LiveHeroDemo } from './LiveHeroDemo'
import { InstallCommand } from '@/components/site/InstallCommand'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32" style={{ backgroundColor: 'var(--site-bg)' }}>
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(var(--site-border) 1px, transparent 1px), linear-gradient(90deg, var(--site-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
        }}
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
              className="group inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text-muted)',
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--site-accent)' }}>v0.1</span>
              <span className="h-3 w-px" style={{ background: 'var(--site-border)' }} />
              Built for the Model Context Protocol
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Headline */}
            <h1
              className="text-5xl font-bold leading-[1.05] lg:text-[64px]"
              style={{ color: 'var(--site-text)', letterSpacing: '-0.035em' }}
            >
              The UI layer for{' '}
              <span style={{ color: 'var(--site-accent)' }}>MCP</span>.
            </h1>

            {/* Subhead — concrete, names the parts, no jargon */}
            <p className="text-lg leading-relaxed" style={{ color: 'var(--site-text-muted)', maxWidth: '36rem' }}>
              Drop-in components for apps that talk to a Model Context Protocol server.{' '}
              <span style={{ color: 'var(--site-text)' }}>Tool calls, OAuth consent, scope inspectors, resource browsers</span> — copy-paste, framework-native, no runtime to install.
            </p>

            {/* Install command */}
            <div className="max-w-md">
              <InstallCommand componentName="mcp-tool-call" animate />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--site-text)', color: 'var(--site-bg)' }}
              >
                Browse 38 components
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mcp"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--site-border)',
                  color: 'var(--site-text)',
                }}
              >
                See the MCP flow
              </Link>
            </div>

            {/* Tiny footnote — frameworks */}
            <div className="mt-2 flex items-center gap-4 text-xs" style={{ color: 'var(--site-text-subtle)' }}>
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
