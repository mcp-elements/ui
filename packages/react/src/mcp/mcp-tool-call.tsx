import { useEffect, useState } from 'react'
import { cn } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core'

export interface McpToolCallProps {
  state: ToolStateApi
  toolName?: string
  args?: Record<string, unknown>
  onRetry?: () => void
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  idle: 'idle',
  pending: 'pending',
  running: 'running',
  done: 'done',
  error: 'error',
  cancelled: 'cancelled',
}

function snapFromState(state: ToolStateApi): ToolStateSnapshot {
  return {
    status: state.status,
    tool: state.tool,
    args: state.args,
    result: state.result,
    error: state.error,
    startedAt: state.startedAt,
    endedAt: state.endedAt,
  }
}

export function McpToolCall({ state, toolName, args, onRetry, className }: McpToolCallProps) {
  const [snap, setSnap] = useState<ToolStateSnapshot>(() => snapFromState(state))

  useEffect(() => {
    setSnap(snapFromState(state))
    return state.subscribe((s) => setSnap({ ...s }))
  }, [state])

  const displayName = snap.tool ?? toolName ?? 'unknown'
  const displayArgs = snap.args ?? args

  return (
    <div className={cn('mcpe-mcp-tool-call', className)}>
      {/* Header */}
      <div className="mcpe-mcp-tool-call-header">
        <div className="mcpe-mcp-tool-call-name">
          <span className="mcpe-mcp-tool-call-icon" aria-hidden="true">fn</span>
          <span className="mcpe-mcp-tool-call-title">{displayName}</span>
        </div>
        <span className={cn('mcpe-mcp-tool-call-badge', `mcpe-mcp-tool-call-badge-${snap.status}`)}>
          {snap.status === 'running' && (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {STATUS_LABELS[snap.status]}
        </span>
      </div>

      {/* Args */}
      {displayArgs && (
        <pre className="mcpe-mcp-tool-call-args">
          {JSON.stringify(displayArgs, null, 2)}
        </pre>
      )}

      {/* Progress bar (running) */}
      {snap.status === 'running' && (
        <div className="mcpe-mcp-tool-call-progress" role="progressbar" aria-label="Tool running">
          <div className="mcpe-mcp-tool-call-progress-bar" style={{ width: '60%' }} />
        </div>
      )}

      {/* Result (done) */}
      {snap.status === 'done' && snap.result && (
        <div className="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-done">
          {snap.result.content
            .filter((c) => c.type === 'text')
            .map((c, i) => (
              <p key={i} className="whitespace-pre-wrap text-sm">
                {'text' in c ? c.text : null}
              </p>
            ))}
        </div>
      )}

      {/* Error */}
      {snap.status === 'error' && snap.error && (
        <div className="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-error">
          <p className="text-sm">{snap.error.message}</p>
          {onRetry && (
            <div className="mcpe-mcp-tool-call-footer mt-2">
              <button
                onClick={onRetry}
                className="text-xs underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
