import Link from 'next/link'
import { ArrowUpRight, Network, Workflow, ShieldCheck } from 'lucide-react'

const FACTS = [
  {
    icon: Network,
    title: 'A protocol, not a framework',
    body: 'MCP is an open standard for connecting AI apps to tools, files, and services. Think USB-C for AI agents.',
  },
  {
    icon: Workflow,
    title: 'Servers expose, clients consume',
    body: 'Any app can run an MCP server (GitHub, Linear, your DB). Any AI client can plug in — Claude, Cursor, Windsurf, custom.',
  },
  {
    icon: ShieldCheck,
    title: 'Built-in consent + scopes',
    body: 'MCP includes OAuth 2.1 with PKCE, scope grants, and a postMessage spec for sandboxed UI. mcp-elements gives you the UI pieces.',
  },
]

export function WhatIsMcpSection() {
  return (
    <section className="border-t pb-24 pt-20" style={{ borderColor: 'var(--site-border)', backgroundColor: 'var(--site-bg)' }}>
      <div className="site-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-accent)' }}>
              New to MCP?
            </p>
            <h2 className="text-3xl font-bold lg:text-4xl" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
              The 30-second explainer.
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--site-text-muted)', maxWidth: '28rem' }}>
              MCP is the protocol behind Claude, Cursor, Windsurf, and 9,400+ open-source servers. We give you the UI for the parts your users actually see.
            </p>
            <Link
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--site-accent)' }}
            >
              Read the MCP spec
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — three facts */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
            {FACTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-6"
                style={{ background: 'var(--site-bg-elevated)' }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'var(--site-accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--site-text)' }}>{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
