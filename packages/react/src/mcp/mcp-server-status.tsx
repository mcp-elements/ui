import type React from 'react'
import { cn } from '@mcp-elements/core'

export type McpConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface McpServerStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: McpConnectionStatus
  serverName?: string
}

const STATUS_LABELS: Record<McpConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
  error: 'Error',
}

export function McpServerStatus({ status, serverName, className, ...props }: McpServerStatusProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={serverName ? `${serverName}: ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
      {...props}
      className={cn(
        'mcpe-mcp-server-status',
        `mcpe-mcp-server-status-${status}`,
        className,
      )}
    >
      <span className="mcpe-mcp-server-status-dot" aria-hidden="true" />
      {serverName ? `${serverName} · ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
    </span>
  )
}
