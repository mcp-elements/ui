import { cn } from '@mcp-elements/core'

export type McpConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface McpServerStatusProps {
  status: McpConnectionStatus
  serverName?: string
  className?: string
}

const STATUS_LABELS: Record<McpConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
  error: 'Error',
}

export function McpServerStatus({ status, serverName, className }: McpServerStatusProps) {
  return (
    <span
      className={cn(
        'mcpe-mcp-server-status',
        `mcpe-mcp-server-status-${status}`,
        className,
      )}
      role="status"
      aria-label={serverName ? `${serverName}: ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
    >
      <span className="mcpe-mcp-server-status-dot" aria-hidden="true" />
      {serverName ? `${serverName} · ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
    </span>
  )
}
