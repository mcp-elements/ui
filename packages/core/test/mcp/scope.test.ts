import { describe, it, expect } from 'vitest'

describe('mcp/scope (bootstrap)', () => {
  it('module is importable', async () => {
    const mod = await import('../../src/mcp/scope')
    expect(mod).toBeDefined()
  })
})
