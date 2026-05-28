import { COMPONENTS, CATEGORIES } from '@/data/components'
import Link from 'next/link'

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-container py-10">
      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20 flex flex-col gap-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            {CATEGORIES.map((cat) => {
              const items = COMPONENTS.filter((c) => c.category === cat)
              return (
                <div key={cat}>
                  <p className="site-eyebrow mb-2">{cat}</p>
                  <ul className="flex flex-col gap-0.5">
                    {items.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/components/${c.slug}`}
                          className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm site-link transition-colors duration-150 hover:bg-[var(--site-bg-elevated)] hover:text-[var(--site-text)]"
                        >
                          <span>{c.name}</span>
                          {c.isNew && (
                            <span
                              className="rounded px-1 py-0.5 text-[10px] font-semibold tracking-wide"
                              style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
                            >
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
