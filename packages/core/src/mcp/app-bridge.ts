// packages/core/src/mcp/app-bridge.ts
// Host-side implementation of MCP Apps (SEP-1865), spec version 2026-01-26.
// The host embeds a View (iframe) and speaks JSON-RPC 2.0 over postMessage.
import type { CallToolResult, ContentBlock, Tool } from './types'

export const APP_PROTOCOL_VERSION = '2026-01-26'
export const APP_RESOURCE_MIME_TYPE = 'text/html;profile=mcp-app'
export const APP_EXTENSION_ID = 'io.modelcontextprotocol/ui'

// ---------------------------------------------------------------------------
// JSON-RPC 2.0 message shapes (the MCP Apps transport dialect)
// ---------------------------------------------------------------------------

export type JsonRpcId = string | number

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: JsonRpcId
  method: string
  params?: unknown
}

export interface JsonRpcNotification {
  jsonrpc: '2.0'
  method: string
  params?: unknown
}

export interface JsonRpcSuccess {
  jsonrpc: '2.0'
  id: JsonRpcId
  result: unknown
}

export interface JsonRpcFailure {
  jsonrpc: '2.0'
  id: JsonRpcId | null
  error: { code: number; message: string; data?: unknown }
}

export type JsonRpcMessage = JsonRpcRequest | JsonRpcNotification | JsonRpcSuccess | JsonRpcFailure

