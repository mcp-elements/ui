import { ref, onUnmounted, type Ref } from 'vue'
import { createOAuthFlow } from '@mcp-elements/core'
import type { OAuthFlowApi, OAuthFlowSnapshot } from '@mcp-elements/core'

export interface UseMcpOAuth {
  /** The underlying OAuth flow machine (call start/markAuthorized/…). */
  api: OAuthFlowApi
  /** Reactive snapshot of the flow, updated on every transition. */
  snapshot: Ref<OAuthFlowSnapshot>
}

/**
 * Vue composable wrapping the framework-free `createOAuthFlow()` machine.
 * Mirrors the flow state into a reactive ref; cleans up on unmount.
 */
export function useMcpOAuth(): UseMcpOAuth {
  const api = createOAuthFlow()
  const snapshot = ref<OAuthFlowSnapshot>({
    status: api.status,
    verifier: api.verifier,
    state: api.state,
    tokens: api.tokens,
    error: api.error,
  })

  const unsub = api.subscribe((s) => {
    snapshot.value = { ...s }
  })

  onUnmounted(unsub)

  return { api, snapshot }
}
