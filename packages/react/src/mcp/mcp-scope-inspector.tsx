import { useState } from 'react'
import { cn, parseScopes } from '@mcp-elements/core'
import type { ScopeDescriptor } from '@mcp-elements/core'

export interface McpScopeInspectorProps {
  /** Space-separated scope string OR pre-parsed array */
  scopes: string | ScopeDescriptor[]
  /** Human-readable descriptions keyed by scope raw string or resource */
  descriptions?: Record<string, string>
  className?: string
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('mcpe-mcp-scope-inspector-chevron', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function McpScopeInspector({ scopes, descriptions = {}, className }: McpScopeInspectorProps) {
  const parsed: ScopeDescriptor[] = typeof scopes === 'string' ? parseScopes(scopes) : scopes
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className={cn('mcpe-mcp-scope-inspector', className)} role="list">
      {parsed.map((s) => {
        const rawKey = s.raw
        const isOpen = openKeys.has(rawKey)
        const description = descriptions[rawKey] ?? descriptions[s.resource] ?? s.description
        const safeKey = rawKey.replace(/[^a-zA-Z0-9]/g, '-')
        const triggerId = `scope-trigger-${safeKey}`
        const bodyId = `scope-body-${safeKey}`

        return (
          <div key={rawKey} className="mcpe-mcp-scope-inspector-item" role="listitem">
            <button
              id={triggerId}
              className="mcpe-mcp-scope-inspector-trigger"
              aria-expanded={isOpen}
              aria-controls={bodyId}
              onClick={() => toggle(rawKey)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="mcpe-mcp-scope-inspector-resource">{s.resource}</span>
                <div className="mcpe-mcp-scope-inspector-perms">
                  {s.permissions.map((p) => (
                    <span key={p} className="mcpe-mcp-scope-inspector-perm" data-perm={p.toLowerCase()}>{p}</span>
                  ))}
                </div>
              </div>
              <ChevronIcon className={isOpen ? 'mcpe-mcp-scope-inspector-chevron-open' : undefined} />
            </button>

            {isOpen && description && (
              <div
                id={bodyId}
                role="region"
                aria-labelledby={triggerId}
                className="mcpe-mcp-scope-inspector-body"
              >
                {description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
