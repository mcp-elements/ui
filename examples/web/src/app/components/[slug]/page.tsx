import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COMPONENTS, getComponentBySlug } from '@/data/components'
import { getComponentDoc } from '@/lib/component-docs'
import { CodeBlock } from '@/components/site/CodeBlock'
import { InstallCommand } from '@/components/site/InstallCommand'
import { ComponentPreview } from '@/components/demos/registry'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const component = getComponentBySlug(slug)
  if (!component) return {}
  return {
    title: `${component.name} — ${component.category} component`,
    description: component.description,
    openGraph: {
      title: `${component.name} · mcp-elements`,
      description: component.description,
    },
  }
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params
  const component = getComponentBySlug(slug)
  if (!component) notFound()

  const doc = getComponentDoc(slug)

  return (
    <article className="pb-8">
      {/* Header */}
      <header
        className="mb-10 pb-8"
        style={{ borderBottom: '1px solid var(--site-border)' }}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="site-eyebrow">{component.category}</span>
          {component.isNew && (
            <>
              <span className="h-3 w-px" style={{ background: 'var(--site-border)' }} />
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                style={{ background: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
              >
                NEW
              </span>
            </>
          )}
        </div>

        <h1 className="site-h1" style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)' }}>
          {component.name}
        </h1>
        <p className="site-lede mt-4">{component.description}</p>

        {/* Framework chips */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="site-eyebrow">Available in</span>
          {component.frameworks.map((fw) => (
            <code
              key={fw}
              className="rounded-md px-2 py-0.5 font-mono text-[11px]"
              style={{
                background: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text)',
              }}
            >
              {fw}
            </code>
          ))}
        </div>
      </header>

      {/* Live preview */}
      <section className="mb-10">
        <h2 className="site-eyebrow mb-3">Preview</h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: '1px solid var(--site-border)',
            background: 'var(--site-bg-elevated)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="p-6 sm:p-8">
            <ComponentPreview slug={slug} />
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="mb-10">
        <h2 className="site-eyebrow mb-3">Install</h2>
        <InstallCommand slug={slug} />
      </section>

      {/* Usage example */}
      {doc?.usage && (
        <section className="mb-10">
          <h2 className="site-eyebrow mb-3">Usage</h2>
          <CodeBlock code={doc.usage} lang="tsx" filename={`${slug}-example.tsx`} />
        </section>
      )}

      {/* Props table */}
      {doc?.props && doc.props.length > 0 && (
        <section className="mb-10">
          <h2 className="site-eyebrow mb-3">Props</h2>
          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: '1px solid var(--site-border)', boxShadow: 'var(--shadow-xs)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--site-border)',
                    background: 'var(--site-bg-elevated)',
                  }}
                >
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest font-medium site-text-subtle"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doc.props.map((row, i) => (
                  <tr
                    key={row.name}
                    style={{
                      borderBottom: i < doc.props.length - 1 ? '1px solid var(--site-border)' : undefined,
                    }}
                  >
                    <td className="px-4 py-3 align-top">
                      <code className="font-mono text-xs font-semibold site-text-accent">
                        {row.name}
                        {row.required && <span style={{ color: 'var(--site-error)' }}> *</span>}
                      </code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <code className="font-mono text-xs site-text-muted">{row.type}</code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {row.default ? (
                        <code className="font-mono text-xs site-text-muted">{row.default}</code>
                      ) : (
                        <span className="site-text-subtle">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-sm site-text-muted">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* No doc fallback */}
      {!doc && (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
        >
          <p className="text-sm site-text-muted">Full documentation coming soon.</p>
        </div>
      )}
    </article>
  )
}
