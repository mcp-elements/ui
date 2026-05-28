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
    <div className="py-12">
      <div className="site-container">
        <div className="mb-10 max-w-2xl">
          <p className="site-eyebrow mb-2">Library</p>
          <h1 className="site-h1" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)' }}>
            Components
          </h1>
          <p className="site-lede mt-3">
            38 components for AI applications. Copy-paste into React, Angular, or Vue.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 site-text-subtle"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components…"
              className="w-full rounded-lg py-2 pl-9 pr-10 text-sm outline-none transition-colors duration-150"
              style={{
                backgroundColor: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--site-border-focus)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--site-border)'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 site-text-subtle hover:text-[var(--site-text)] transition-colors"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', ...CATEGORIES] as Filter[]).map((cat) => {
              const isActive = activeFilter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: isActive ? 'var(--site-text)' : 'var(--site-bg-elevated)',
                    color: isActive ? 'var(--site-bg)' : 'var(--site-text-muted)',
                    border: `1px solid ${isActive ? 'var(--site-text)' : 'var(--site-border)'}`,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-lg font-medium site-text">
              No components match &ldquo;{query}&rdquo;
            </p>
            <button
              onClick={() => { setQuery(''); setActiveFilter('All') }}
              className="site-link-accent text-sm underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <ComponentCard key={c.slug} component={c} />)}
          </div>
        )}

        <p className="mt-8 text-sm site-text-subtle">
          {filtered.length} component{filtered.length !== 1 ? 's' : ''}
          {query && ` matching "${query}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
        </p>
      </div>
    </div>
  )
}