export function decodeJsonRpc(raw: unknown): JsonRpcMessage | null {
  if (raw === null || Array.isArray(raw) || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (o.jsonrpc !== '2.0') return null
  const hasId = typeof o.id === 'string' || typeof o.id === 'number'
  if (typeof o.method === 'string') {
    return hasId ? (o as unknown as JsonRpcRequest) : (o as unknown as JsonRpcNotification)
  }
  if ('result' in o && hasId) return o as unknown as JsonRpcSuccess
  if ('error' in o && (hasId || o.id === null)) return o as unknown as JsonRpcFailure
  return null
}

// ---------------------------------------------------------------------------
// SEP-1865 metadata types
// ---------------------------------------------------------------------------

/** CSP configuration a UI resource declares in `_meta.ui.csp`. */
export interface McpUiResourceCsp {
  connectDomains?: string[]
  resourceDomains?: string[]
  frameDomains?: string[]
  baseUriDomains?: string[]
}

/** Sandbox permissions a UI resource requests in `_meta.ui.permissions`. */
export interface McpUiPermissions {
  camera?: object
  microphone?: object
  geolocation?: object
  clipboardWrite?: object
}

/** `_meta.ui` on a UI resource (`ui://` scheme, mimeType text/html;profile=mcp-app). */
export interface UiResourceMeta {
  csp?: McpUiResourceCsp
  permissions?: McpUiPermissions
  domain?: string
  prefersBorder?: boolean
}

/** `_meta.ui` on a tool that renders through a UI resource. */
export interface McpUiToolMeta {
  resourceUri?: string
  visibility?: Array<'model' | 'app'>
}

export type McpUiDisplayMode = 'inline' | 'fullscreen' | 'pip'

/** Capabilities the View declares in its `ui/initialize` request. */
export interface AppCapabilities {
  experimental?: object
  tools?: { listChanged?: boolean }
  availableDisplayModes?: McpUiDisplayMode[]
}

/** Capabilities the host returns from `ui/initialize`. */
export interface HostCapabilities {
  experimental?: object
  openLinks?: object
  serverTools?: { listChanged?: boolean }
  serverResources?: { listChanged?: boolean }
  logging?: object
  sandbox?: {
    permissions?: McpUiPermissions
    csp?: McpUiResourceCsp
  }
}

/** UI-specific context the host shares with the View (`hostContext`). */
export interface HostContext {
  toolInfo?: { id?: JsonRpcId; tool: Tool }
  theme?: 'light' | 'dark'
  styles?: {
    variables?: Record<string, string | undefined>
    css?: { fonts?: string }
  }
  displayMode?: McpUiDisplayMode
  availableDisplayModes?: McpUiDisplayMode[]
  containerDimensions?: {
    height?: number
    maxHeight?: number
    width?: number
    maxWidth?: number
  }
  locale?: string
  timeZone?: string
  userAgent?: string
  platform?: 'web' | 'desktop' | 'mobile'
  deviceCapabilities?: { touch?: boolean; hover?: boolean }
  safeAreaInsets?: { top: number; right: number; bottom: number; left: number }
}

// ---------------------------------------------------------------------------
// CSP / Permission-Policy construction (spec § Security Implications)
// ---------------------------------------------------------------------------

/**
 * Build the CSP value for a UI resource from its declared `_meta.ui.csp`.
 * Omitted metadata yields the spec's restrictive default (no external access).
 */
export function buildAppCsp(csp?: McpUiResourceCsp): string {
  const resources = csp?.resourceDomains?.join(' ') ?? ''
  const connects = csp?.connectDomains?.join(' ') ?? ''
  const frames = csp?.frameDomains?.join(' ') ?? "'none'"
  const baseUris = csp?.baseUriDomains?.join(' ') ?? "'self'"
  return [
    "default-src 'none'",
    `script-src 'self' 'unsafe-inline' ${resources}`.trimEnd(),
    `style-src 'self' 'unsafe-inline' ${resources}`.trimEnd(),
    `connect-src 'self' ${connects}`.trimEnd(),
    `img-src 'self' data: ${resources}`.trimEnd(),
    `font-src 'self' ${resources}`.trimEnd(),
    `media-src 'self' data: ${resources}`.trimEnd(),
    `frame-src ${frames}`,
    "object-src 'none'",
    `base-uri ${baseUris}`,
  ].join('; ')
}

/** Build the iframe `allow` attribute from declared `_meta.ui.permissions`. */
export function buildAppPermissionsAllow(permissions?: McpUiPermissions): string {
  const features: string[] = []
  if (permissions?.camera) features.push('camera')
  if (permissions?.microphone) features.push('microphone')
  if (permissions?.geolocation) features.push('geolocation')
  if (permissions?.clipboardWrite) features.push('clipboard-write')
  return features.join('; ')
}

// ---------------------------------------------------------------------------
// App host — the host side of the View <-> Host JSON-RPC channel
// ---------------------------------------------------------------------------

export type AppHostStatus = 'idle' | 'initializing' | 'ready' | 'closed'

export interface AppHostConfig {
  /** Deliver a JSON-RPC message to the View (e.g. iframe.contentWindow.postMessage). */
  postMessage: (message: JsonRpcMessage) => void
  /** Reported in the `ui/initialize` result as `hostInfo`. */
  hostInfo?: { name: string; version: string }
  /** Override the advertised host capabilities (defaults derive from the delegates below). */
  capabilities?: HostCapabilities
  /** UI context shared with the View in the `ui/initialize` result. */
  hostContext?: HostContext
  /** Proxy a `tools/call` from the View to your MCP client. Omit to reject tool calls. */
  callTool?: (name: string, args: Record<string, unknown>) => Promise<CallToolResult>
  /** Proxy a `resources/read` from the View to your MCP client. Omit to reject reads. */
  readResource?: (uri: string) => Promise<unknown>
  /** Handle `ui/open-link`. Omit to reject link opening. */
  openLink?: (url: string) => void | Promise<void>
  /** Handle `ui/message` — the View asks to post a message into your chat. */
  onAppMessage?: (params: { role: string; content: { type: 'text'; text: string } }) => void | Promise<void>
  /** Handle `ui/update-model-context`. Each call overwrites the View's previous context. */
  onUpdateModelContext?: (params: {
    content?: ContentBlock[]
    structuredContent?: Record<string, unknown>
  }) => void | Promise<void>
  /** Handle `ui/request-display-mode`; return the mode actually applied. */
  onRequestDisplayMode?: (mode: McpUiDisplayMode) => McpUiDisplayMode
  /** Handle `ui/notifications/size-changed` (auto-resize the iframe). */
  onSizeChanged?: (size: { width: number; height: number }) => void
  /** Handle `notifications/message` log notifications from the View. */
  onLog?: (params: unknown) => void
  /** Called when the View completes the `ui/initialize` -> `initialized` handshake. */
  onInitialized?: (appCapabilities?: AppCapabilities) => void
}

export interface AppHost {
  readonly status: AppHostStatus
  /** Capabilities the View declared during `ui/initialize`, once received. */
  readonly appCapabilities?: AppCapabilities
  /** Feed every postMessage payload from the View's iframe into here. */
  receive(raw: unknown): void
  /** Notify the View of the complete tool arguments (queued until the handshake finishes). */
  sendToolInput(args: Record<string, unknown>): void
  /** Stream best-effort partial tool arguments. Stop once sendToolInput is called. */
  sendToolInputPartial(args: Record<string, unknown>): void
  /** Notify the View of the tool result (queued until the handshake finishes). */
  sendToolResult(result: CallToolResult): void
  /** Notify the View the tool call was cancelled. */
  sendToolCancelled(reason?: string): void
  /** Push partial host-context updates (theme change, resize, display mode...). */
  sendHostContextChanged(context: Partial<HostContext>): void
  /** Ask the View to wind down before removal; resolves on response or timeout. */
  requestTeardown(reason?: string, opts?: { timeoutMs?: number }): Promise<void>
  subscribe(fn: (status: AppHostStatus) => void): () => void
  /** Stop processing messages. Call after teardown / on unmount. */
  close(): void
}

export function createAppHost(config: AppHostConfig): AppHost {
  let status: AppHostStatus = 'idle'
  let appCapabilities: AppCapabilities | undefined
  let toolInputSent = false
  let nextOutgoingId = 1
  const listeners = new Set<(s: AppHostStatus) => void>()
  const queued: JsonRpcNotification[] = []
  const pendingOutgoing = new Map<JsonRpcId, (result: unknown) => void>()

  function setStatus(next: AppHostStatus) {
    if (status === next) return
    status = next
    let firstError: unknown
    for (const fn of listeners) {
      try { fn(status) } catch (e) { if (firstError === undefined) firstError = e }
    }
    if (firstError !== undefined) throw firstError
  }

  function notify(method: string, params: unknown) {
    const message: JsonRpcNotification = { jsonrpc: '2.0', method, params }
    if (status !== 'ready') {
      queued.push(message)
      return
    }
    config.postMessage(message)
  }

  function respond(id: JsonRpcId, result: unknown) {
    config.postMessage({ jsonrpc: '2.0', id, result })
  }

  function respondError(id: JsonRpcId, code: number, message: string) {
    config.postMessage({ jsonrpc: '2.0', id, error: { code, message } })
  }

  function settle(id: JsonRpcId, work: Promise<unknown>) {
    work.then(
      (result) => respond(id, result ?? {}),
      (e) => respondError(id, -32000, e instanceof Error ? e.message : String(e))
    )
  }

  function defaultCapabilities(): HostCapabilities {
    const caps: HostCapabilities = {}
    if (config.callTool) caps.serverTools = {}
    if (config.readResource) caps.serverResources = {}
    if (config.openLink) caps.openLinks = {}
    if (config.onLog) caps.logging = {}
    return caps
  }

  function handleRequest(request: JsonRpcRequest) {
    const params = (request.params ?? {}) as Record<string, unknown>
    switch (request.method) {
      case 'ui/initialize': {
        appCapabilities = params.appCapabilities as AppCapabilities | undefined
        setStatus('initializing')
        respond(request.id, {
          protocolVersion: APP_PROTOCOL_VERSION,
          hostInfo: config.hostInfo ?? { name: 'mcp-elements', version: '0.0.0' },
          hostCapabilities: config.capabilities ?? defaultCapabilities(),
          hostContext: config.hostContext ?? {},
        })
        return
      }
      case 'ping':
        respond(request.id, {})
        return
      case 'tools/call': {
        if (!config.callTool) {
          respondError(request.id, -32000, 'Tool calls are not supported by this host')
          return
        }
        settle(
          request.id,
          config.callTool(String(params.name ?? ''), (params.arguments ?? {}) as Record<string, unknown>)
        )
        return
      }
      case 'resources/read': {
        if (!config.readResource) {
          respondError(request.id, -32000, 'Resource reads are not supported by this host')
          return
        }
        settle(request.id, config.readResource(String(params.uri ?? '')))
        return
      }
      case 'ui/open-link': {
        if (!config.openLink) {
          respondError(request.id, -32000, 'Link opening is not supported by this host')
          return
        }
        settle(request.id, Promise.resolve(config.openLink(String(params.url ?? ''))).then(() => ({})))
        return
      }
      case 'ui/message': {
        if (!config.onAppMessage) {
          respondError(request.id, -32000, 'Messages are not supported by this host')
          return
        }
        settle(
          request.id,
          Promise.resolve(
            config.onAppMessage(params as { role: string; content: { type: 'text'; text: string } })
          ).then(() => ({}))
        )
        return
      }
      case 'ui/update-model-context': {
        if (!config.onUpdateModelContext) {
          respondError(request.id, -32000, 'Model-context updates are not supported by this host')
          return
        }
        settle(
          request.id,
          Promise.resolve(
            config.onUpdateModelContext(
              params as { content?: ContentBlock[]; structuredContent?: Record<string, unknown> }
            )
          ).then(() => ({}))
        )
        return
      }
      case 'ui/request-display-mode': {
        const requested = params.mode as McpUiDisplayMode
        const mode =
          config.onRequestDisplayMode?.(requested) ?? config.hostContext?.displayMode ?? 'inline'
        respond(request.id, { mode })
        return
      }
      default:
        respondError(request.id, -32601, `Method not found: ${request.method}`)
    }
  }

  function handleNotification(notification: JsonRpcNotification) {
    switch (notification.method) {
      case 'ui/notifications/initialized': {
        setStatus('ready')
        const flush = queued.splice(0, queued.length)
        for (const message of flush) config.postMessage(message)
        config.onInitialized?.(appCapabilities)
        return
      }
      case 'ui/notifications/size-changed': {
        const params = (notification.params ?? {}) as { width?: number; height?: number }
        if (typeof params.width === 'number' && typeof params.height === 'number') {
          config.onSizeChanged?.({ width: params.width, height: params.height })
        }
        return
      }
      case 'notifications/message':
        config.onLog?.(notification.params)
        return
      default:
        // Unknown notifications are ignored per JSON-RPC semantics.
    }
  }

  return {
    get status() { return status },
    get appCapabilities() { return appCapabilities },
    receive(raw) {
      if (status === 'closed') return
      const message = decodeJsonRpc(raw)
      if (!message) return
      if ('method' in message) {
        if ('id' in message) handleRequest(message as JsonRpcRequest)
        else handleNotification(message as JsonRpcNotification)
        return
      }
      // Response to a host-initiated request (e.g. ui/resource-teardown)
      const id = (message as JsonRpcSuccess | JsonRpcFailure).id
      if (id === null || id === undefined) return
      const resolve = pendingOutgoing.get(id)
      if (resolve) {
        pendingOutgoing.delete(id)
        resolve('result' in message ? message.result : undefined)
      }
    },
    sendToolInput(args) {
      toolInputSent = true
      notify('ui/notifications/tool-input', { arguments: args })
    },
    sendToolInputPartial(args) {
      if (toolInputSent) return
      notify('ui/notifications/tool-input-partial', { arguments: args })
    },
    sendToolResult(result) {
      notify('ui/notifications/tool-result', result)
    },
    sendToolCancelled(reason = 'cancelled') {
      notify('ui/notifications/tool-cancelled', { reason })
    },
    sendHostContextChanged(context) {
      notify('ui/notifications/host-context-changed', context)
    },
    requestTeardown(reason = 'teardown', opts = {}) {
      if (status !== 'ready') return Promise.resolve()
      const id = `host-${nextOutgoingId++}`
      return new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          pendingOutgoing.delete(id)
          resolve()
        }, opts.timeoutMs ?? 2000)
        pendingOutgoing.set(id, () => {
          clearTimeout(timer)
          resolve()
        })
        config.postMessage({ jsonrpc: '2.0', id, method: 'ui/resource-teardown', params: { reason } })
      })
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    close() {
      setStatus('closed')
      queued.length = 0
      pendingOutgoing.clear()
    },
  }
}

