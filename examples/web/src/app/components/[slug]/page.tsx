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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const component = getComponentBySlug(slug)
  if (!component) return {}
  return {
    title: `${component.name} — mcp-elements`,
    description: component.description,
  }
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params
  const component = getComponentBySlug(slug)
  if (!component) notFound()

  const doc = getComponentDoc(slug)

  return (
    <article>
      {/* Header */}
      <div className="mb-10 border-b pb-8" style={{ borderColor: 'var(--site-border)' }}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--site-text-subtle)' }}>
            {component.category}
          </span>
          {component.isNew && (
            <>
              <span className="h-3 w-px" style={{ background: 'var(--site-border)' }} />
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                style={{ background: 'var(--site-accent)', color: 'var(--site-bg)' }}>
                NEW
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}>
          {component.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed max-w-2xl" style={{ color: 'var(--site-text-muted)' }}>
          {component.description}
        </p>

        {/* Framework chips */}
        <div className="mt-5 flex items-center gap-3 text-xs">
          <span className="font-mono uppercase tracking-widest" style={{ color: 'var(--site-text-subtle)' }}>
            Available in
          </span>
          {component.frameworks.map((fw) => (
            <code key={fw} className="rounded px-1.5 py-0.5 font-mono"
              style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)', color: 'var(--site-text)' }}>
              {fw}
            </code>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <section className="mb-10">
        <ComponentPreview slug={slug} />
      </section>

      {/* Install */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-mono uppercase tracking-widest"
          style={{ color: 'var(--site-text-subtle)' }}>
          Install
        </h2>
        <InstallCommand slug={slug} />
      </section>

      {/* Usage example */}
      {doc?.usage && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-mono uppercase tracking-widest"
            style={{ color: 'var(--site-text-subtle)' }}>
            Usage
          </h2>
          <CodeBlock code={doc.usage} lang="tsx" />
        </section>
      )}

      {/* Props table */}
      {doc?.props && doc.props.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-mono uppercase tracking-widest"
            style={{ color: 'var(--site-text-subtle)' }}>
            Props
          </h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--site-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--site-border)', background: 'var(--site-bg-elevated)' }}>
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest font-medium"
                      style={{ color: 'var(--site-text-subtle)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doc.props.map((row, i) => (
                  <tr key={row.name} style={{
                    borderBottom: i < doc.props.length - 1 ? '1px solid var(--site-border)' : undefined,
                  }}>
                    <td className="px-4 py-3 align-top">
                      <code className="font-mono text-xs font-semibold" style={{ color: 'var(--site-accent)' }}>
                        {row.name}
                        {row.required && <span style={{ color: 'var(--site-error)' }}> *</span>}
                      </code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <code className="font-mono text-xs" style={{ color: 'var(--site-text-muted)' }}>
                        {row.type}
                      </code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {row.default ? (
                        <code className="font-mono text-xs" style={{ color: 'var(--site-text-muted)' }}>
                          {row.default}
                        </code>
                      ) : (
                        <span style={{ color: 'var(--site-text-subtle)' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-sm" style={{ color: 'var(--site-text-muted)' }}>
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
        <div className="rounded-xl p-6 text-center"
          style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
            Full documentation coming soon.
          </p>
        </div>
      )}
    </article>
  )
}
