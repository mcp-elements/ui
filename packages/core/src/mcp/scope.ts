// packages/core/src/mcp/scope.ts
import type { ScopeDescriptor } from './types'

export function parseScope(raw: string): ScopeDescriptor {
  const trimmed = raw.trim()
  if (!trimmed.includes(':')) {
    return { raw, resource: trimmed, permissions: ['access'] }
  }
  const [resource, permsStr] = trimmed.split(':', 2) as [string, string]
  const permissions = permsStr.split(',').map((p) => p.trim()).filter(Boolean)
  return { raw, resource, permissions }
}

export function parseScopes(scopeString: string): ScopeDescriptor[] {
  return scopeString
    .split(/\s+/)
    .filter(Boolean)
    .map(parseScope)
}
