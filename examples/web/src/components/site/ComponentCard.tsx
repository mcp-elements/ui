import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ComponentEntry } from '@/data/components'

export function ComponentCard({ component }: { component: ComponentEntry }) {
  const { name, slug, category, description, frameworks, isMcp, isNew } = component
  const href = isMcp ? `/mcp/${slug}` : `/components/${slug}`

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 transition-all duration-200"
      style={{
        backgroundColor: 'var(--site-bg-elevated)',
        border: '1px solid var(--site-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--site-border-strong)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--site-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm site-text">{name}</span>
            {isNew && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
                style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
              >
                NEW
              </span>
            )}
            {isMcp && (
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
                style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
              >
                MCP
              </span>
            )}
          </div>
          <span className="text-xs site-text-subtle">{category}</span>
        </div>
      </div>

      <p className="site-body-sm">{description}</p>

      <div className="mt-auto flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          {frameworks.map((fw) => (
            <span
              key={fw}
              className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
              style={{ backgroundColor: 'var(--site-bg-subtle)', color: 'var(--site-text-subtle)' }}
            >
              {fw}
            </span>
          ))}
        </div>
        <ArrowRight
          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 site-text-accent"
        />
      </div>
    </Link>
  )
}
