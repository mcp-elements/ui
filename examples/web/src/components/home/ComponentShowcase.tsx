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

function ToolCallMini() {
  const state = useMemo(() => createToolState(), [])
  useEffect(() => {
    let cancelled = false
    const t: ReturnType<typeof setTimeout>[] = []
    function s(fn: () => void, ms: number) { t.push(setTimeout(() => { if (!cancelled) fn() }, ms)) }
    function loop() {
      s(() => state.start({ tool: 'list_files', args: { dir: '/src' } }), 600)
      s(() => state.markRunning(), 1100)
      s(() => state.markDone({ content: [{ type: 'text', text: '12 files found' }] }), 2800)
      s(() => { state.reset(); if (!cancelled) loop() }, 5000)
    }
    loop()
    return () => { cancelled = true; t.forEach(clearTimeout) }
  }, [state])
  return <McpToolCall state={state} />
}

interface Tile {
  slug: string
  name: string
  isMcp?: boolean
  /** Grid span — use to make bento layout */
  span?: string
  /** Centered tight content (default false → fills) */
  centered?: boolean
  render: () => React.ReactNode
}

const TILES: Tile[] = [
  // Row 1 — McpToolCall is the hero tile (2x2)
  {
    slug: 'mcp-tool-call', name: 'McpToolCall', isMcp: true,
    span: 'lg:col-span-2 lg:row-span-2',
    render: () => (
      <div className="w-full max-w-md">
        <ToolCallMini />
      </div>
    ),
  },
  // Server status — tall (2 rows)
  {
    slug: 'mcp-server-status', name: 'McpServerStatus', isMcp: true,
    span: 'lg:row-span-2',
    render: () => (
      <div className="flex flex-col gap-2.5 w-full">
        <McpServerStatus status="connected" serverName="github-mcp" />
        <McpServerStatus status="connecting" serverName="linear-mcp" />
        <McpServerStatus status="disconnected" />
        <McpServerStatus status="error" serverName="jira-mcp" />
      </div>
    ),
  },
  // Badge — single
  {
    slug: 'badge', name: 'Badge', centered: true,
    render: () => (
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge>Active</Badge>
        <Badge variant="secondary">Stable</Badge>
        <Badge variant="destructive">Error</Badge>
      </div>
    ),
  },
  // Button — single
  {
    slug: 'button', name: 'Button', centered: true,
    render: () => (
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="primary" size="sm">Save</Button>
        <Button variant="outline" size="sm">Cancel</Button>
      </div>
    ),
  },
  // Row 2 continues
  // Card — wide (2 cols)
  {
    slug: 'card', name: 'Card',
    span: 'lg:col-span-2',
    render: () => (
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-base">github-mcp</CardTitle>
          <CardDescription className="text-xs">12 tools · OAuth-secured</CardDescription>
        </CardHeader>
      </Card>
    ),
  },
  // Switch
  {
    slug: 'switch', name: 'Switch', centered: true,
    render: () => (
      <div className="flex items-center gap-3">
        <Switch checked={true} onCheckedChange={() => {}} aria-label="Example toggle" />
        <span className="text-sm site-text-muted">Auto-approve</span>
      </div>
    ),
  },
  // Input — wide
  {
    slug: 'input', name: 'Input',
    span: 'lg:col-span-2',
    render: () => (
      <Input
        placeholder="Search components, tools, resources…"
        className="w-full"
        defaultValue="mcp-tool-call"
      />
    ),
  },
  // Alert
  {
    slug: 'alert', name: 'Alert',
    render: () => (
      <Alert variant="success" className="text-xs">Connected to github-mcp.</Alert>
    ),
  },
  // Progress
  {
    slug: 'progress', name: 'Progress', centered: true,
    render: () => (
      <div className="flex flex-col gap-2 w-full">
        <Progress value={62} className="w-full" />
        <div className="flex justify-between text-xs site-text-subtle">
          <span>Indexing</span><span>62%</span>
        </div>
      </div>
    ),
  },
]

export function ComponentShowcase() {
  return (
    <section className="site-section site-section-divider relative overflow-hidden">
      <div className="site-container relative">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="site-eyebrow mb-2">The library</p>
            <h2 className="site-h2">
              7 MCP primitives.{' '}
              <span className="site-text-muted">And 24 base UI primitives to build on.</span>
            </h2>
            <p className="site-lede mt-3 max-w-xl">
              The{' '}
              <Link href="/mcp" className="site-link-accent font-medium">7 MCP-native components</Link>
              {' '}are the headline — tool execution, OAuth consent, resource browsing, server status and more.
              All rendered live.
            </p>
          </div>
          <Link href="/components" className="site-link-accent hidden items-center gap-1.5 text-sm font-medium sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Bento grid — 4 cols on lg, with explicit row height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:auto-rows-[160px]">
          {TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/components/${tile.slug}`}
              className={`group site-card relative flex flex-col overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 ${tile.span ?? ''}`}
            >
              {/* Preview area — fills remaining space */}
              <div className={`flex flex-1 ${tile.centered ? 'items-center justify-center' : 'items-start'} min-h-0`}>
                {tile.render()}
              </div>

              {/* Label row */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <code className="font-mono text-sm font-semibold truncate site-text">
                    {tile.name}
                  </code>
                  {tile.isMcp && (
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold tracking-widest shrink-0 uppercase"
                      style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
                    >
                      MCP
                    </span>
                  )}
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 site-text-subtle"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
