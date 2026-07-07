'use client'

import { useEffect, useMemo, useState } from 'react'
import { McpToolCall, McpServerStatus } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'
import type { McpConnectionStatus } from '@mcp-elements/react'

/**
 * Hero demo that drives the actual @mcp-elements/react components through a
 * realistic MCP lifecycle: connecting → connected → tool call (pending →
 * running → done) → loop. No fake animation; everything you see is the real
 * components subscribing to the real state machines.
 */
export function LiveHeroDemo() {
  const state = useMemo(() => createToolState(), [])
  const [connection, setConnection] = useState<McpConnectionStatus>('connecting')

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function schedule(fn: () => void, ms: number) {
      timers.push(setTimeout(() => { if (!cancelled) fn() }, ms))
    }

    function runOnce() {
      // 1. Connect
      setConnection('connecting')
      schedule(() => setConnection('connected'), 900)

      // 2. Tool call cycle
      schedule(() => state.start({ tool: 'search_files', args: { path: '/src', pattern: '*.ts' } }), 1600)
      schedule(() => state.markRunning(), 2100)
      schedule(() => state.markDone({
        content: [{ type: 'text', text: 'Found 47 TypeScript files' }],
      }), 4800)

      // 3. Loop
      schedule(() => {
        state.reset()
        if (!cancelled) runOnce()
      }, 8500)
    }

    runOnce()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [state])

  return (
    <div className="relative">
      <div className="relative flex flex-col gap-3">
        {/* Connection status row */}
        <div className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <div className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--site-text-muted)' }}>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>Server</span>
            github-mcp
          </div>
          <McpServerStatus status={connection} />
        </div>

        {/* The real McpToolCall, driven by a real ToolStateApi. The fallback
            toolName/args keep the first paint meaningful before the demo
            lifecycle kicks in (otherwise the card renders "unknown"). */}
        <McpToolCall state={state} toolName="search_files" args={{ path: '/src', pattern: '*.ts' }} />

        {/* Code preview overlay tag */}
        <div className="absolute -bottom-3 right-4 hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider sm:flex"
          style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-text-subtle)' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-success)' }} />
          live · real components
        </div>
      </div>
    </div>
  )
}
