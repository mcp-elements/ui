import { Layers, Globe2, Clipboard, Palette, Accessibility, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Layers, title: 'MCP-native', body: 'The only library with pre-built consent dialogs, tool-call cards, and scope inspectors.' },
  { icon: Globe2, title: 'Every framework', body: 'React, Angular, Vue. Same API, same design tokens, same copy-paste CLI.' },
  { icon: Clipboard, title: 'You own the code', body: 'Components are copied into your project. No runtime dependency, no version lock-in.' },
  { icon: Palette, title: 'Beautiful by default', body: 'OKLCH design tokens, dark/glass/light themes, Tailwind v4. Looks great out of the box.' },
  { icon: Accessibility, title: 'Accessible first', body: 'WAI-ARIA patterns, keyboard navigation, screen reader support — built into core.' },
  { icon: Zap, title: 'Framework-free core', body: 'Pure TypeScript state machines. OAuth PKCE, tool-state, schema-form — no framework required.' },
]

export function FeatureCards() {
  return (
    <section className="py-24">
      <div className="site-container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Why mcp-elements
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            Everything you need to build polished MCP applications.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 rounded-xl p-6"
              style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
              <f.icon className="h-5 w-5" style={{ color: 'var(--site-accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--site-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