// ---------------------------------------------------------------------------
// Legacy envelope bridge (pre-SEP preview API)
// ---------------------------------------------------------------------------

/** @deprecated Pre-SEP-1865 message shape. Use the JSON-RPC types with createAppHost. */
export interface AppMessageEnvelope {
  id: string
  type: string
  payload?: unknown
}

/** @deprecated Pre-SEP-1865 API. Use createAppHost. */
export function encodeEnvelope(env: AppMessageEnvelope): AppMessageEnvelope {
  return { id: env.id, type: env.type, payload: env.payload }
}

/** @deprecated Pre-SEP-1865 API. Use createAppHost. */
export function decodeEnvelope(raw: unknown): AppMessageEnvelope | null {
  if (raw === null || Array.isArray(raw) || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string') return null
  if (typeof o.type !== 'string') return null
  return { id: o.id, type: o.type, payload: o.payload }
}

/** @deprecated Pre-SEP-1865 API. Use createAppHost. */
export interface AppBridgeConfig {
  postMessage: (env: AppMessageEnvelope) => void
}

/** @deprecated Pre-SEP-1865 API. Use createAppHost. */
export interface AppBridge {
  send(env: AppMessageEnvelope): void
  receive(raw: unknown): void
  onMessage(fn: (env: AppMessageEnvelope) => void): () => void
}

/** @deprecated Pre-SEP-1865 API. Use createAppHost. */
export function createAppBridge(config: AppBridgeConfig): AppBridge {
  const listeners = new Set<(env: AppMessageEnvelope) => void>()

  function dispatch(env: AppMessageEnvelope) {
    let firstError: unknown
    for (const fn of listeners) {
      try { fn(env) } catch (e) { if (firstError === undefined) firstError = e }
    }
    if (firstError !== undefined) throw firstError
  }

  return {
    send(env) {
      config.postMessage(encodeEnvelope(env))
    },
    receive(raw) {
      const env = decodeEnvelope(raw)
      if (!env) return
      dispatch(env)
    },
    onMessage(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
