import { defineComponent, h, computed, type PropType } from 'vue'
import { cn } from '@mcp-elements/core'

export type McpConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'

const STATUS_LABELS: Record<McpConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
  error: 'Error',
}

export const McpeMcpServerStatus = defineComponent({
  name: 'McpeMcpServerStatus',
  props: {
    status: { type: String as PropType<McpConnectionStatus>, required: true },
    serverName: { type: String, default: '' },
    class: { type: String, default: '' },
  },
  setup(props) {
    const label = computed(
      () => (props.serverName ? `${props.serverName} · ` : '') + STATUS_LABELS[props.status]
    )
    const ariaLabel = computed(
      () => (props.serverName ? `${props.serverName}: ` : '') + STATUS_LABELS[props.status]
    )

    return () =>
      h(
        'span',
        {
          class: cn(
            'mcpe-mcp-server-status',
            `mcpe-mcp-server-status-${props.status}`,
            props.class
          ),
          role: 'status',
          'aria-live': 'polite',
          'aria-label': ariaLabel.value,
        },
        [h('span', { class: 'mcpe-mcp-server-status-dot', 'aria-hidden': 'true' }), label.value]
      )
  },
})
