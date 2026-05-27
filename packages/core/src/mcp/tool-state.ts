// packages/core/src/mcp/tool-state.ts
import type { CallToolResult, ToolCallStatus } from './types'

export interface ToolStateSnapshot {
  status: ToolCallStatus
  tool?: string
  args?: Record<string, unknown>
  result?: CallToolResult
  error?: Error
  startedAt?: number
  endedAt?: number
}

export interface ToolStateApi extends Readonly<ToolStateSnapshot> {
  start(input: { tool: string; args: Record<string, unknown> }): void
  markRunning(): void
  markDone(result: CallToolResult): void
  markError(error: Error): void
  cancel(): void
  reset(): void
  subscribe(fn: (snapshot: ToolStateSnapshot) => void): () => void
}

const VALID_TRANSITIONS: Record<ToolCallStatus, ToolCallStatus[]> = {
  idle: ['pending'],
  pending: ['running', 'cancelled'],
  running: ['done', 'error', 'cancelled'],
  done: ['idle'],
  error: ['idle'],
  cancelled: ['idle'],
}

export function createToolState(): ToolStateApi {
  let snapshot: ToolStateSnapshot = { status: 'idle' }
  const listeners = new Set<(s: ToolStateSnapshot) => void>()

  function transition(to: ToolCallStatus, patch: Partial<ToolStateSnapshot> = {}) {
    const allowed = VALID_TRANSITIONS[snapshot.status]
    if (!allowed.includes(to)) {
      throw new Error(`Invalid tool-state transition: ${snapshot.status} → ${to}`)
    }
    snapshot = { ...snapshot, ...patch, status: to }
    let firstError: unknown
    for (const fn of listeners) {
      try { fn(snapshot) } catch (e) { if (firstError === undefined) firstError = e }
    }
    if (firstError !== undefined) throw firstError
  }

  return {
    get status() { return snapshot.status },
    get tool() { return snapshot.tool },
    get args() { return snapshot.args },
    get result() { return snapshot.result },
    get error() { return snapshot.error },
    get startedAt() { return snapshot.startedAt },
    get endedAt() { return snapshot.endedAt },
    start({ tool, args }) {
      transition('pending', { tool, args, startedAt: Date.now() })
    },
    markRunning() {
      transition('running')
    },
    markDone(result) {
      transition('done', { result, endedAt: Date.now() })
    },
    markError(error) {
      transition('error', { error, endedAt: Date.now() })
    },
    cancel() {
      transition('cancelled', { endedAt: Date.now() })
    },
    reset() {
      if (snapshot.status === 'idle') return
      snapshot = { status: 'idle' }
      let firstError: unknown
      for (const fn of listeners) {
        try { fn(snapshot) } catch (e) { if (firstError === undefined) firstError = e }
      }
      if (firstError !== undefined) throw firstError
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
