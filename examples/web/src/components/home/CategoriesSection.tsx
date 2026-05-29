import Link from 'next/link'
import {
  TextCursorInput,
  LayoutGrid,
  Layers,
  Map,
  MessageSquare,
  Sparkles,
  Plug,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { COMPONENTS, type ComponentCategory } from '@/data/components'

type Bucket = {
  category: ComponentCategory
  icon: LucideIcon
  blurb: string
  isAccent?: boolean
}

const BUCKETS: Bucket[] = [
  { category: 'Form',       icon: TextCursorInput, blurb: 'Inputs, selects, switches, counters' },
  { category: 'Display',    icon: LayoutGrid,      blurb: 'Cards, badges, avatars, progress' },
  { category: 'Overlay',    icon: Layers,          blurb: 'Dialogs, drawers, popovers, toasts' },
  { category: 'Navigation', icon: Map,             blurb: 'Tabs, accordion, dropdown menus' },
  { category: 'Feedback',   icon: MessageSquare,   blurb: 'Alerts, chips, status messages' },
  { category: 'AI',         icon: Sparkles,        blurb: 'Chat bubbles, prompts, streaming text', isAccent: false },
  { category: 'MCP',        icon: Plug,            blurb: 'Tool calls, OAuth consent, scope inspector', isAccent: true },
]

export function CategoriesSection() {
  return (
    <section className="site-section-tight site-section-divider relative overflow-hidden">
      <div className="site-container relative">
        <div className="mb-10 max-w-2xl">
          <p className="site-eyebrow mb-3">The catalog</p>
          <h2 className="site-h2">
            Seven categories.{' '}
            <span className="site-text-muted">One design system.</span>
          </h2>
          <p className="site-lede mt-4">
            Drop into any layer of your stack — primitives, chat surface, or the MCP-specific bits nobody else ships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {BUCKETS.map(({ category, icon: Icon, blurb, isAccent }) => {
            const items = COMPONENTS.filter((c) => c.category === category)
            const count = items.length
            const preview = items.slice(0, 4).map((c) => c.name).join(', ')

            return (
              <Link
                key={category}
                href={`/components?category=${encodeURIComponent(category)}`}
                className={`group site-card relative flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 ${
                  isAccent ? 'ring-1' : ''
                }`}
                style={isAccent ? {
                  boxShadow: 'var(--shadow-glow), var(--shadow-sm)',
                  ['--tw-ring-color' as any]: 'var(--site-accent)',
                  background: 'color-mix(in oklab, var(--site-accent-glow) 25%, var(--site-bg-elevated))',
                } : undefined}
              >
                {/* Header row — icon + category + count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={
                        isAccent
                          ? {
                              background: 'linear-gradient(135deg, var(--site-accent), var(--site-accent-2))',
                              color: 'oklch(1 0 0)',
                              boxShadow: 'inset 0 1px 0 0 oklch(1 0 0 / 0.25)',
                            }
                          : {
                              background: 'var(--site-bg)',
                              color: 'var(--site-text)',
                              border: '1px solid var(--site-border-strong)',
                            }
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`text-sm font-semibold ${isAccent ? 'site-text' : 'site-text'}`}>
                      {category}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[11px] font-semibold"
                    style={{ color: isAccent ? 'var(--site-accent)' : 'var(--site-text-subtle)' }}
                  >
                    {count}
                  </span>
                </div>

                {/* Blurb */}
                <p className="text-sm leading-snug site-text-muted -mt-1">{blurb}</p>

                {/* Preview component names */}
                <div className="mt-auto">
                  <p className="font-mono text-[11px] leading-relaxed site-text-subtle line-clamp-2">
                    {preview}
                    {items.length > 4 ? '…' : ''}
                  </p>
                </div>

                {/* Hover arrow indicator */}
                <ArrowUpRight
                  className="absolute right-4 top-4 h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 site-text-subtle"
                />
              </Link>
            )
          })}

          {/* "All 38" callout — fills the 8th slot in a 4×2 grid */}
          <Link
            href="/components"
            className="group site-card relative flex flex-col justify-between gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'transparent' }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'var(--site-bg)',
                  border: '1px dashed var(--site-border-strong)',
                  color: 'var(--site-text-muted)',
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold site-text">Browse all</span>
            </div>

            <p className="text-sm leading-snug site-text-muted">
              Search, filter, copy-paste. Every component renders live on the page.
            </p>

            <p className="font-mono text-[11px] site-text-subtle">
              /components
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
