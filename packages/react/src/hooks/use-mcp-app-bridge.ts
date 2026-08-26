import { useCallback, useEffect, useRef, useState } from 'react'
import { createAppHost } from '@mcp-elements/core'
import type {
  AppCapabilities,
  AppHost,
  AppHostStatus,
  CallToolResult,
  ContentBlock,
  HostCapabilities,
  HostContext,
  McpUiDisplayMode,
} from '@mcp-elements/core'

export interface UseMcpAppBridgeOptions {
  /** Reported to the View as `hostInfo` during `ui/initialize`. */
  hostInfo?: { name: string; version: string }
  /** Override advertised host capabilities (defaults derive from the delegates). */
  capabilities?: HostCapabilities
  /** UI context shared with the View (theme, containerDimensions, locale...). */
  hostContext?: HostContext
  /** Proxy `tools/call` from the View to your MCP client. */
  callTool?: (name: string, args: Record<string, unknown>) => Promise<CallToolResult>
  /** Proxy `resources/read` from the View to your MCP client. */
  readResource?: (uri: string) => Promise<unknown>
  /** Handle `ui/open-link`. */
  openLink?: (url: string) => void | Promise<void>
  /** Handle `ui/message` — the View asks to post into your chat. */
  onAppMessage?: (params: { role: string; content: { type: 'text'; text: string } }) => void | Promise<void>
  /** Handle `ui/update-model-context`. */
  onUpdateModelContext?: (params: {
    content?: ContentBlock[]
    structuredContent?: Record<string, unknown>
  }) => void | Promise<void>
  /** Handle `ui/request-display-mode`; return the mode actually applied. */
  onRequestDisplayMode?: (mode: McpUiDisplayMode) => McpUiDisplayMode
  /** Handle `ui/notifications/size-changed`. */
  onSizeChanged?: (size: { width: number; height: number }) => void
  /** Handle `notifications/message` log notifications. */
  onLog?: (params: unknown) => void
  /** Called when the `ui/initialize` handshake completes. */
  onInitialized?: (appCapabilities?: AppCapabilities) => void
}

export interface UseMcpAppBridgeReturn {
  /** Assign to <iframe ref={...}> */
  frameRef: React.RefObject<HTMLIFrameElement | null>
  /** Handshake status: idle → initializing → ready → closed */
  status: AppHostStatus
  sendToolInput: (args: Record<string, unknown>) => void
  sendToolInputPartial: (args: Record<string, unknown>) => void
  sendToolResult: (result: CallToolResult) => void
  sendToolCancelled: (reason?: string) => void
  sendHostContextChanged: (context: Partial<HostContext>) => void
  requestTeardown: (reason?: string) => Promise<void>
}

/**
 * React hook implementing the host side of MCP Apps (SEP-1865).
 * Wires a JSON-RPC-over-postMessage AppHost to an iframe rendering a
 * `ui://` resource: <iframe ref={frameRef} srcDoc={html} sandbox="allow-scripts" />
 *
 * Delegates are stored in refs so inline callbacks don't recreate the host.
 * Note: delegate PRESENCE is fixed on mount — capabilities are advertised to
 * the View once, during the handshake.
 */
export function useMcpAppBridge(options: UseMcpAppBridgeOptions = {}): UseMcpAppBridgeReturn {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const hostRef = useRef<AppHost | null>(null)
  const optionsRef = useRef(options)
  const [status, setStatus] = useState<AppHostStatus>('idle')

  // Sync ref each render without adding to effect deps
  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    const opts = optionsRef.current
    const host = createAppHost({
      postMessage: (message) => {
        // srcdoc iframes have an opaque origin, so '*' is the only valid target
        frameRef.current?.contentWindow?.postMessage(message, '*')
      },
      hostInfo: opts.hostInfo,
      capabilities: opts.capabilities,
      hostContext: opts.hostContext,
      callTool: opts.callTool
        ? (name, args) => optionsRef.current.callTool!(name, args)
        : undefined,
      readResource: opts.readResource
        ? (uri) => optionsRef.current.readResource!(uri)
        : undefined,
      openLink: opts.openLink ? (url) => optionsRef.current.openLink!(url) : undefined,
      onAppMessage: opts.onAppMessage
        ? (params) => optionsRef.current.onAppMessage!(params)
        : undefined,
      onUpdateModelContext: opts.onUpdateModelContext
        ? (params) => optionsRef.current.onUpdateModelContext!(params)
        : undefined,
      onRequestDisplayMode: opts.onRequestDisplayMode
        ? (mode) => optionsRef.current.onRequestDisplayMode!(mode)
        : undefined,
      onSizeChanged: (size) => optionsRef.current.onSizeChanged?.(size),
      onLog: opts.onLog ? (params) => optionsRef.current.onLog!(params) : undefined,
      onInitialized: (caps) => optionsRef.current.onInitialized?.(caps),
    })
    hostRef.current = host
    const unsub = host.subscribe(setStatus)

    const handler = (e: MessageEvent) => {
      // Only accept messages from our own iframe
      if (!frameRef.current || e.source !== frameRef.current.contentWindow) return
      host.receive(e.data)
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
      // Best-effort graceful teardown; the component is going away regardless
      host.requestTeardown('unmount').finally(() => host.close())
      unsub()
      hostRef.current = null
    }
  }, [])

  const sendToolInput = useCallback((args: Record<string, unknown>) => {
    hostRef.current?.sendToolInput(args)
  }, [])
  const sendToolInputPartial = useCallback((args: Record<string, unknown>) => {
    hostRef.current?.sendToolInputPartial(args)
  }, [])
  const sendToolResult = useCallback((result: CallToolResult) => {
    hostRef.current?.sendToolResult(result)
  }, [])
  const sendToolCancelled = useCallback((reason?: string) => {
    hostRef.current?.sendToolCancelled(reason)
  }, [])
  const sendHostContextChanged = useCallback((context: Partial<HostContext>) => {
    hostRef.current?.sendHostContextChanged(context)
  }, [])
  const requestTeardown = useCallback((reason?: string) => {
    return hostRef.current?.requestTeardown(reason) ?? Promise.resolve()
  }, [])

  return {
    frameRef,
    status,
    sendToolInput,
    sendToolInputPartial,
    sendToolResult,
    sendToolCancelled,
    sendHostContextChanged,
    requestTeardown,
  }
}
