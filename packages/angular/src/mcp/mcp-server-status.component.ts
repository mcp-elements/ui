import { Component, input, computed } from '@angular/core'
import { cn } from '@mcp-elements/core'

export type McpConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

const STATUS_LABELS: Record<McpConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
  error: 'Error',
}

@Component({
  selector: 'mcpe-mcp-server-status',
  standalone: true,
  template: `
    <span
      [class]="classes()"
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaLabel()"
    >
      <span class="mcpe-mcp-server-status-dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
})
export class McpeMcpServerStatusComponent {
  status = input.required<McpConnectionStatus>()
  serverName = input<string>()
  class = input('')

  classes = computed(() => cn('mcpe-mcp-server-status', `mcpe-mcp-server-status-${this.status()}`, this.class()))
  label = computed(() => {
    const s = this.serverName()
    const statusLabel = STATUS_LABELS[this.status() as McpConnectionStatus]
    return s ? `${s} · ${statusLabel}` : statusLabel
  })
  ariaLabel = computed(() => {
    const s = this.serverName()
    const statusLabel = STATUS_LABELS[this.status() as McpConnectionStatus]
    return s ? `${s}: ${statusLabel}` : statusLabel
  })
}
