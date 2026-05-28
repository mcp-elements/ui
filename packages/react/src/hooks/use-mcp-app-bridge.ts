import { useCallback, useEffect, useRef } from 'react'
import { createAppBridge } from '@mcp-elements/core'
import type { AppMessageEnvelope } from '@mcp-elements/core'

export interface UseMcpAppBridgeOptions {
  /** Called when a message arrives from the iframe */
  onMessage?: (envelope: AppMessageEnvelope) => void
}

export interface UseMcpAppBridgeReturn {
  /** Send a message to the iframe */
  send: (envelope: AppMessageEnvelope) => void
  /** Assign to <iframe ref={...}> */
  frameRef: React.RefObject<HTMLIFrameElement | null>
}

/**
 * React hook that sets up a postMessage bridge with an MCP App iframe.
 * Wire it up: <iframe ref={frameRef} src={...} />
 *
 * onMessage is stored in a ref so inline callbacks don't recreate the bridge.
 */
export function useMcpAppBridge(options: UseMcpAppBridgeOptions = {}): UseMcpAppBridgeReturn {
  const { onMessage } = options
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const onMessageRef = useRef(onMessage)

  // Sync ref each render without adding to effect deps
  useEffect(() => {
    onMessageRef.current = onMessage
  })

  const postToFrame = useCallback((env: AppMessageEnvelope) => {
    frameRef.current?.contentWindow?.postMessage(env, '*')
  }, [])

  const sendRef = useRef<(env: AppMessageEnvelope) => void>(() => {})

  useEffect(() => {
    const bridge = createAppBridge({ postMessage: postToFrame })
    sendRef.current = (env) => bridge.send(env)

    const handler = (e: MessageEvent) => bridge.receive(e.data)
    window.addEventListener('message', handler)

    // Route all messages through the ref so inline callbacks don't trigger re-creation
    const unsub = bridge.onMessage((env) => onMessageRef.current?.(env))

    return () => {
      window.removeEventListener('message', handler)
      unsub()
    }
  }, [postToFrame]) // postToFrame is stable (useCallback with no deps)

  const send = useCallback((env: AppMessageEnvelope) => {
    sendRef.current(env)
  }, [])

  return { send, frameRef }
}
