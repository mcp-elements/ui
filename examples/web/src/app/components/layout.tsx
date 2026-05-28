import { COMPONENTS, CATEGORIES } from '@/data/components'
import Link from 'next/link'

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-container py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-6">
            {CATEGORIES.map((cat) => {
              const items = COMPONENTS.filter((c) => c.category === cat)
              return (
                <div key={cat}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest"
                     style={{ color: 'var(--site-text-muted)' }}>
                    {cat}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {items.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/components/${c.slug}`}
                          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-[var(--site-bg-elevated)]"
                          style={{ color: 'var(--site-text-muted)' }}
                        >
                          {c.name}
                          {c.isNew && (
                            <span className="rounded px-1 py-0.5 text-[10px] font-medium"
                                  style={{ background: 'var(--site-accent)', color: '#fff' }}>
                              NEW
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
