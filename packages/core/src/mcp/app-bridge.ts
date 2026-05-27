// packages/core/src/mcp/app-bridge.ts

export interface AppMessageEnvelope {
  id: string
  type: string
  payload?: unknown
}

export function encodeEnvelope(env: AppMessageEnvelope): AppMessageEnvelope {
  return { id: env.id, type: env.type, payload: env.payload }
}

export function decodeEnvelope(raw: unknown): AppMessageEnvelope | null {
  if (raw === null || Array.isArray(raw) || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string') return null
  if (typeof o.type !== 'string') return null
  return { id: o.id, type: o.type, payload: o.payload }
}

export interface AppBridgeConfig {
  postMessage: (env: AppMessageEnvelope) => void
}

export interface AppBridge {
  send(env: AppMessageEnvelope): void
  receive(raw: unknown): void
  onMessage(fn: (env: AppMessageEnvelope) => void): () => void
}

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
