import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { HeroToolCallDemo } from './HeroToolCallDemo'
import { InstallCommand } from '@/components/site/InstallCommand'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32" style={{ backgroundColor: 'var(--site-bg)' }}>
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(var(--site-border) 1px, transparent 1px), linear-gradient(90deg, var(--site-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--site-accent-glow)' }} />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="flex flex-col gap-8 max-w-xl">
            {/* Badge */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: 'var(--site-accent-glow)', border: '1px solid var(--site-accent)', color: 'var(--site-accent)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--site-accent)' }} />
              MCP UI · React · Angular · Vue
            </div>

            {/* Headline */}
            <h1
              className="text-5xl font-extrabold leading-[1.05] lg:text-6xl"
              style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}
            >
              The UI kit for
              <br />
              <span style={{ color: 'var(--site-accent)' }}>MCP applications.</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              Pre-built consent dialogs, tool-call cards, and scope inspectors.
              Copy-paste into any framework. No runtime lock-in.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--site-accent)', color: 'oklch(1 0 0)' }}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--site-border)', color: 'var(--site-text)' }}
              >
                Browse Components <ExternalLink className="h-4 w-4" style={{ color: 'var(--site-text-muted)' }} />
              </Link>
            </div>

            <InstallCommand componentName="mcp-tool-call" animate />
          </div>

          {/* Right — animated demo */}
          <div className="hidden lg:block">
            <HeroToolCallDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
