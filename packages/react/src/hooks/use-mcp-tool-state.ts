import { useEffect, useState } from 'react'
import { createToolState } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core'

/**
 * React hook that wraps a ToolStateApi instance.
 * Provides reactive access to tool call state.
 */
export function useMcpToolState(): ToolStateSnapshot & ToolStateApi {
  const [api] = useState<ToolStateApi>(() => createToolState())
  const [snap, setSnap] = useState<ToolStateSnapshot>({
    status: api.status,
    tool: api.tool,
    args: api.args,
    result: api.result,
    error: api.error,
    startedAt: api.startedAt,
    endedAt: api.endedAt,
  })

  useEffect(() => {
    return api.subscribe((s) => setSnap({ ...s }))
  }, [api])

  return { ...snap, ...api }
}
