'use client'

import { useState } from 'react'

interface Theme {
  id: string
  name: string
  description: string
  vars: Record<string, string>
}

const THEMES: Theme[] = [
  {
    id: 'dark',
    name: 'Dark (default)',
    description: 'Deep dark background with OKLCH accent',
    vars: {
      '--site-bg': 'oklch(0.06 0.005 286)',
      '--site-accent': 'oklch(0.637 0.174 265)',
      '--site-text': 'oklch(0.95 0.005 286)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Pure black with electric blue accent',
    vars: {
      '--site-bg': 'oklch(0.04 0 0)',
      '--site-accent': 'oklch(0.65 0.2 240)',
      '--site-text': 'oklch(0.98 0 0)',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Dark green base with emerald accent',
    vars: {
      '--site-bg': 'oklch(0.06 0.02 160)',
      '--site-accent': 'oklch(0.72 0.17 145)',
      '--site-text': 'oklch(0.94 0.01 160)',
    },
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean white with blue accent',
    vars: {
      '--site-bg': 'oklch(0.99 0 0)',
      '--site-accent': 'oklch(0.55 0.2 265)',
      '--site-text': 'oklch(0.12 0.005 286)',
    },
  },
]

const CSS_VARS_TEMPLATE = `/* Add to your CSS */
:root {
  --color-background: oklch(0.06 0.005 286);
  --color-foreground: oklch(0.95 0.005 286);
  --color-primary: oklch(0.637 0.174 265);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-card: oklch(0.10 0.007 286);
  --color-card-foreground: oklch(0.95 0.005 286);
  --color-muted: oklch(0.14 0.006 286);
  --color-muted-foreground: oklch(0.55 0.012 286);
  --color-border: oklch(0.20 0.007 286);
  --color-accent: oklch(0.637 0.174 265);
  --color-accent-foreground: oklch(0.98 0 0);
  --color-destructive: oklch(0.62 0.22 25);
  --color-ring: oklch(0.637 0.174 265);
}`

export default function ThemesPage() {
  const [active, setActive] = useState('dark')
  const theme = THEMES.find((t) => t.id === active)!

  return (
    <div className="py-16">
      <div className="site-container">
        <div className="mb-10">
          <h1
            className="text-4xl font-bold"
            style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}
          >
            Themes
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            mcp-elements is CSS-token based. Override the OKLCH variables to create any theme.
          </p>
        </div>

        {/* Theme switcher */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="rounded-xl p-4 text-left transition-all"
              style={{
                background: t.vars['--site-bg'],
                border: `2px solid ${active === t.id ? 'var(--site-accent)' : 'var(--site-border)'}`,
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: t.vars['--site-accent'] }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.vars['--site-text'] }}
                >
                  {t.name}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'oklch(0.6 0.01 286)' }}>
                {t.description}
              </p>
            </button>
          ))}
        </div>

        {/* Preview card */}
        <div
          className="mb-10 rounded-xl p-6"
          style={{
            background: 'var(--site-bg-elevated)',
            border: '1px solid var(--site-border)',
          }}
        >
          <h2 className="mb-2 font-semibold" style={{ color: 'var(--site-text)' }}>
            Active theme: {theme.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(theme.vars).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: 'var(--site-bg)',
                  border: '1px solid var(--site-border)',
                }}
              >
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ background: val, borderColor: 'var(--site-border)' }}
                />
                <code
                  className="text-xs font-mono"
                  style={{ color: 'var(--site-text-muted)' }}
                >
                  {key}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* CSS vars template */}
        <div>
          <h2
            className="mb-4 text-xl font-semibold"
            style={{ color: 'var(--site-text)' }}
          >
            CSS custom properties
          </h2>
          <p className="mb-4 text-sm" style={{ color: 'var(--site-text-muted)' }}>
            Paste these into your CSS to customize all mcp-elements components.
          </p>
          <pre
            className="overflow-x-auto rounded-xl p-5 text-xs font-mono leading-relaxed"
            style={{
              background: 'oklch(0.06 0.005 286)',
              border: '1px solid var(--site-border)',
              color: 'oklch(0.9 0.01 286)',
            }}
          >
            {CSS_VARS_TEMPLATE}
          </pre>
        </div>
      </div>
    </div>
  )
}
