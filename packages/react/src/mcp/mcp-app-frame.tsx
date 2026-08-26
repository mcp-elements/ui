import { useEffect, useMemo, useState } from 'react'
import { buildAppCsp, buildAppPermissionsAllow, cn } from '@mcp-elements/core'
import type { CallToolResult, UiResourceMeta } from '@mcp-elements/core'
import { useMcpAppBridge } from '../hooks/use-mcp-app-bridge'
import type { UseMcpAppBridgeOptions } from '../hooks/use-mcp-app-bridge'

export interface McpAppFrameProps extends UseMcpAppBridgeOptions {
  /** Raw HTML of the `ui://` resource (from resources/read). Rendered via srcdoc. */
  html?: string
  /** URL to load instead of raw HTML (dedicated-origin or dev setups). */
  src?: string
  /** The resource's `_meta.ui` — drives CSP injection, permissions, and border. */
  resourceMeta?: UiResourceMeta
  /** Complete tool arguments; sent as `ui/notifications/tool-input` after the handshake. */
  toolInput?: Record<string, unknown>
  /** Tool result; sent as `ui/notifications/tool-result` after the handshake. */
  toolResult?: CallToolResult
  /** Grow the iframe to match `ui/notifications/size-changed` from the View. Default true. */
  autoResize?: boolean
  /** Initial/fallback height in pixels */
  height?: number
  /** Iframe sandbox flags. Keep `allow-same-origin` OUT for srcdoc content. */
  sandbox?: string
  title?: string
  className?: string
}

/** Inject the spec-mandated CSP as a <meta> tag unless the HTML already carries one. */
function withCsp(html: string, meta?: UiResourceMeta): string {
  if (/http-equiv=["']Content-Security-Policy["']/i.test(html)) return html
  const tag = `<meta http-equiv="Content-Security-Policy" content="${buildAppCsp(meta?.csp)}">`
  const headMatch = html.match(/<head[^>]*>/i)
  if (headMatch && headMatch.index !== undefined) {
    const at = headMatch.index + headMatch[0].length
    return html.slice(0, at) + tag + html.slice(at)
  }
  return tag + html
}

/**
 * Host-side renderer for MCP Apps (SEP-1865, spec 2026-01-26).
 * Renders a `ui://` resource in a sandboxed iframe and speaks the
 * JSON-RPC-over-postMessage protocol: answers `ui/initialize`, proxies
 * `tools/call`/`resources/read` to your MCP client via the delegate props,
 * and delivers tool input/results as spec notifications.
 */
export function McpAppFrame({
  html,
  src,
  resourceMeta,
  toolInput,
  toolResult,
  autoResize = true,
  height = 480,
  sandbox = 'allow-scripts allow-forms',
  title = 'MCP App',
  className,
  onSizeChanged,
  ...bridgeOptions
}: McpAppFrameProps) {
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)

  const { frameRef, status, sendToolInput, sendToolResult } = useMcpAppBridge({
    ...bridgeOptions,
    onSizeChanged: (size) => {
      if (autoResize) setMeasuredHeight(size.height)
      onSizeChanged?.(size)
    },
  })

  useEffect(() => {
    if (toolInput) sendToolInput(toolInput)
  }, [toolInput, sendToolInput])

  useEffect(() => {
    if (toolResult) sendToolResult(toolResult)
  }, [toolResult, sendToolResult])

  const srcDoc = useMemo(() => (html ? withCsp(html, resourceMeta) : undefined), [html, resourceMeta])
  const allow = buildAppPermissionsAllow(resourceMeta?.permissions)

  return (
    <div
      className={cn(
        'mcpe-mcp-app-frame',
        resourceMeta?.prefersBorder === false && 'mcpe-mcp-app-frame--borderless',
        className
      )}
      data-status={status}
    >
      <iframe
        ref={frameRef}
        {...(srcDoc ? { srcDoc } : { src })}
        sandbox={sandbox as React.IframeHTMLAttributes<HTMLIFrameElement>['sandbox']}
        {...(allow ? { allow } : {})}
        style={{ height: measuredHeight ?? height }}
        title={title}
        aria-label={title}
      />
    </div>
  )
}
