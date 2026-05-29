'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Search,
  X,
  TextCursorInput,
  LayoutGrid,
  Layers,
  Map,
  MessageSquare,
  Sparkles,
  Plug,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { COMPONENTS, CATEGORIES, type ComponentCategory } from '@/data/components'
import { ComponentCard } from '@/components/site/ComponentCard'

type Filter = 'All' | ComponentCategory

const CATEGORY_ICONS: Record<ComponentCategory, LucideIcon> = {
  Form: TextCursorInput,
  Display: LayoutGrid,
  Overlay: Layers,
  Navigation: Map,
  Feedback: MessageSquare,
  AI: Sparkles,
  MCP: Plug,
}

const CATEGORY_BLURBS: Record<ComponentCategory, string> = {
  Form: 'Inputs, selects, switches, counters',
  Display: 'Cards, badges, avatars, progress',
  Overlay: 'Dialogs, drawers, popovers, toasts',
  Navigation: 'Tabs, accordion, dropdown menus',
  Feedback: 'Alerts, chips, status messages',
  AI: 'Chat bubbles, prompts, streaming text',
  MCP: 'Tool calls, OAuth consent, scope inspector',
}

function ComponentsPageInner() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const initialCategory = (params.get('category') as ComponentCategory | null) ?? null
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>(
    initialCategory && (CATEGORIES as readonly string[]).includes(initialCategory)
      ? initialCategory
      : 'All',
  )

  // Sync URL when filter changes
  useEffect(() => {
    const url = activeFilter === 'All' ? pathname : `${pathname}?category=${encodeURIComponent(activeFilter)}`
    router.replace(url, { scroll: false })
  }, [activeFilter, pathname, router])

  const filtered = useMemo(
    () =>
      COMPONENTS.filter((c) => {
        const q = query.toLowerCase()
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        const matchesFilter = activeFilter === 'All' || c.category === activeFilter
        return matchesSearch && matchesFilter
      }),
    [query, activeFilter],
  )

  const showGrouped = activeFilter === 'All' && !query
  const hasResults = filtered.length > 0

  return (
    <div className="py-12">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="site-eyebrow mb-2">Library</p>
          <h1 className="site-h1" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)' }}>
            Components
          </h1>
          <p className="site-lede mt-3">
            <span className="site-text">38 copy-paste components</span> for AI apps —
            31 base, 7 AI, 7 MCP. React, Angular, Vue.
          </p>
        </div>

        {/* Search + filter row */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--site-border-focus)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--site-border)' }}
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

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', ...CATEGORIES] as Filter[]).map((cat) => {
              const isActive = activeFilter === cat
              const isMcp = cat === 'MCP'
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150"
                  style={
                    isActive
                      ? {
                          backgroundColor: isMcp ? 'var(--site-accent)' : 'var(--site-text)',
                          color: isMcp ? 'oklch(1 0 0)' : 'var(--site-bg)',
                          border: `1px solid ${isMcp ? 'var(--site-accent)' : 'var(--site-text)'}`,
                        }
                      : {
                          backgroundColor: 'var(--site-bg-elevated)',
                          color: 'var(--site-text-muted)',
                          border: '1px solid var(--site-border)',
                        }
                  }
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1 text-[10px] opacity-70">
                      {COMPONENTS.filter((c) => c.category === cat).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* No results */}
        {!hasResults && (
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
        )}

        {/* Grouped view — All + no search */}
        {hasResults && showGrouped && (
          <div className="flex flex-col gap-16">
            {CATEGORIES.map((cat) => {
              const items = COMPONENTS.filter((c) => c.category === cat)
              if (items.length === 0) return null
              const Icon = CATEGORY_ICONS[cat]
              const isMcp = cat === 'MCP'
              return (
                <section key={cat} id={cat.toLowerCase()}>
                  <header className="mb-5 flex items-end justify-between gap-4 border-b pb-4"
                    style={{ borderColor: 'var(--site-border)' }}>
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={
                          isMcp
                            ? {
                                background: 'linear-gradient(135deg, var(--site-accent), var(--site-accent-2))',
                                color: 'oklch(1 0 0)',
                                boxShadow: 'inset 0 1px 0 0 oklch(1 0 0 / 0.25)',
                              }
                            : {
                                background: 'var(--site-bg-elevated)',
                                border: '1px solid var(--site-border-strong)',
                                color: 'var(--site-text)',
                              }
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h2 className="text-xl font-semibold site-text" style={{ letterSpacing: '-0.01em' }}>
                            {cat}
                          </h2>
                          <span className="font-mono text-xs site-text-subtle">
                            {items.length} component{items.length !== 1 ? 's' : ''}
                          </span>
                          {isMcp && (
                            <span
                              className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold tracking-widest uppercase"
                              style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
                            >
                              Differentiator
                            </span>
                          )}
                        </div>
                        <p className="text-xs site-text-subtle mt-0.5">{CATEGORY_BLURBS[cat]}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveFilter(cat)}
                      className="site-link-accent hidden text-xs font-medium sm:inline-flex"
                    >
                      Filter to {cat} →
                    </button>
                  </header>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((c) => <ComponentCard key={c.slug} component={c} />)}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* Flat view — when searching or filtered */}
        {hasResults && !showGrouped && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c) => <ComponentCard key={c.slug} component={c} />)}
            </div>
            <p className="mt-8 text-sm site-text-subtle">
              {filtered.length} component{filtered.length !== 1 ? 's' : ''}
              {query && ` matching "${query}"`}
              {activeFilter !== 'All' && ` in ${activeFilter}`}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <Suspense fallback={null}>
      <ComponentsPageInner />
    </Suspense>
  )
}
