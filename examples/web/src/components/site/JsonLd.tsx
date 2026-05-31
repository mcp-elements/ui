export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'mcp-elements',
    description: '38 copy-paste UI components, multi-framework, with MCP-native primitives.',
    codeRepository: 'https://github.com/mcp-elements/ui',
    programmingLanguage: ['TypeScript', 'React', 'Angular', 'Vue'],
    license: 'https://opensource.org/licenses/MIT',
    url: 'https://mcp-elements.wearesnx.studio',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
