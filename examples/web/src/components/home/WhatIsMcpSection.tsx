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
    <section className="site-section site-section-divider">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-24">
            <p className="site-eyebrow site-eyebrow-accent mb-3">New to MCP?</p>
            <h2 className="site-h2">The 30-second explainer.</h2>
            <p className="site-body mt-4 max-w-md">
              MCP is the protocol behind Claude, Cursor, Windsurf, and 9,400+ open-source servers. We give you the UI for the parts your users actually see.
            </p>
            <Link
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="site-link-accent mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
            >
              Read the MCP spec
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — three facts */}
          <div className="site-mosaic">
            {FACTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-6"
                style={{ background: 'var(--site-bg-elevated)' }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)', boxShadow: 'var(--shadow-xs)' }}
                >
                  <Icon className="h-5 w-5 site-text-accent" />
                </div>
                <div>
                  <h3 className="site-h3">{title}</h3>
                  <p className="site-body-sm mt-1.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
