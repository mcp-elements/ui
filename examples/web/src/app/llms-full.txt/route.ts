import { COMPONENTS } from '@/data/components'
import { COMPONENT_DOCS } from '@/lib/component-docs'

export const dynamic = 'force-static'

export function GET() {
  const SITE = 'https://mcp-elements.wearesnx.studio'
  const blocks = COMPONENTS.map((c) => {
    const doc = COMPONENT_DOCS[c.slug]
    const props =
      doc?.props.length
        ? '\nProps:\n' +
          doc.props
            .map((p) => `- ${p.name}: ${p.type}${p.required ? ' (required)' : ''} — ${p.description}`)
            .join('\n')
        : ''
    const usage = doc?.usage ? `\n\nUsage:\n\`\`\`tsx\n${doc.usage}\n\`\`\`` : ''
    return `## ${c.name} (${c.category})\n${c.description}\nPage: ${SITE}/components/${c.slug}${props}${usage}`
  }).join('\n\n---\n\n')
  return new Response(`# mcp-elements — full component reference\n\n${blocks}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
