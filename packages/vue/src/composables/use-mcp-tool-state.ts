import { ref, onUnmounted, type Ref } from 'vue'
import { createToolState } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core'

export interface UseMcpToolState {
  /** The underlying tool-state machine (call start/markRunning/markDone/…). */
  api: ToolStateApi
  /** Reactive snapshot of the machine, updated on every transition. */
  snapshot: Ref<ToolStateSnapshot>
}

/**
 * Vue composable wrapping the framework-free `createToolState()` machine.
 * Creates one machine instance and mirrors it into a reactive ref; the
 * subscription is cleaned up automatically on unmount.
 */
export function useMcpToolState(): UseMcpToolState {
  const api = createToolState()
  const snapshot = ref<ToolStateSnapshot>({
    status: api.status,
    tool: api.tool,
    args: api.args,
    result: api.result,
    error: api.error,
    startedAt: api.startedAt,
    endedAt: api.endedAt,
  })

  const unsub = api.subscribe((s) => {
    snapshot.value = { ...s }
  })

  onUnmounted(unsub)

  return { api, snapshot }
}
