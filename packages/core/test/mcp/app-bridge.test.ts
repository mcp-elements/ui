import { describe, it, expect, vi } from 'vitest'
import {
  encodeEnvelope,
  decodeEnvelope,
  createAppBridge,
  createAppHost,
  decodeJsonRpc,
  buildAppCsp,
  buildAppPermissionsAllow,
  APP_PROTOCOL_VERSION,
} from '../../src/mcp/app-bridge'
import type { JsonRpcMessage } from '../../src/mcp/app-bridge'

const tick = () => new Promise((r) => setTimeout(r, 0))

function harness(config: Omit<Parameters<typeof createAppHost>[0], 'postMessage'> = {}) {
  const sent: JsonRpcMessage[] = []
  const host = createAppHost({ postMessage: (m) => sent.push(m), ...config })
  const initialize = () => {
    host.receive({ jsonrpc: '2.0', id: 1, method: 'ui/initialize', params: { appCapabilities: {} } })
    host.receive({ jsonrpc: '2.0', method: 'ui/notifications/initialized' })
  }
  return { sent, host, initialize }
}

describe('decodeJsonRpc', () => {
  it('decodes requests, notifications, and responses', () => {
    expect(decodeJsonRpc({ jsonrpc: '2.0', id: 1, method: 'ping' })).toMatchObject({ method: 'ping' })
    expect(decodeJsonRpc({ jsonrpc: '2.0', method: 'x' })).toMatchObject({ method: 'x' })
    expect(decodeJsonRpc({ jsonrpc: '2.0', id: 'a', result: {} })).toMatchObject({ id: 'a' })
    expect(decodeJsonRpc({ jsonrpc: '2.0', id: null, error: { code: -1, message: 'x' } })).not.toBeNull()
  })

  it('rejects non-JSON-RPC payloads', () => {
    expect(decodeJsonRpc(null)).toBeNull()
    expect(decodeJsonRpc('str')).toBeNull()
    expect(decodeJsonRpc({ id: 1, method: 'ping' })).toBeNull() // missing jsonrpc
    expect(decodeJsonRpc({ jsonrpc: '2.0' })).toBeNull()
  })
})

