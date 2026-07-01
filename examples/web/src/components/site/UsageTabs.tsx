'use client'

import { useState, type ReactNode } from 'react'

export interface UsageTab {
  framework: string
  label: string
  /** Server-rendered CodeBlock for this framework. */
  node: ReactNode
}

/**
 * Framework switcher for the doc-page Usage section. All frameworks' code is
 * server-rendered (Shiki) and passed in as `node`s; this only toggles which
 * one is visible, so highlighting stays server-side.
 */
export function UsageTabs({ tabs }: { tabs: UsageTab[] }) {
  const [active, setActive] = useState(tabs[0]?.framework)

  return (
    <div>
      <div
        role="tablist"
        aria-label="Framework"
        className="mb-3 inline-flex rounded-lg p-1 gap-1"
        style={{
          backgroundColor: 'var(--site-bg-elevated)',
          border: '1px solid var(--site-border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {tabs.map((t) => {
          const isActive = active === t.framework
          return (
            <button
              key={t.framework}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.framework)}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-150"
              style={{
                backgroundColor: isActive ? 'var(--site-bg)' : 'transparent',
                color: isActive ? 'var(--site-text)' : 'var(--site-text-muted)',
                boxShadow: isActive ? 'var(--shadow-xs)' : undefined,
                border: isActive ? '1px solid var(--site-border)' : '1px solid transparent',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {tabs.map((t) => (
        <div key={t.framework} hidden={active !== t.framework}>
          {t.node}
        </div>
      ))}
    </div>
  )
}
