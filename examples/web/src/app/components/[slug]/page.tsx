import { notFound } from 'next/navigation'
import { COMPONENTS, getComponentBySlug } from '@/data/components'
import { getComponentDoc } from '@/lib/component-docs'
import { CodeBlock } from '@/components/site/CodeBlock'
import { InstallCommand } from '@/components/site/InstallCommand'

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
      <div className="mb-8 border-b pb-8" style={{ borderColor: 'var(--site-border)' }}>
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: 'var(--site-bg-elevated)', color: 'var(--site-text-muted)', border: '1px solid var(--site-border)' }}>
            {component.category}
          </span>
          {component.isNew && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: 'var(--site-accent)', color: '#fff' }}>
              New
            </span>
          )}
          {component.frameworks.map((fw) => (
            <span key={fw} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'var(--site-bg-elevated)', color: 'var(--site-text-muted)', border: '1px solid var(--site-border)' }}>
              {fw}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
          {component.name}
        </h1>
        <p className="mt-2 text-base" style={{ color: 'var(--site-text-muted)' }}>
          {component.description}
        </p>
      </div>

      {/* Install */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--site-text)' }}>Installation</h2>
        <InstallCommand slug={slug} />
      </section>

      {/* Usage example */}
      {doc?.usage && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--site-text)' }}>Usage</h2>
          <CodeBlock code={doc.usage} lang="tsx" />
        </section>
      )}

      {/* Props table */}
      {doc?.props && doc.props.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--site-text)' }}>Props</h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--site-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--site-border)', background: 'var(--site-bg-elevated)' }}>
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--site-text-muted)' }}>
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
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs" style={{ color: 'var(--site-accent)' }}>
                        {row.name}
                        {row.required && <span style={{ color: 'var(--site-error, #ef4444)' }}> *</span>}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs" style={{ color: 'var(--site-text-muted)' }}>
                        {row.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      {row.default ? (
                        <code className="font-mono text-xs" style={{ color: 'var(--site-text-muted)' }}>
                          {row.default}
                        </code>
                      ) : (
                        <span style={{ color: 'var(--site-text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--site-text-muted)' }}>
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
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
            Full documentation coming soon. Install with:
          </p>
          <div className="mt-3">
            <InstallCommand slug={slug} />
          </div>
        </div>
      )}
    </article>
  )
}
