import { useEffect, useState } from 'react'
import { createOAuthFlow } from '@mcp-elements/core'
import type { OAuthFlowApi, OAuthFlowSnapshot } from '@mcp-elements/core'

/**
 * React hook that wraps an OAuthFlowApi instance.
 * Manages PKCE OAuth 2.1 flow state.
 */
export function useMcpOAuth(): OAuthFlowSnapshot & OAuthFlowApi {
  const [api] = useState<OAuthFlowApi>(() => createOAuthFlow())
  const [snap, setSnap] = useState<OAuthFlowSnapshot>({
    status: api.status,
    verifier: api.verifier,
    state: api.state,
    tokens: api.tokens,
    error: api.error,
  })

  useEffect(() => {
    return api.subscribe((s) => setSnap({ ...s }))
  }, [api])

  return { ...snap, ...api }
}
