import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ComponentEntry } from '@/data/components'

export function ComponentCard({ component }: { component: ComponentEntry }) {
  const { name, slug, category, description, frameworks, isMcp, isNew } = component
  const href = isMcp ? `/mcp/${slug}` : `/components/${slug}`

  return (
    <Link href={href}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-xl p-5 transition-all duration-200"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm" style={{ color: 'var(--site-text)' }}>{name}</span>
            {isNew && (
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}>
                New
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--site-text-subtle)' }}>{category}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{description}</p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          {frameworks.map((fw) => (
            <span key={fw} className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase"
              style={{ backgroundColor: 'var(--site-bg-subtle)', color: 'var(--site-text-subtle)' }}>
              {fw}
            </span>
          ))}
        </div>
        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: 'var(--site-accent)' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ border: '1px solid var(--site-border-focus)' }} />
    </Link>
  )
}
