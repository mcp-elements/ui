'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  Button,
  Badge,
  Input,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Switch,
  Progress,
  McpServerStatus,
  McpToolCall,
} from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

/**
 * Live mini-previews of real components. Click any tile to open the doc page.
 * Each tile renders the actual @mcp-elements/react component, scaled down.
 */
function ToolCallMini() {
  const state = useMemo(() => createToolState(), [])
  useEffect(() => {
    let cancelled = false
    const t: ReturnType<typeof setTimeout>[] = []
    function s(fn: () => void, ms: number) { t.push(setTimeout(() => { if (!cancelled) fn() }, ms)) }
    function loop() {
      s(() => state.start({ tool: 'list_files', args: { dir: '/' } }), 600)
      s(() => state.markRunning(), 1100)
      s(() => state.markDone({ content: [{ type: 'text', text: '12 files' }] }), 2800)
      s(() => { state.reset(); if (!cancelled) loop() }, 5000)
    }
    loop()
    return () => { cancelled = true; t.forEach(clearTimeout) }
  }, [state])
  return <McpToolCall state={state} />
}

function SwitchMini() {
  return (
    <div className="flex items-center gap-3">
      <Switch checked={true} onCheckedChange={() => {}} />
      <span className="text-sm" style={{ color: 'var(--site-text-muted)' }}>Auto-approve</span>
    </div>
  )
}

function ProgressMini() {
  return <Progress value={62} className="w-full max-w-[160px]" />
}

const TILES: { slug: string; name: string; category: string; isMcp?: boolean; render: () => React.ReactNode }[] = [
  {
    slug: 'mcp-tool-call', name: 'McpToolCall', category: 'MCP', isMcp: true,
    render: () => <div className="w-full"><ToolCallMini /></div>,
  },
  {
    slug: 'mcp-server-status', name: 'McpServerStatus', category: 'MCP', isMcp: true,
    render: () => (
      <div className="flex flex-col gap-2">
        <McpServerStatus status="connected" serverName="github-mcp" />
        <McpServerStatus status="connecting" serverName="linear-mcp" />
      </div>
    ),
  },
  {
    slug: 'button', name: 'Button', category: 'Form',
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm">Save</Button>
        <Button variant="outline" size="sm">Cancel</Button>
      </div>
    ),
  },
  {
    slug: 'badge', name: 'Badge', category: 'Display',
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>Active</Badge>
        <Badge variant="secondary">Stable</Badge>
        <Badge variant="destructive">Error</Badge>
      </div>
    ),
  },
  {
    slug: 'card', name: 'Card', category: 'Display',
    render: () => (
      <Card className="w-full">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">github-mcp</CardTitle>
          <CardDescription className="text-xs">12 tools · OAuth</CardDescription>
        </CardHeader>
      </Card>
    ),
  },
  {
    slug: 'input', name: 'Input', category: 'Form',
    render: () => <Input placeholder="search…" className="w-full" />,
  },
  {
    slug: 'switch', name: 'Switch', category: 'Form',
    render: SwitchMini,
  },
  {
    slug: 'alert', name: 'Alert', category: 'Feedback',
    render: () => <Alert variant="success" className="text-xs">Connected.</Alert>,
  },
  {
    slug: 'progress', name: 'Progress', category: 'Display',
    render: ProgressMini,
  },
]

export function ComponentShowcase() {
  return (
    <section className="border-t py-24" style={{ borderColor: 'var(--site-border)', backgroundColor: 'var(--site-bg)' }}>
      <div className="site-container">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
              The library
            </p>
            <h2 className="text-3xl font-bold lg:text-4xl" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
              38 components.{' '}
              <span style={{ color: 'var(--site-text-muted)' }}>All rendered live.</span>
            </h2>
          </div>
          <Link href="/components"
            className="hidden items-center gap-1.5 text-sm font-medium sm:flex"
            style={{ color: 'var(--site-accent)' }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: 'var(--site-border)', border: '1px solid var(--site-border)' }}>
          {TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/components/${tile.slug}`}
              className="group flex flex-col gap-4 p-5 transition-colors"
              style={{ background: 'var(--site-bg-elevated)' }}
            >
              {/* Live preview area */}
              <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg p-4"
                style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
                <div className="w-full max-w-full" style={{ maxWidth: '100%' }}>
                  {tile.render()}
                </div>
              </div>

              {/* Label row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <code className="font-mono text-sm font-semibold truncate" style={{ color: 'var(--site-text)' }}>
                    {tile.name}
                  </code>
                  {tile.isMcp && (
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide shrink-0"
                      style={{ background: 'var(--site-accent)', color: 'var(--site-bg)' }}>
                      MCP
                    </span>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--site-text-subtle)' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
