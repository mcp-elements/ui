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
    `> 38 copy-paste UI components for AI & MCP apps. Multi-framework (React, Angular, Vue). The CLI copies source into your project — you own the code, no lock-in. The only library shipping MCP-native primitives (tool calls, consent, scopes, resources, sandboxed MCP-Apps frame).\n\n` +
    `${section('MCP-native & AI components', FEATURED_CATEGORIES)}\n\n` +
    `${section('Base (Extras) components', EXTRA_CATEGORIES)}\n\n` +
    `## Links\n` +
    `- Docs: ${SITE}\n` +
    `- Repository: https://github.com/mcp-elements/ui\n` +
    `- npm: https://www.npmjs.com/package/mcp-elements\n`
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
