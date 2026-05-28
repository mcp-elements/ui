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
 */
export function useMcpAppBridge(options: UseMcpAppBridgeOptions = {}): UseMcpAppBridgeReturn {
  const { onMessage } = options
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  const postToFrame = useCallback((env: AppMessageEnvelope) => {
    frameRef.current?.contentWindow?.postMessage(env, '*')
  }, [])

  const sendRef = useRef<(env: AppMessageEnvelope) => void>(() => {})

  useEffect(() => {
    const bridge = createAppBridge({ postMessage: postToFrame })
    sendRef.current = (env) => bridge.send(env)

    const handler = (e: MessageEvent) => bridge.receive(e.data)
    window.addEventListener('message', handler)

    let unsub: (() => void) | undefined
    if (onMessage) {
      unsub = bridge.onMessage(onMessage)
    }

    return () => {
      window.removeEventListener('message', handler)
      unsub?.()
    }
  }, [onMessage, postToFrame])

  const send = useCallback((env: AppMessageEnvelope) => {
    sendRef.current(env)
  }, [])

  return { send, frameRef }
}
