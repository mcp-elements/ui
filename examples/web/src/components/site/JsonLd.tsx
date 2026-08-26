export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'mcp-elements',
    description: 'UI primitives for building MCP hosts — consent, scopes, tool calls, tool-forms, and an MCP Apps (SEP-1865) renderer. Copy-paste for React, Angular & Vue.',
    codeRepository: 'https://github.com/mcp-elements/ui',
    programmingLanguage: ['TypeScript', 'React', 'Angular', 'Vue'],
    license: 'https://opensource.org/licenses/MIT',
    url: 'https://mcp-elements.wearesnx.studio',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
