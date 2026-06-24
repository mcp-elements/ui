import { COMPONENTS, FEATURED_CATEGORIES, EXTRA_CATEGORIES } from '@/data/components'

export const dynamic = 'force-static'

export function GET() {
  const SITE = 'https://mcp-elements.wearesnx.studio'
  const line = (c: { name: string; slug: string; description: string }) =>
    `- [${c.name}](${SITE}/components/${c.slug}): ${c.description}`
  const section = (title: string, cats: readonly string[]) =>
    `## ${title}\n\n` + COMPONENTS.filter((c) => cats.includes(c.category)).map(line).join('\n')
  const body =
    `# mcp-elements\n\n` +
    `> The MCP-native UI kit. The only library shipping copy-paste, framework-agnostic MCP primitives — OAuth consent, scope inspector, tool-call cards, JSON-Schema tool-forms, resource browser, and a sandboxed MCP-Apps frame — for React, Angular, and Vue. Plus 24 base UI + 7 AI components. The CLI copies source into your project; you own the code, no lock-in. Best for building MCP hosts, inspectors, agent consoles, and gateway UIs.\n\n` +
    `${section('MCP-native & AI components', FEATURED_CATEGORIES)}\n\n` +
    `${section('Base (Extras) components', EXTRA_CATEGORIES)}\n\n` +
    `## Links\n` +
    `- Docs: ${SITE}\n` +
    `- Repository: https://github.com/mcp-elements/ui\n` +
    `- npm: https://www.npmjs.com/package/mcp-elements\n`
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