describe('buildAppCsp', () => {
  it('produces the restrictive default when csp metadata is omitted', () => {
    const csp = buildAppCsp()
    expect(csp).toContain("default-src 'none'")
    expect(csp).toContain("connect-src 'self'")
    expect(csp).toContain("frame-src 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("base-uri 'self'")
  })

  it('includes declared domains in the right directives', () => {
    const csp = buildAppCsp({
      connectDomains: ['https://api.example.com'],
      resourceDomains: ['https://cdn.example.com'],
      frameDomains: ['https://www.youtube.com'],
    })
    expect(csp).toContain("connect-src 'self' https://api.example.com")
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://cdn.example.com")
    expect(csp).toContain('frame-src https://www.youtube.com')
  })
})

describe('buildAppPermissionsAllow', () => {
  it('maps declared permissions to Permission Policy features', () => {
    expect(buildAppPermissionsAllow({ camera: {}, clipboardWrite: {} })).toBe('camera; clipboard-write')
    expect(buildAppPermissionsAllow()).toBe('')
  })
})

describe('createAppHost', () => {
  it('answers ui/initialize with protocol version, host info, and derived capabilities', () => {
    const { sent, host } = harness({
      hostInfo: { name: 'test-host', version: '1.0.0' },
      hostContext: { theme: 'dark' },
      callTool: async () => ({ content: [] }),
    })
    host.receive({
      jsonrpc: '2.0',
      id: 1,
      method: 'ui/initialize',
      params: { appCapabilities: { availableDisplayModes: ['inline'] } },
    })
    expect(host.status).toBe('initializing')
    expect(host.appCapabilities).toEqual({ availableDisplayModes: ['inline'] })
    expect(sent[0]).toMatchObject({
      id: 1,
      result: {
        protocolVersion: APP_PROTOCOL_VERSION,
        hostInfo: { name: 'test-host', version: '1.0.0' },
        hostCapabilities: { serverTools: {} },
        hostContext: { theme: 'dark' },
      },
    })
  })

  it('queues notifications until the initialized notification, then flushes in order', () => {
    const { sent, host } = harness()
    host.sendToolInput({ location: 'SF' })
    host.sendToolResult({ content: [{ type: 'text', text: 'sunny' }] })
    expect(sent).toHaveLength(0)

    host.receive({ jsonrpc: '2.0', id: 1, method: 'ui/initialize', params: {} })
    expect(sent).toHaveLength(1) // only the initialize response so far

    host.receive({ jsonrpc: '2.0', method: 'ui/notifications/initialized' })
    expect(host.status).toBe('ready')
    expect(sent[1]).toMatchObject({ method: 'ui/notifications/tool-input', params: { arguments: { location: 'SF' } } })
    expect(sent[2]).toMatchObject({ method: 'ui/notifications/tool-result' })
  })

  it('proxies tools/call to the delegate and responds with the result', async () => {
    const callTool = vi.fn(async (name: string, args: Record<string, unknown>) => ({
      content: [{ type: 'text' as const, text: `${name}:${JSON.stringify(args)}` }],
    }))
    const { sent, host, initialize } = harness({ callTool })
    initialize()
    host.receive({
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: { name: 'get_weather', arguments: { location: 'SF' } },
    })
    await tick()
    expect(callTool).toHaveBeenCalledWith('get_weather', { location: 'SF' })
    expect(sent.at(-1)).toMatchObject({
      id: 7,
      result: { content: [{ type: 'text', text: 'get_weather:{"location":"SF"}' }] },
    })
  })

  it('responds with a JSON-RPC error when a delegate rejects', async () => {
    const { sent, host, initialize } = harness({
      callTool: async () => { throw new Error('server exploded') },
    })
    initialize()
    host.receive({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'x', arguments: {} } })
    await tick()
    expect(sent.at(-1)).toMatchObject({ id: 8, error: { code: -32000, message: 'server exploded' } })
  })

  it('rejects tools/call when no delegate is configured', () => {
    const { sent, host, initialize } = harness()
    initialize()
    host.receive({ jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'x' } })
    expect(sent.at(-1)).toMatchObject({ id: 9, error: { code: -32000 } })
  })

  it('responds -32601 to unknown request methods', () => {
    const { sent, host, initialize } = harness()
    initialize()
    host.receive({ jsonrpc: '2.0', id: 10, method: 'ui/nonexistent' })
    expect(sent.at(-1)).toMatchObject({ id: 10, error: { code: -32601 } })
  })

  it('answers ping with an empty result', () => {
    const { sent, host, initialize } = harness()
    initialize()
    host.receive({ jsonrpc: '2.0', id: 11, method: 'ping' })
    expect(sent.at(-1)).toMatchObject({ id: 11, result: {} })
  })

  it('routes ui/notifications/size-changed to onSizeChanged', () => {
    const onSizeChanged = vi.fn()
    const { host, initialize } = harness({ onSizeChanged })
    initialize()
    host.receive({ jsonrpc: '2.0', method: 'ui/notifications/size-changed', params: { width: 400, height: 320 } })
    expect(onSizeChanged).toHaveBeenCalledWith({ width: 400, height: 320 })
  })

  it('handles ui/open-link via the delegate', async () => {
    const openLink = vi.fn()
    const { sent, host, initialize } = harness({ openLink })
    initialize()
    host.receive({ jsonrpc: '2.0', id: 12, method: 'ui/open-link', params: { url: 'https://example.com' } })
    await tick()
    expect(openLink).toHaveBeenCalledWith('https://example.com')
    expect(sent.at(-1)).toMatchObject({ id: 12, result: {} })
  })

  it('answers ui/request-display-mode from the delegate, defaulting to the current mode', () => {
    const { sent, host, initialize } = harness({
      hostContext: { displayMode: 'inline' },
      onRequestDisplayMode: (mode) => (mode === 'fullscreen' ? 'fullscreen' : 'inline'),
    })
    initialize()
    host.receive({ jsonrpc: '2.0', id: 13, method: 'ui/request-display-mode', params: { mode: 'fullscreen' } })
    expect(sent.at(-1)).toMatchObject({ id: 13, result: { mode: 'fullscreen' } })

    const noDelegate = harness({ hostContext: { displayMode: 'inline' } })
    noDelegate.initialize()
    noDelegate.host.receive({ jsonrpc: '2.0', id: 14, method: 'ui/request-display-mode', params: { mode: 'pip' } })
    expect(noDelegate.sent.at(-1)).toMatchObject({ id: 14, result: { mode: 'inline' } })
  })

  it('suppresses tool-input-partial after the complete tool-input is sent', () => {
    const { sent, host, initialize } = harness()
    initialize()
    host.sendToolInput({ a: 1 })
    host.sendToolInputPartial({ a: 1, b: 2 })
    const methods = sent.filter((m) => 'method' in m).map((m) => (m as { method: string }).method)
    expect(methods).toContain('ui/notifications/tool-input')
    expect(methods).not.toContain('ui/notifications/tool-input-partial')
  })

  it('requestTeardown sends the request and resolves on the View response', async () => {
    const { sent, host, initialize } = harness()
    initialize()
    const done = vi.fn()
    const p = host.requestTeardown('user closed').then(done)
    const request = sent.at(-1) as { id: string; method: string }
    expect(request).toMatchObject({ method: 'ui/resource-teardown', params: { reason: 'user closed' } })
    host.receive({ jsonrpc: '2.0', id: request.id, result: {} })
    await p
    expect(done).toHaveBeenCalled()
  })

  it('requestTeardown resolves via timeout when the View never responds', async () => {
    vi.useFakeTimers()
    const { host, initialize } = harness()
    initialize()
    const done = vi.fn()
    const p = host.requestTeardown('unmount', { timeoutMs: 50 }).then(done)
    vi.advanceTimersByTime(60)
    await p
    expect(done).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('ignores all messages after close()', () => {
    const { sent, host, initialize } = harness()
    initialize()
    host.close()
    const before = sent.length
    host.receive({ jsonrpc: '2.0', id: 99, method: 'ping' })
    expect(sent).toHaveLength(before)
    expect(host.status).toBe('closed')
  })

  it('notifies status subscribers across the lifecycle', () => {
    const { host } = harness()
    const seen: string[] = []
    host.subscribe((s) => seen.push(s))
    host.receive({ jsonrpc: '2.0', id: 1, method: 'ui/initialize', params: {} })
    host.receive({ jsonrpc: '2.0', method: 'ui/notifications/initialized' })
    host.close()
    expect(seen).toEqual(['initializing', 'ready', 'closed'])
  })
})

describe('encodeEnvelope', () => {
  it('produces a string-keyed envelope with id, type, payload', () => {
    const env = encodeEnvelope({ id: '1', type: 'host:notify', payload: { foo: 'bar' } })
    expect(env).toEqual({ id: '1', type: 'host:notify', payload: { foo: 'bar' } })
  })
})

describe('decodeEnvelope', () => {
  it('returns the envelope if shape is valid', () => {
    expect(decodeEnvelope({ id: 'x', type: 'app:event', payload: {} })).toEqual({
      id: 'x',
      type: 'app:event',
      payload: {},
    })
  })

  it('returns null for invalid payloads', () => {
    expect(decodeEnvelope(null)).toBeNull()
    expect(decodeEnvelope({ id: 1 })).toBeNull() // id must be string
    expect(decodeEnvelope({ id: 'x', type: 123 })).toBeNull()
    expect(decodeEnvelope('not-an-object')).toBeNull()
  })
})

describe('createAppBridge', () => {
  it('calls injected postMessage with encoded envelope on send()', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    bridge.send({ id: 'm1', type: 'host:notify', payload: { ok: true } })
    expect(post).toHaveBeenCalledWith({ id: 'm1', type: 'host:notify', payload: { ok: true } })
  })

  it('dispatches to listeners on incoming valid envelope', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    const received: any[] = []
    bridge.onMessage((env) => received.push(env))
    bridge.receive({ id: '1', type: 'app:event', payload: { x: 1 } })
    expect(received).toEqual([{ id: '1', type: 'app:event', payload: { x: 1 } }])
  })

  it('ignores invalid incoming payloads', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    const received: any[] = []
    bridge.onMessage((env) => received.push(env))
    bridge.receive('garbage')
    bridge.receive({ id: 1 })
    expect(received).toEqual([])
  })

  it('onMessage unsubscribe stops dispatch', () => {
    const bridge = createAppBridge({ postMessage: vi.fn() })
    const received: any[] = []
    const unsub = bridge.onMessage((env) => received.push(env))
    bridge.receive({ id: '1', type: 'app:event', payload: {} })
    unsub()
    bridge.receive({ id: '2', type: 'app:event', payload: {} })
    expect(received).toHaveLength(1)
  })

  it('a throwing onMessage subscriber does not prevent other subscribers from receiving the envelope', () => {
    const bridge = createAppBridge({ postMessage: vi.fn() })
    const received: unknown[] = []
    bridge.onMessage(() => { throw new Error('bad subscriber') })
    bridge.onMessage((env) => received.push(env))
    expect(() =>
      bridge.receive({ id: '1', type: 'app:event', payload: {} })
    ).toThrow('bad subscriber')
    expect(received).toHaveLength(1)
  })
})
