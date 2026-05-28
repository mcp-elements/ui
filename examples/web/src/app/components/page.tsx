'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { COMPONENTS, CATEGORIES, type ComponentCategory } from '@/data/components'
import { ComponentCard } from '@/components/site/ComponentCard'

type Filter = 'All' | ComponentCategory

export default function ComponentsPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  const filtered = useMemo(
    () =>
      COMPONENTS.filter((c) => {
        const q = query.toLowerCase()
        const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        const matchesFilter = activeFilter === 'All' || c.category === activeFilter
        return matchesSearch && matchesFilter
      }),
    [query, activeFilter],
  )

  return (
    <div className="py-16">
      <div className="site-container">
        <div className="mb-10">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Components
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            38 components for AI applications. Copy-paste into React, Angular, or Vue.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--site-text-subtle)' }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components…"
              className="w-full rounded-lg py-2 pl-9 pr-10 text-sm outline-none"
              style={{
                backgroundColor: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text)',
              }} />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--site-text-subtle)' }} aria-label="Clear">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['All', ...CATEGORIES] as Filter[]).map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: activeFilter === cat ? 'var(--site-accent)' : 'var(--site-bg-elevated)',
                  color: activeFilter === cat ? 'oklch(1 0 0)' : 'var(--site-text-muted)',
                  border: `1px solid ${activeFilter === cat ? 'var(--site-accent)' : 'var(--site-border)'}`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-lg font-medium" style={{ color: 'var(--site-text)' }}>
              No components match &ldquo;{query}&rdquo;
            </p>
            <button onClick={() => { setQuery(''); setActiveFilter('All') }}
              className="text-sm underline underline-offset-2" style={{ color: 'var(--site-accent)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <ComponentCard key={c.slug} component={c} />)}
          </div>
        )}

        <p className="mt-6 text-sm" style={{ color: 'var(--site-text-subtle)' }}>
          {filtered.length} component{filtered.length !== 1 ? 's' : ''}
          {query && ` matching "${query}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
        </p>
      </div>
    </div>
  )
}
