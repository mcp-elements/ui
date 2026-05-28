import { useEffect, useRef, useCallback } from 'react'
import { cn, createAppBridge } from '@mcp-elements/core'
import type { AppMessageEnvelope } from '@mcp-elements/core'

export interface McpAppFrameProps {
  /** URL of the MCP App to load */
  src: string
  /** Called when the app sends a message via postMessage */
  onMessage?: (envelope: AppMessageEnvelope) => void
  /** Height of the iframe in pixels */
  height?: number
  /** Additional iframe sandbox flags */
  sandbox?: string
  className?: string
}

export function McpAppFrame({
  src,
  onMessage,
  height = 480,
  sandbox = 'allow-scripts allow-same-origin',
  className,
}: McpAppFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  const postToFrame = useCallback((msg: AppMessageEnvelope) => {
    frameRef.current?.contentWindow?.postMessage(msg, '*')
  }, [])

  useEffect(() => {
    if (!onMessage) return

    // createAppBridge only accepts postMessage in config;
    // listeners are registered via bridge.onMessage(fn)
    const bridge = createAppBridge({ postMessage: postToFrame })
    const unsub = bridge.onMessage(onMessage)

    const handler = (e: MessageEvent) => {
      bridge.receive(e.data)
    }

    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
      unsub()
    }
  }, [onMessage, postToFrame])

  return (
    <div className={cn('mcpe-mcp-app-frame', className)}>
      <iframe
        ref={frameRef}
        src={src}
        sandbox={sandbox as React.IframeHTMLAttributes<HTMLIFrameElement>['sandbox']}
        style={{ height }}
        title="MCP App"
        aria-label="MCP App frame"
      />
    </div>
  )
}
