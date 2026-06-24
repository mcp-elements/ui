import { ref, watch, onUnmounted, type Ref } from 'vue'
import { createAppBridge } from '@mcp-elements/core'
import type { AppBridge, AppMessageEnvelope } from '@mcp-elements/core'

export interface UseMcpAppBridgeOptions {
  /** Called for every well-formed envelope received from the iframe. */
  onMessage?: (env: AppMessageEnvelope) => void
}

export interface UseMcpAppBridge {
  /** Bind this to the iframe element (`ref="frameRef"` / `:ref="frameRef"`). */
  frameRef: Ref<HTMLIFrameElement | null>
  /** Post an envelope to the framed MCP App. */
  send: (env: AppMessageEnvelope) => void
}

/**
 * Vue composable that wires a postMessage `createAppBridge()` to an iframe.
 * Establishes the bridge once the iframe is mounted and tears down the
 * window listener + subscription on unmount.
 */
export function useMcpAppBridge(options: UseMcpAppBridgeOptions = {}): UseMcpAppBridge {
  const frameRef = ref<HTMLIFrameElement | null>(null)

  let bridge: AppBridge | null = null
  let unsub: (() => void) | null = null
  let messageHandler: ((e: MessageEvent) => void) | null = null

  const cleanup = () => {
    if (unsub) unsub()
    if (messageHandler) window.removeEventListener('message', messageHandler)
    unsub = null
    messageHandler = null
    bridge = null
  }

  const establish = () => {
    cleanup()
    bridge = createAppBridge({
      postMessage: (env) => frameRef.value?.contentWindow?.postMessage(env, '*'),
    })
    if (options.onMessage) unsub = bridge.onMessage(options.onMessage)
    messageHandler = (e: MessageEvent) => bridge?.receive(e.data)
    window.addEventListener('message', messageHandler)
  }

  watch(frameRef, (el) => {
    if (el) establish()
  })

  onUnmounted(cleanup)

  const send = (env: AppMessageEnvelope) => bridge?.send(env)

  return { frameRef, send }
}
