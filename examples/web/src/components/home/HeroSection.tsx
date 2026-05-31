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
      {/* Accent radial behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 h-[600px] w-[700px] rounded-full blur-[120px]"
        style={{ background: 'var(--site-accent-glow)', opacity: 0.5 }}
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* Left */}
          <div className="flex flex-col gap-7 max-w-2xl">
            {/* Badge — 38 components × 3 frameworks */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text-muted)',
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest site-text-accent">v0.1</span>
              <span className="h-3 w-px" style={{ background: 'var(--site-border)' }} />
              <span>38 components</span>
              <span style={{ color: 'var(--site-border)' }}>·</span>
              <span>React · Angular · Vue</span>
              <span style={{ color: 'var(--site-border)' }}>·</span>
              <span className="site-text-accent">MCP-native</span>
            </div>

            {/* Headline — broader positioning */}
            <h1
              className="font-bold"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                lineHeight: '1.02',
                letterSpacing: '-0.035em',
                color: 'var(--site-text)',
              }}
            >
              38 copy-paste{' '}
              <span className="site-text-muted">components.</span>
              <br className="hidden sm:block" />
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--site-accent) 0%, var(--site-accent-2) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Multi-framework. MCP-native.
              </span>
            </h1>

            {/* Subhead — names the categories so visitors know what they get */}
            <p className="site-lede">
              38 copy-paste components. Multi-framework.{' '}
              <strong className="site-text">MCP-native.</strong>{' '}
              7 MCP primitives nobody else ships — tool-call cards, OAuth consent, scope inspector and more —
              plus 24 base UI primitives to build on. React, Angular, Vue.
            </p>

            {/* Install command */}
            <div className="max-w-md w-full">
              <InstallCommand componentName="mcp-tool-call" animate />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/components" className="site-btn site-btn-accent">
                Browse all 38
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/mcp" className="site-btn site-btn-secondary">
                See the MCP set
              </Link>
            </div>

            {/* Tiny footnote — categories */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs site-text-subtle">
              <span className="font-mono uppercase tracking-widest">Includes</span>
              <span className="flex items-center gap-3 font-mono">
                <span>Form</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>Display</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>Overlay</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>Navigation</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span>AI</span>
                <span style={{ color: 'var(--site-border)' }}>·</span>
                <span className="site-text-accent">MCP</span>
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
