import { describe, it, expect, vi } from 'vitest'
import { encodeEnvelope, decodeEnvelope, createAppBridge } from '../../src/mcp/app-bridge'

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
