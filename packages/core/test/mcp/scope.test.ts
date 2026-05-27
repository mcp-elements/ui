import { describe, it, expect } from 'vitest'
import { parseScope, parseScopes } from '../../src/mcp/scope'

describe('parseScope', () => {
  it('parses resource:permission', () => {
    expect(parseScope('user.email:read')).toEqual({
      raw: 'user.email:read',
      resource: 'user.email',
      permissions: ['read'],
    })
  })

  it('parses comma-separated permissions', () => {
    expect(parseScope('repo:read,write')).toEqual({
      raw: 'repo:read,write',
      resource: 'repo',
      permissions: ['read', 'write'],
    })
  })

  it('treats bare strings as permission "access"', () => {
    expect(parseScope('admin')).toEqual({
      raw: 'admin',
      resource: 'admin',
      permissions: ['access'],
    })
  })

  it('trims whitespace in permissions', () => {
    expect(parseScope('repo:read, write , delete')).toEqual({
      raw: 'repo:read, write , delete',
      resource: 'repo',
      permissions: ['read', 'write', 'delete'],
    })
  })
})

describe('parseScopes (space-delimited list)', () => {
  it('parses space-separated scope list', () => {
    const scopes = parseScopes('user.email:read repo:read,write')
    expect(scopes).toHaveLength(2)
    expect(scopes[0].resource).toBe('user.email')
    expect(scopes[1].resource).toBe('repo')
  })

  it('returns empty array for empty input', () => {
    expect(parseScopes('')).toEqual([])
    expect(parseScopes('  ')).toEqual([])
  })
})
