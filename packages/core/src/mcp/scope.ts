// packages/core/src/mcp/scope.ts
import type { ScopeDescriptor } from './types'

export function parseScope(raw: string): ScopeDescriptor {
  const trimmed = raw.trim()
  const colonIdx = trimmed.indexOf(':')
  if (colonIdx === -1) {
    return { raw, resource: trimmed, permissions: ['access'] }
  }
  const resource = trimmed.slice(0, colonIdx)
  const permsStr = trimmed.slice(colonIdx + 1)
  const permissions = permsStr.split(',').map((p) => p.trim()).filter(Boolean)
  return { raw, resource, permissions: permissions.length > 0 ? permissions : ['access'] }
}

export function parseScopes(scopeString: string): ScopeDescriptor[] {
  return scopeString
    .split(/\s+/)
    .filter(Boolean)
    .map(parseScope)
}
