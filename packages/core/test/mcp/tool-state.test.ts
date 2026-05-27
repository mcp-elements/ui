import { describe, it, expect } from 'vitest'
import { createToolState } from '../../src/mcp/tool-state'

describe('createToolState', () => {
  it('starts in idle state', () => {
    const s = createToolState()
    expect(s.status).toBe('idle')
  })

  it('transitions idle → pending → running → done', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    expect(s.status).toBe('pending')
    expect(s.tool).toBe('foo')
    s.markRunning()
    expect(s.status).toBe('running')
    s.markDone({ content: [{ type: 'text', text: 'ok' }] })
    expect(s.status).toBe('done')
    expect(s.result).toBeDefined()
  })

  it('transitions running → error', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markError(new Error('boom'))
    expect(s.status).toBe('error')
    expect(s.error?.message).toBe('boom')
  })

  it('allows cancel from pending or running', () => {
    const s1 = createToolState()
    s1.start({ tool: 'foo', args: {} })
    s1.cancel()
    expect(s1.status).toBe('cancelled')

    const s2 = createToolState()
    s2.start({ tool: 'foo', args: {} })
    s2.markRunning()
    s2.cancel()
    expect(s2.status).toBe('cancelled')
  })

  it('reset returns to idle from terminal states', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markError(new Error('x'))
    s.reset()
    expect(s.status).toBe('idle')
    expect(s.tool).toBeUndefined()
    expect(s.result).toBeUndefined()
    expect(s.error).toBeUndefined()
  })

  it('throws on invalid transitions', () => {
    const s = createToolState()
    expect(() => s.markRunning()).toThrow()
    expect(() => s.markDone({ content: [] })).toThrow()
  })

  it('subscribers receive state updates', () => {
    const s = createToolState()
    const updates: string[] = []
    s.subscribe((state) => updates.push(state.status))
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markDone({ content: [] })
    expect(updates).toEqual(['pending', 'running', 'done'])
  })
})
