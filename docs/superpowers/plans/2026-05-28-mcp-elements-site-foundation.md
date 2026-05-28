# mcp-elements Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `examples/web/` — a production-grade Next.js 15 site for mcp-elements covering the homepage (animated hero), component browser, and all shared site components (nav, footer, code block, install command).

**Architecture:** Next.js 15 App Router in `examples/web/`, Tailwind v4 via `@tailwindcss/postcss`, Geist fonts via `geist` npm package, Framer Motion for hero animation. Site chrome uses Tailwind utilities inline; `@mcp-elements/css` tokens loaded for component demos later.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.7+, Tailwind v4 + `@tailwindcss/postcss`, Framer Motion, Shiki (server-side code highlighting), Geist font package, Lucide React, `@mcp-elements/core` (workspace dep)

---

## File Map

**Create:**
- `examples/web/package.json`
- `examples/web/next.config.ts`
- `examples/web/tsconfig.json`
- `examples/web/postcss.config.mjs`
- `examples/web/src/styles/globals.css`
- `examples/web/src/lib/cn.ts`
- `examples/web/src/lib/github.ts`
- `examples/web/src/app/layout.tsx`
- `examples/web/src/app/page.tsx`
- `examples/web/src/components/site/SiteNav.tsx`
- `examples/web/src/components/site/SiteFooter.tsx`
- `examples/web/src/components/site/ThemeToggle.tsx`
- `examples/web/src/components/site/CopyButton.tsx`
- `examples/web/src/components/site/CodeBlock.tsx`
- `examples/web/src/components/site/InstallCommand.tsx`
- `examples/web/src/components/site/ComponentCard.tsx`
- `examples/web/src/components/home/HeroToolCallDemo.tsx`
- `examples/web/src/components/home/HeroSection.tsx`
- `examples/web/src/components/home/ProofStrip.tsx`
- `examples/web/src/components/home/FeatureCards.tsx`
- `examples/web/src/components/home/ComponentShowcase.tsx`
- `examples/web/src/components/home/McpSection.tsx`
- `examples/web/src/components/home/FrameworkSection.tsx`
- `examples/web/src/components/home/CopyPasteCta.tsx`
- `examples/web/src/data/components.ts`
- `examples/web/src/app/components/page.tsx`

---

### Task 1: Scaffold `examples/web/` Next.js 15 app

**Files:**
- Create: `examples/web/package.json`
- Create: `examples/web/next.config.ts`
- Create: `examples/web/tsconfig.json`
- Create: `examples/web/postcss.config.mjs`

- [ ] **Step 1: Create `examples/web/package.json`**

```json
{
  "name": "@mcp-elements/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@mcp-elements/core": "workspace:*",
    "@mcp-elements/css": "workspace:*",
    "@mcp-elements/react": "workspace:*",
    "framer-motion": "^12.0.0",
    "geist": "^1.3.0",
    "lucide-react": "^0.511.0",
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "shiki": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create `examples/web/next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mcp-elements/react', '@mcp-elements/core'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
```

- [ ] **Step 3: Create `examples/web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `examples/web/postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 5: Install from workspace root**

```bash
pnpm install
```

Expected: Resolves without errors. `examples/web/node_modules` created.

- [ ] **Step 6: Commit**

```bash
git add examples/web/package.json examples/web/next.config.ts examples/web/tsconfig.json examples/web/postcss.config.mjs
git commit -m "feat(web): scaffold examples/web Next.js 15 app"
```

---

### Task 2: Global CSS + root layout

**Files:**
- Create: `examples/web/src/styles/globals.css`
- Create: `examples/web/src/lib/cn.ts`
- Create: `examples/web/src/app/layout.tsx`
- Create: `examples/web/src/app/page.tsx` (placeholder)

- [ ] **Step 1: Create `examples/web/src/styles/globals.css`**

```css
@import "tailwindcss";

/* =============================================
   mcp-elements website design tokens
   Dark-first. Light mode via [data-theme="light"]
   ============================================= */

:root {
  --site-bg:           oklch(0.06 0.005 286);
  --site-bg-elevated:  oklch(0.10 0.007 286);
  --site-bg-subtle:    oklch(0.13 0.007 286);
  --site-border:       oklch(0.18 0.008 286);
  --site-border-focus: oklch(0.637 0.174 265);
  --site-text:         oklch(0.95 0 0);
  --site-text-muted:   oklch(0.55 0.012 286);
  --site-text-subtle:  oklch(0.38 0.010 286);
  --site-accent:       oklch(0.637 0.174 265);
  --site-accent-dim:   oklch(0.45 0.15 265);
  --site-accent-glow:  oklch(0.637 0.174 265 / 0.12);
  --site-success:      oklch(0.72 0.17 145);
  --site-warning:      oklch(0.82 0.18 85);
  --site-error:        oklch(0.62 0.22 25);

  color-scheme: dark;
}

[data-theme="light"] {
  --site-bg:           oklch(0.99 0 0);
  --site-bg-elevated:  oklch(0.97 0.002 286);
  --site-bg-subtle:    oklch(0.94 0.003 286);
  --site-border:       oklch(0.88 0.005 286);
  --site-border-focus: oklch(0.50 0.15 265);
  --site-text:         oklch(0.12 0.005 286);
  --site-text-muted:   oklch(0.45 0.012 286);
  --site-text-subtle:  oklch(0.60 0.010 286);
  --site-accent:       oklch(0.50 0.174 265);
  --site-accent-dim:   oklch(0.40 0.15 265);
  --site-accent-glow:  oklch(0.50 0.174 265 / 0.10);

  color-scheme: light;
}

*, *::before, *::after { box-sizing: border-box; }

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--site-bg);
  color: var(--site-text);
  min-height: 100dvh;
}

@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

.site-container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 2rem;
}

@media (max-width: 640px) {
  .site-container { padding-inline: 1rem; }
}

code:not(pre code) {
  background: var(--site-bg-elevated);
  border: 1px solid var(--site-border);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875em;
  color: var(--site-accent);
}
```

- [ ] **Step 2: Create `examples/web/src/lib/cn.ts`**

```typescript
export { cn } from '@mcp-elements/core'
```

- [ ] **Step 3: Create `examples/web/src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'mcp-elements — The UI kit for MCP applications',
    template: '%s · mcp-elements',
  },
  description:
    'Pre-built consent dialogs, tool-call cards, and scope inspectors for MCP applications. Copy-paste into React, Angular, or Vue.',
  openGraph: {
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
    url: 'https://mcp-elements.dev',
    siteName: 'mcp-elements',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
  },
  keywords: ['MCP', 'Model Context Protocol', 'UI components', 'React', 'Angular', 'Vue', 'AI'],
}

// Inline script sets theme from localStorage before first paint — prevents flash
function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('mcp-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeScript />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Create placeholder `examples/web/src/app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <div className="site-container py-24">
      <h1 className="text-4xl font-bold" style={{ color: 'var(--site-text)' }}>
        mcp-elements
      </h1>
    </div>
  )
}
```

- [ ] **Step 5: Verify dev server starts**

From `examples/web/`:
```bash
pnpm dev
```

Expected: Next.js starts on http://localhost:3000. Browser shows dark background (`--site-bg`), white "mcp-elements" heading. No console errors.

- [ ] **Step 6: Commit**

```bash
git add examples/web/src/
git commit -m "feat(web): globals.css tokens + root layout + Geist fonts"
```

---

### Task 3: SiteNav

**Files:**
- Create: `examples/web/src/lib/github.ts`
- Create: `examples/web/src/components/site/ThemeToggle.tsx`
- Create: `examples/web/src/components/site/SiteNav.tsx`

- [ ] **Step 1: Create `examples/web/src/lib/github.ts`**

```typescript
export async function getGitHubStars(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) return 0
    const data = (await res.json()) as { stargazers_count?: number }
    return data.stargazers_count ?? 0
  } catch {
    return 0
  }
}
```

- [ ] **Step 2: Create `examples/web/src/components/site/ThemeToggle.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('mcp-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('mcp-theme', next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md p-2 transition-colors duration-150"
      style={{
        color: 'var(--site-text-muted)',
        border: '1px solid var(--site-border)',
        backgroundColor: 'transparent',
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
```

- [ ] **Step 3: Create `examples/web/src/components/site/SiteNav.tsx`**

`SiteNav` is an async Server Component (fetches GitHub stars server-side).

```tsx
import Link from 'next/link'
import { Star, Menu } from 'lucide-react'
import { getGitHubStars } from '@/lib/github'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '/components', label: 'Components' },
  { href: '/mcp', label: 'MCP' },
  { href: '/playground', label: 'Playground' },
  { href: '/themes', label: 'Themes' },
]

export async function SiteNav() {
  const stars = await getGitHubStars('thepsygeek/mcp-elements')

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        borderBottom: '1px solid var(--site-border)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'color-mix(in oklch, var(--site-bg) 80%, transparent)',
      }}
    >
      <div className="site-container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold"
          style={{ color: 'var(--site-text)' }}
        >
          <span style={{ color: 'var(--site-accent)' }}>●</span>
          <span>mcp-elements</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
              style={{ color: 'var(--site-text-muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span
            className="hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text-muted)',
            }}
          >
            v0.1
          </span>

          <a
            href="https://github.com/thepsygeek/mcp-elements"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              color: 'var(--site-text)',
            }}
          >
            <Star className="h-3.5 w-3.5" style={{ color: 'var(--site-warning)' }} />
            <span>{stars > 0 ? (stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars) : 'Star'}</span>
          </a>

          <ThemeToggle />

          <button
            className="md:hidden rounded-md p-2"
            style={{ color: 'var(--site-text-muted)' }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Add SiteNav to root layout**

Update `examples/web/src/app/layout.tsx` — add nav import and wrap children:

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SiteNav } from '@/components/site/SiteNav'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'mcp-elements — The UI kit for MCP applications',
    template: '%s · mcp-elements',
  },
  description:
    'Pre-built consent dialogs, tool-call cards, and scope inspectors for MCP applications. Copy-paste into React, Angular, or Vue.',
  openGraph: {
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
    url: 'https://mcp-elements.dev',
    siteName: 'mcp-elements',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
  },
  keywords: ['MCP', 'Model Context Protocol', 'UI components', 'React', 'Angular', 'Vue', 'AI'],
}

function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('mcp-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeScript />
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify nav renders**

```bash
pnpm dev
```

Expected: Sticky dark nav at top with `● mcp-elements` logo, nav links, `v0.1` chip, Star button, and theme toggle. Theme toggle switches dark/light.

- [ ] **Step 6: Commit**

```bash
git add examples/web/src/lib/github.ts \
        examples/web/src/components/site/ThemeToggle.tsx \
        examples/web/src/components/site/SiteNav.tsx \
        examples/web/src/app/layout.tsx
git commit -m "feat(web): SiteNav with GitHub stars, ThemeToggle, layout wired"
```

---

### Task 4: SiteFooter

**Files:**
- Create: `examples/web/src/components/site/SiteFooter.tsx`

- [ ] **Step 1: Create `examples/web/src/components/site/SiteFooter.tsx`**

```tsx
import Link from 'next/link'

const FOOTER_COLS = [
  {
    label: 'Documentation',
    links: [
      { href: '/components', label: 'Components' },
      { href: '/mcp', label: 'MCP Primitives' },
      { href: '/playground', label: 'Playground' },
      { href: '/themes', label: 'Themes' },
    ],
  },
  {
    label: 'Community',
    links: [
      { href: 'https://github.com/thepsygeek/mcp-elements', label: 'GitHub', external: true },
      { href: 'https://github.com/thepsygeek/mcp-elements/issues', label: 'Issues', external: true },
      { href: 'https://github.com/thepsygeek/mcp-elements/discussions', label: 'Discussions', external: true },
    ],
  },
  {
    label: 'Frameworks',
    links: [
      { href: '/components?framework=react', label: 'React' },
      { href: '/components?framework=angular', label: 'Angular' },
      { href: '/components?framework=vue', label: 'Vue' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer
      className="w-full mt-24"
      style={{ borderTop: '1px solid var(--site-border)', backgroundColor: 'var(--site-bg)' }}
    >
      <div className="site-container py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo col */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-mono text-sm font-semibold" style={{ color: 'var(--site-text)' }}>
              <span style={{ color: 'var(--site-accent)' }}>●</span> mcp-elements
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              The UI kit for MCP applications. Copy-paste into any framework.
            </p>
            <span
              className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-mono"
              style={{
                backgroundColor: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text-subtle)',
              }}
            >
              MIT License
            </span>
          </div>

          {/* Link cols */}
          {FOOTER_COLS.map((col) => (
            <div key={col.label} className="flex flex-col gap-3">
              <p
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--site-text-subtle)' }}
              >
                {col.label}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
                        style={{ color: 'var(--site-text-muted)' }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-150 hover:text-[var(--site-text)]"
                        style={{ color: 'var(--site-text-muted)' }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-center text-xs sm:flex-row"
          style={{ borderColor: 'var(--site-border)', color: 'var(--site-text-subtle)' }}
        >
          <p>© 2026 mcp-elements · MIT License</p>
          <p>
            Built with ☕ by{' '}
            <a
              href="https://github.com/thepsygeek"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              @thepsygeek
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Add SiteFooter to layout**

Update the `<body>` in `examples/web/src/app/layout.tsx` — add footer import and element after `<main>`:

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'mcp-elements — The UI kit for MCP applications',
    template: '%s · mcp-elements',
  },
  description:
    'Pre-built consent dialogs, tool-call cards, and scope inspectors for MCP applications. Copy-paste into React, Angular, or Vue.',
  openGraph: {
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
    url: 'https://mcp-elements.dev',
    siteName: 'mcp-elements',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcp-elements',
    description: 'The UI kit for MCP applications.',
  },
  keywords: ['MCP', 'Model Context Protocol', 'UI components', 'React', 'Angular', 'Vue', 'AI'],
}

function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('mcp-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeScript />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add examples/web/src/components/site/SiteFooter.tsx examples/web/src/app/layout.tsx
git commit -m "feat(web): SiteFooter + wired into layout"
```

---

### Task 5: CodeBlock + CopyButton + InstallCommand

**Files:**
- Create: `examples/web/src/components/site/CopyButton.tsx`
- Create: `examples/web/src/components/site/CodeBlock.tsx`
- Create: `examples/web/src/components/site/InstallCommand.tsx`

- [ ] **Step 1: Create `examples/web/src/components/site/CopyButton.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded p-1.5 transition-all duration-150 ${className ?? ''}`}
      style={{ color: copied ? 'var(--site-success)' : 'var(--site-text-muted)', backgroundColor: 'transparent' }}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
```

- [ ] **Step 2: Create `examples/web/src/components/site/CodeBlock.tsx`**

Async Server Component — Shiki runs at render time, no client JS needed.

```tsx
import { codeToHtml } from 'shiki'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
}

export async function CodeBlock({ code, lang = 'typescript', filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark-dimmed',
  })

  return (
    <div
      className="group relative overflow-hidden rounded-xl"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
    >
      {filename ? (
        <div
          className="flex items-center justify-between px-4 py-2 text-xs font-mono"
          style={{ borderBottom: '1px solid var(--site-border)', color: 'var(--site-text-muted)' }}
        >
          <span>{filename}</span>
          <CopyButton text={code} />
        </div>
      ) : (
        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create `examples/web/src/components/site/InstallCommand.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import { CopyButton } from './CopyButton'

export function InstallCommand({ componentName, animate = false }: { componentName: string; animate?: boolean }) {
  const command = `npx mcp-elements add ${componentName}`
  const [displayed, setDisplayed] = useState(animate ? '' : command)

  useEffect(() => {
    if (!animate) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(command.slice(0, i))
      if (i >= command.length) clearInterval(timer)
    }, 35)
    return () => clearInterval(timer)
  }, [command, animate])

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
    >
      <Terminal className="h-4 w-4 shrink-0" style={{ color: 'var(--site-accent)' }} />
      <code className="flex-1 font-mono text-sm" style={{ color: 'var(--site-text)' }}>
        <span style={{ color: 'var(--site-text-subtle)' }}>$ </span>
        {displayed}
        {animate && displayed.length < command.length && (
          <span
            className="ml-0.5 inline-block h-4 w-0.5 align-middle animate-pulse"
            style={{ backgroundColor: 'var(--site-accent)' }}
          />
        )}
      </code>
      <CopyButton text={command} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/components/site/CopyButton.tsx \
        examples/web/src/components/site/CodeBlock.tsx \
        examples/web/src/components/site/InstallCommand.tsx
git commit -m "feat(web): CopyButton, CodeBlock (Shiki), InstallCommand"
```

---

### Task 6: Hero section with animated HeroToolCallDemo

**Files:**
- Create: `examples/web/src/components/home/HeroToolCallDemo.tsx`
- Create: `examples/web/src/components/home/HeroSection.tsx`

- [ ] **Step 1: Create `examples/web/src/components/home/HeroToolCallDemo.tsx`**

Self-contained animation — does NOT depend on `@mcp-elements/react` (those components are built in Plan 3c). This simulates the McpToolCall visual for the hero.

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Clock } from 'lucide-react'

type Phase = 'idle' | 'running' | 'done'

const DURATIONS: Record<Phase, number> = { idle: 1200, running: 2400, done: 1800 }

export function HeroToolCallDemo() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const phases: Phase[] = ['idle', 'running', 'done']
    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    function advance() {
      setPhase((cur) => {
        const next = phases[(phases.indexOf(cur) + 1) % phases.length] as Phase
        if (next === 'running') {
          setProgress(0)
          let p = 0
          interval = setInterval(() => {
            p += 2
            setProgress(Math.min(p, 100))
            if (p >= 100) clearInterval(interval)
          }, DURATIONS.running / 55)
        }
        timeout = setTimeout(advance, DURATIONS[next])
        return next
      })
    }

    timeout = setTimeout(advance, DURATIONS.idle)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl"
        style={{ backgroundColor: 'var(--site-accent-glow)' }}
      />
      {/* Ghost cards */}
      <div className="absolute -top-4 left-6 right-6 h-14 rounded-xl opacity-25"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }} />
      <div className="absolute -bottom-4 left-6 right-6 h-14 rounded-xl opacity-15"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }} />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-sm rounded-xl p-5 shadow-2xl"
        style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs"
              style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}
            >
              fn
            </div>
            <span className="font-mono text-sm font-medium" style={{ color: 'var(--site-text)' }}>
              search_files
            </span>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'var(--site-bg-subtle)', color: 'var(--site-text-subtle)' }}>
                <Clock className="h-3 w-3" /> idle
              </motion.div>
            )}
            {phase === 'running' && (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'oklch(0.82 0.18 85 / 0.15)', color: 'var(--site-warning)' }}>
                <Loader2 className="h-3 w-3 animate-spin" /> running
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: 'oklch(0.72 0.17 145 / 0.15)', color: 'var(--site-success)' }}>
                <CheckCircle2 className="h-3 w-3" /> done
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Args */}
        <div className="mb-4 rounded-md p-3 font-mono text-xs"
          style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-text-muted)' }}>
          <span style={{ color: 'var(--site-text-subtle)' }}>path: </span>
          <span style={{ color: 'var(--site-accent)' }}>&quot;/src&quot;</span>
          {', '}
          <span style={{ color: 'var(--site-text-subtle)' }}>pattern: </span>
          <span style={{ color: 'var(--site-accent)' }}>&quot;*.ts&quot;</span>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {phase === 'running' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mb-3 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--site-bg-subtle)', height: 3 }}>
              <div className="h-full rounded-full"
                style={{ backgroundColor: 'var(--site-accent)', width: `${progress}%`, transition: 'width 50ms linear' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-md p-3 text-sm"
              style={{ backgroundColor: 'oklch(0.72 0.17 145 / 0.08)', border: '1px solid oklch(0.72 0.17 145 / 0.25)', color: 'var(--site-success)' }}>
              Found 47 TypeScript files
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Create `examples/web/src/components/home/HeroSection.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { HeroToolCallDemo } from './HeroToolCallDemo'
import { InstallCommand } from '@/components/site/InstallCommand'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32" style={{ backgroundColor: 'var(--site-bg)' }}>
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(var(--site-border) 1px, transparent 1px), linear-gradient(90deg, var(--site-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--site-accent-glow)' }} />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="flex flex-col gap-8 max-w-xl">
            {/* Badge */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: 'var(--site-accent-glow)', border: '1px solid var(--site-accent)', color: 'var(--site-accent)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--site-accent)' }} />
              MCP UI · React · Angular · Vue
            </div>

            {/* Headline */}
            <h1
              className="text-5xl font-extrabold leading-[1.05] lg:text-6xl"
              style={{ color: 'var(--site-text)', letterSpacing: '-0.03em' }}
            >
              The UI kit for
              <br />
              <span style={{ color: 'var(--site-accent)' }}>MCP applications.</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              Pre-built consent dialogs, tool-call cards, and scope inspectors.
              Copy-paste into any framework. No runtime lock-in.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--site-accent)', color: 'oklch(1 0 0)' }}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'transparent', border: '1px solid var(--site-border)', color: 'var(--site-text)' }}
              >
                Browse Components <ExternalLink className="h-4 w-4" style={{ color: 'var(--site-text-muted)' }} />
              </Link>
            </div>

            <InstallCommand componentName="mcp-tool-call" animate />
          </div>

          {/* Right — animated demo */}
          <div className="hidden lg:block">
            <HeroToolCallDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update page.tsx to show hero**

```tsx
import { HeroSection } from '@/components/home/HeroSection'

export default function HomePage() {
  return <HeroSection />
}
```

- [ ] **Step 4: Verify hero renders and animates**

```bash
pnpm dev
```

Expected: Hero renders with grid background, radial glow, headline "The UI kit for MCP applications.", badge chip, two CTA buttons, animated install command typing, animated McpToolCall card cycling idle → running → done on loop.

- [ ] **Step 5: Commit**

```bash
git add examples/web/src/components/home/HeroToolCallDemo.tsx \
        examples/web/src/components/home/HeroSection.tsx \
        examples/web/src/app/page.tsx
git commit -m "feat(web): hero section with Framer Motion HeroToolCallDemo"
```

---

### Task 7: Homepage remaining sections

**Files:**
- Create: `examples/web/src/components/home/ProofStrip.tsx`
- Create: `examples/web/src/components/home/FeatureCards.tsx`
- Create: `examples/web/src/components/home/ComponentShowcase.tsx`
- Create: `examples/web/src/components/home/McpSection.tsx`
- Create: `examples/web/src/components/home/FrameworkSection.tsx`
- Create: `examples/web/src/components/home/CopyPasteCta.tsx`

- [ ] **Step 1: Create `examples/web/src/components/home/ProofStrip.tsx`**

```tsx
const STATS = [
  '97M+ monthly MCP downloads',
  '9,652+ servers',
  'React · Angular · Vue',
  'MIT License',
  'Copy-paste',
]

export function ProofStrip() {
  return (
    <div className="w-full border-y py-4"
      style={{ borderColor: 'var(--site-border)', backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {STATS.map((stat, i) => (
          <span key={i} className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `examples/web/src/components/home/FeatureCards.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `examples/web/src/components/home/ComponentShowcase.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const SHOWCASE = [
  { name: 'McpToolCall', slug: 'mcp-tool-call', category: 'MCP' },
  { name: 'Button', slug: 'button', category: 'Form' },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', category: 'MCP' },
  { name: 'Input', slug: 'input', category: 'Form' },
  { name: 'Badge', slug: 'badge', category: 'Display' },
  { name: 'Card', slug: 'card', category: 'Display' },
  { name: 'Switch', slug: 'switch', category: 'Form' },
  { name: 'Progress', slug: 'progress', category: 'Display' },
  { name: 'ChatBubble', slug: 'chat-bubble', category: 'AI' },
  { name: 'Alert', slug: 'alert', category: 'Feedback' },
  { name: 'Tabs', slug: 'tabs', category: 'Navigation' },
  { name: 'McpServerStatus', slug: 'mcp-server-status', category: 'MCP' },
]

export function ComponentShowcase() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            38 components.{' '}
            <span style={{ color: 'var(--site-text-muted)' }}>Ready to copy.</span>
          </h2>
          <Link href="/components" className="hidden items-center gap-1.5 text-sm font-medium sm:flex"
            style={{ color: 'var(--site-accent)' }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SHOWCASE.map((c) => {
            const isMcp = c.category === 'MCP'
            return (
              <Link
                key={c.slug}
                href={`/${isMcp ? 'mcp' : 'components'}/${c.slug}`}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 transition-all duration-200"
                style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
              >
                <span
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: isMcp ? 'var(--site-accent-glow)' : 'var(--site-bg-subtle)',
                    color: isMcp ? 'var(--site-accent)' : 'var(--site-text-subtle)',
                  }}
                >
                  {c.category}
                </span>
                <div className="flex min-h-20 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--site-text-subtle)' }}>{c.name}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--site-text)' }}>{c.name}</p>
                <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ border: '1px solid var(--site-accent)' }} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `examples/web/src/components/home/McpSection.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const MCP_COMPONENTS = [
  { name: 'McpToolCall', slug: 'mcp-tool-call', status: 'stable', description: 'Tool execution card: idle → running → done/error with retry' },
  { name: 'McpToolForm', slug: 'mcp-tool-form', status: 'stable', description: 'JSON Schema → dynamic form with validation' },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', status: 'stable', description: 'OAuth consent UI: scope list, approve/deny' },
  { name: 'McpScopeInspector', slug: 'mcp-scope-inspector', status: 'stable', description: 'Expandable scope tree with human-readable descriptions' },
  { name: 'McpResourceBrowser', slug: 'mcp-resource-browser', status: 'stable', description: 'Browse MCP resources with type icons and preview' },
  { name: 'McpServerStatus', slug: 'mcp-server-status', status: 'stable', description: 'Connection badge: connected/disconnected/error/reconnecting' },
  { name: 'McpAppFrame', slug: 'mcp-app-frame', status: 'preview', description: 'Sandboxed iframe + postMessage bridge for MCP Apps spec' },
]

export function McpSection() {
  return (
    <section className="py-24"
      style={{ borderTop: '1px solid var(--site-accent)', backgroundColor: 'var(--site-bg)' }}>
      <div className="site-container">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: 'var(--site-accent-glow)', border: '1px solid var(--site-accent)', color: 'var(--site-accent)' }}>
            MCP Primitives
          </span>
        </div>
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
              The primitives MCP was missing.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
              Every MCP application needs server consent, tool call UI, and scope inspection.
              Nobody ships them as copy-paste primitives. Until now.
            </p>
          </div>
          <Link href="/mcp" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
            style={{ color: 'var(--site-accent)' }}>
            Explore MCP components <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MCP_COMPONENTS.map((c) => (
            <Link key={c.slug} href={`/mcp/${c.slug}`}
              className="group flex flex-col gap-3 rounded-xl p-5 transition-all duration-200"
              style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--site-text)' }}>{c.name}</span>
                <span className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: c.status === 'stable' ? 'oklch(0.72 0.17 145 / 0.15)' : 'oklch(0.82 0.18 85 / 0.15)',
                    color: c.status === 'stable' ? 'var(--site-success)' : 'var(--site-warning)',
                  }}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{c.description}</p>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: 'var(--site-accent)' }}>
                Docs <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `examples/web/src/components/home/FrameworkSection.tsx`**

```tsx
'use client'

import { useState } from 'react'

type Framework = 'react' | 'angular' | 'vue'

const CODE: Record<Framework, string> = {
  react: `import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()

export function App() {
  return (
    <McpToolCall
      toolName="search_files"
      args={{ path: '/src', pattern: '*.ts' }}
      state={state}
      onRetry={() => state.reset()}
    />
  )
}`,
  angular: `import { Component } from '@angular/core'
import { McpToolCallComponent } from '@mcp-elements/angular'
import { createToolState } from '@mcp-elements/core'

@Component({
  selector: 'app-root',
  imports: [McpToolCallComponent],
  template: \`
    <mcp-tool-call
      toolName="search_files"
      [args]="args"
      [state]="state"
      (retry)="state.reset()"
    />
  \`,
})
export class AppComponent {
  args = { path: '/src', pattern: '*.ts' }
  state = createToolState()
}`,
  vue: `<script setup>
import { McpToolCall } from '@mcp-elements/vue'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
const args = { path: '/src', pattern: '*.ts' }
</script>

<template>
  <McpToolCall
    tool-name="search_files"
    :args="args"
    :state="state"
    @retry="state.reset()"
  />
</template>`,
}

const FILENAMES: Record<Framework, string> = {
  react: 'app.tsx',
  angular: 'app.component.ts',
  vue: 'App.vue',
}

export function FrameworkSection() {
  const [active, setActive] = useState<Framework>('react')

  return (
    <section className="py-24">
      <div className="site-container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Your framework. Same components.
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            React, Angular, and Vue — all supported at launch.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg p-1 gap-1"
            style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
            {(['react', 'angular', 'vue'] as Framework[]).map((fw) => (
              <button key={fw} onClick={() => setActive(fw)}
                className="rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150"
                style={{
                  backgroundColor: active === fw ? 'var(--site-accent)' : 'transparent',
                  color: active === fw ? 'oklch(1 0 0)' : 'var(--site-text-muted)',
                }}>
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl"
          style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <div className="flex items-center gap-1.5 px-4 py-3"
            style={{ borderBottom: '1px solid var(--site-border)' }}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-error)' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-warning)' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-success)' }} />
            <span className="ml-2 font-mono text-xs" style={{ color: 'var(--site-text-subtle)' }}>
              {FILENAMES[active]}
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed"
            style={{ color: 'var(--site-text-muted)' }}>
            <code>{CODE[active]}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `examples/web/src/components/home/CopyPasteCta.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { InstallCommand } from '@/components/site/InstallCommand'

const CLI_OUTPUT = [
  '✓  css/components/mcp-tool-call.css',
  '✓  react/mcp/mcp-tool-call.tsx',
  '✓  core/mcp/tool-state.ts',
]

export function CopyPasteCta() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--site-bg-elevated)' }}>
      <div className="site-container">
        <div className="mx-auto max-w-3xl rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Own your code.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
            Run one command. The CLI copies source files into your project.
            No npm dependency for components — just code you control.
          </p>
          <div className="mt-8 text-left">
            <InstallCommand componentName="mcp-tool-call" animate />
          </div>
          <div className="mt-3 rounded-lg p-4 text-left font-mono text-sm"
            style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
            {CLI_OUTPUT.map((line) => (
              <div key={line} style={{ color: 'var(--site-success)' }}>{line}</div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/components"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--site-accent)', color: 'oklch(1 0 0)' }}>
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add examples/web/src/components/home/
git commit -m "feat(web): ProofStrip, FeatureCards, ComponentShowcase, McpSection, FrameworkSection, CopyPasteCta"
```

---

### Task 8: Assemble full homepage

**Files:**
- Modify: `examples/web/src/app/page.tsx`

- [ ] **Step 1: Replace placeholder with all sections**

```tsx
import { HeroSection } from '@/components/home/HeroSection'
import { ProofStrip } from '@/components/home/ProofStrip'
import { FeatureCards } from '@/components/home/FeatureCards'
import { ComponentShowcase } from '@/components/home/ComponentShowcase'
import { McpSection } from '@/components/home/McpSection'
import { FrameworkSection } from '@/components/home/FrameworkSection'
import { CopyPasteCta } from '@/components/home/CopyPasteCta'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProofStrip />
      <FeatureCards />
      <ComponentShowcase />
      <McpSection />
      <FrameworkSection />
      <CopyPasteCta />
    </>
  )
}
```

- [ ] **Step 2: Verify full homepage**

```bash
pnpm dev
```

Scroll through http://localhost:3000. Expected: All 7 sections visible in order. Hero animation cycles. Framework tab switcher works. No console errors.

- [ ] **Step 3: Commit**

```bash
git add examples/web/src/app/page.tsx
git commit -m "feat(web): assemble full homepage (all 7 sections)"
```

---

### Task 9: Component data layer + component browser

**Files:**
- Create: `examples/web/src/data/components.ts`
- Create: `examples/web/src/components/site/ComponentCard.tsx`
- Create: `examples/web/src/app/components/page.tsx`

- [ ] **Step 1: Create `examples/web/src/data/components.ts`**

```typescript
export type ComponentCategory = 'Form' | 'Display' | 'Overlay' | 'Navigation' | 'Feedback' | 'AI' | 'MCP'
export type Framework = 'react' | 'angular' | 'vue'

export interface ComponentEntry {
  name: string
  slug: string
  category: ComponentCategory
  description: string
  frameworks: Framework[]
  isMcp?: boolean
  isNew?: boolean
}

export const COMPONENTS: ComponentEntry[] = [
  // Form
  { name: 'Button', slug: 'button', category: 'Form', description: 'Clickable action element with 6 variants and 4 sizes.', frameworks: ['react', 'angular'] },
  { name: 'Input', slug: 'input', category: 'Form', description: 'Text input with label, error state, and helper text.', frameworks: ['react', 'angular'] },
  { name: 'Textarea', slug: 'textarea', category: 'Form', description: 'Multi-line text input with auto-resize option.', frameworks: ['react', 'angular'] },
  { name: 'PasswordInput', slug: 'password-input', category: 'Form', description: 'Secure text input with show/hide toggle.', frameworks: ['react', 'angular'] },
  { name: 'Select', slug: 'select', category: 'Form', description: 'Dropdown select with search and custom options.', frameworks: ['react', 'angular'] },
  { name: 'Switch', slug: 'switch', category: 'Form', description: 'Toggle switch for boolean settings.', frameworks: ['react', 'angular'] },
  { name: 'Counter', slug: 'counter', category: 'Form', description: 'Numeric input with increment/decrement controls.', frameworks: ['react', 'angular'] },
  // Display
  { name: 'Badge', slug: 'badge', category: 'Display', description: 'Small label for status, counts, or categories.', frameworks: ['react', 'angular'] },
  { name: 'Card', slug: 'card', category: 'Display', description: 'Container with header, content, and footer slots.', frameworks: ['react', 'angular'] },
  { name: 'Avatar', slug: 'avatar', category: 'Display', description: 'User avatar with image, initials, or icon fallback.', frameworks: ['react', 'angular'] },
  { name: 'Separator', slug: 'separator', category: 'Display', description: 'Visual divider — horizontal or vertical.', frameworks: ['react', 'angular'] },
  { name: 'Skeleton', slug: 'skeleton', category: 'Display', description: 'Loading placeholder with shimmer animation.', frameworks: ['react', 'angular'] },
  { name: 'Progress', slug: 'progress', category: 'Display', description: 'Linear progress bar with animated fill.', frameworks: ['react', 'angular'] },
  { name: 'Loader', slug: 'loader', category: 'Display', description: 'Spinning loader indicator.', frameworks: ['react', 'angular'] },
  // Overlay
  { name: 'Dialog', slug: 'dialog', category: 'Overlay', description: 'Modal dialog with accessible focus trap.', frameworks: ['react', 'angular'] },
  { name: 'Tooltip', slug: 'tooltip', category: 'Overlay', description: 'Floating label on hover or focus.', frameworks: ['react', 'angular'] },
  { name: 'Popover', slug: 'popover', category: 'Overlay', description: 'Floating content panel anchored to a trigger.', frameworks: ['react', 'angular'] },
  { name: 'Toast', slug: 'toast', category: 'Overlay', description: 'Transient notification stack.', frameworks: ['react', 'angular'] },
  { name: 'Drawer', slug: 'drawer', category: 'Overlay', description: 'Side panel that slides in from the edge.', frameworks: ['react', 'angular'] },
  // Navigation
  { name: 'Tabs', slug: 'tabs', category: 'Navigation', description: 'Tabbed content switcher with keyboard navigation.', frameworks: ['react', 'angular'] },
  { name: 'Accordion', slug: 'accordion', category: 'Navigation', description: 'Collapsible content sections.', frameworks: ['react', 'angular'] },
  { name: 'DropdownMenu', slug: 'dropdown-menu', category: 'Navigation', description: 'Context menu with keyboard support.', frameworks: ['react', 'angular'] },
  // Feedback
  { name: 'Alert', slug: 'alert', category: 'Feedback', description: 'Inline message for info, success, warning, or error.', frameworks: ['react', 'angular'] },
  { name: 'Chips', slug: 'chips', category: 'Feedback', description: 'Compact tag/filter chips with close button.', frameworks: ['react', 'angular'] },
  // AI
  { name: 'PromptInput', slug: 'prompt-input', category: 'AI', description: 'Multi-line input with send button for AI chat.', frameworks: ['react', 'angular'] },
  { name: 'ChatBubble', slug: 'chat-bubble', category: 'AI', description: 'Message bubble for user and assistant turns.', frameworks: ['react', 'angular'] },
  { name: 'AiBadge', slug: 'ai-badge', category: 'AI', description: 'Animated AI-powered indicator badge.', frameworks: ['react', 'angular'] },
  { name: 'SuggestionChips', slug: 'suggestion-chips', category: 'AI', description: 'Row of clickable prompt suggestions.', frameworks: ['react', 'angular'] },
  { name: 'SourceCard', slug: 'source-card', category: 'AI', description: 'Citation card with title, URL, and snippet.', frameworks: ['react', 'angular'] },
  { name: 'StreamingText', slug: 'streaming-text', category: 'AI', description: 'Typewriter text for streaming AI responses.', frameworks: ['react', 'angular'] },
  { name: 'Feedback', slug: 'feedback', category: 'AI', description: 'Thumbs up/down rating for AI responses.', frameworks: ['react', 'angular'] },
  // MCP
  { name: 'McpToolCall', slug: 'mcp-tool-call', category: 'MCP', description: 'Tool execution card: idle → running → done/error with retry.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpToolForm', slug: 'mcp-tool-form', category: 'MCP', description: 'JSON Schema → dynamic form with validation.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', category: 'MCP', description: 'OAuth consent UI: scope list, approve/deny.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpScopeInspector', slug: 'mcp-scope-inspector', category: 'MCP', description: 'Expandable scope tree with human-readable descriptions.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpResourceBrowser', slug: 'mcp-resource-browser', category: 'MCP', description: 'Browse MCP resources with type icons and preview.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpServerStatus', slug: 'mcp-server-status', category: 'MCP', description: 'Connection badge: connected/disconnected/error/reconnecting.', frameworks: ['react'], isMcp: true, isNew: true },
  { name: 'McpAppFrame', slug: 'mcp-app-frame', category: 'MCP', description: 'Sandboxed iframe + postMessage bridge for MCP Apps spec.', frameworks: ['react'], isMcp: true, isNew: true },
]

export const CATEGORIES: ComponentCategory[] = ['Form', 'Display', 'Overlay', 'Navigation', 'Feedback', 'AI', 'MCP']

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentEntry[] {
  return COMPONENTS.filter((c) => c.category === category)
}
```

- [ ] **Step 2: Create `examples/web/src/components/site/ComponentCard.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ComponentEntry } from '@/data/components'

export function ComponentCard({ component }: { component: ComponentEntry }) {
  const { name, slug, category, description, frameworks, isMcp, isNew } = component
  const href = isMcp ? `/mcp/${slug}` : `/components/${slug}`

  return (
    <Link href={href}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-xl p-5 transition-all duration-200"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm" style={{ color: 'var(--site-text)' }}>{name}</span>
            {isNew && (
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: 'var(--site-accent-glow)', color: 'var(--site-accent)' }}>
                New
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--site-text-subtle)' }}>{category}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>{description}</p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          {frameworks.map((fw) => (
            <span key={fw} className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase"
              style={{ backgroundColor: 'var(--site-bg-subtle)', color: 'var(--site-text-subtle)' }}>
              {fw}
            </span>
          ))}
        </div>
        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: 'var(--site-accent)' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ border: '1px solid var(--site-border-focus)' }} />
    </Link>
  )
}
```

- [ ] **Step 3: Create `examples/web/src/app/components/page.tsx`**

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { COMPONENTS, CATEGORIES, type ComponentCategory } from '@/data/components'
import { ComponentCard } from '@/components/site/ComponentCard'

type Filter = 'All' | ComponentCategory

export default function ComponentsPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  const filtered = useMemo(
    () =>
      COMPONENTS.filter((c) => {
        const q = query.toLowerCase()
        const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        const matchesFilter = activeFilter === 'All' || c.category === activeFilter
        return matchesSearch && matchesFilter
      }),
    [query, activeFilter],
  )

  return (
    <div className="py-16">
      <div className="site-container">
        <div className="mb-10">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Components
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            38 components for AI applications. Copy-paste into React, Angular, or Vue.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--site-text-subtle)' }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components…"
              className="w-full rounded-lg py-2 pl-9 pr-10 text-sm outline-none"
              style={{
                backgroundColor: 'var(--site-bg-elevated)',
                border: '1px solid var(--site-border)',
                color: 'var(--site-text)',
              }} />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--site-text-subtle)' }} aria-label="Clear">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['All', ...CATEGORIES] as Filter[]).map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: activeFilter === cat ? 'var(--site-accent)' : 'var(--site-bg-elevated)',
                  color: activeFilter === cat ? 'oklch(1 0 0)' : 'var(--site-text-muted)',
                  border: `1px solid ${activeFilter === cat ? 'var(--site-accent)' : 'var(--site-border)'}`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-lg font-medium" style={{ color: 'var(--site-text)' }}>
              No components match &ldquo;{query}&rdquo;
            </p>
            <button onClick={() => { setQuery(''); setActiveFilter('All') }}
              className="text-sm underline underline-offset-2" style={{ color: 'var(--site-accent)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <ComponentCard key={c.slug} component={c} />)}
          </div>
        )}

        <p className="mt-6 text-sm" style={{ color: 'var(--site-text-subtle)' }}>
          {filtered.length} component{filtered.length !== 1 ? 's' : ''}
          {query && ` matching "${query}"`}
          {activeFilter !== 'All' && ` in ${activeFilter}`}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify component browser**

```bash
pnpm dev
```

Open http://localhost:3000/components. Expected: 38 cards in grid, search filters in real time, `All` and category chips work, empty state for non-matching searches.

- [ ] **Step 5: Commit**

```bash
git add examples/web/src/data/components.ts \
        examples/web/src/components/site/ComponentCard.tsx \
        examples/web/src/app/components/
git commit -m "feat(web): component browser with 38-entry registry, search + filter"
```

---

### Task 10: Build verification

**Files:**
- Modify: fix any type errors found during build

- [ ] **Step 1: Run production build**

From `examples/web/`:
```bash
pnpm build
```

Expected: Exits 0. Route table shows `/` and `/components`. Zero TypeScript errors.

- [ ] **Step 2: Fix common issues**

If the build fails, check these likely causes:

**`color-mix()` in CSS** — if Tailwind v4 doesn't like `color-mix(in oklch, ...)`, replace with `oklch(0.06 0.005 286 / 0.8)` directly in `SiteNav.tsx`.

**`framer-motion` SSR** — if motion imports cause server errors, add `'use client'` to `HeroSection.tsx` (it already imports `HeroToolCallDemo` which is client-only).

**`geist/font/sans` not found** — if the import path fails, try `import { GeistSans } from 'geist/font'` and `import { GeistMono } from 'geist/font'`.

**Missing `next-env.d.ts`** — if TypeScript can't find Next.js types, run `pnpm next build` once to generate it, then `pnpm build`.

After any fix, re-run `pnpm build` until it exits 0.

- [ ] **Step 3: Final walkthrough**

```bash
pnpm dev
```

- `/` — all 7 sections, hero animation, theme toggle dark↔light ✓
- `/components` — 38 cards, search, filter chips, empty state ✓
- Nav sticky on scroll ✓
- Footer visible on all pages ✓

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(web): Plan 3a complete — site foundation, homepage, component browser"
```

---

## Self-Review

**Spec coverage vs W1–W4:**
- ✅ W1 scaffold: Tasks 1–2 (`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `globals.css`, layout)
- ✅ W2 shared components: Tasks 3–5 (SiteNav, SiteFooter, ThemeToggle, CodeBlock, CopyButton, InstallCommand)
- ✅ W3 homepage all 9 sections: Tasks 6–8 (hero, proof strip, features, bento, MCP, framework tabs, CTA, assembled)
- ✅ W4 data + browser: Task 9 (38-entry `components.ts`, ComponentCard, `/components` page with search + filter)
- ✅ Build verification: Task 10

**Homepage spec checklist:**
- ✅ Badge chip: "MCP UI · React · Angular · Vue"
- ✅ H1: "The UI kit for / MCP applications." with accent color
- ✅ Subhead + CTAs (Get Started + Browse Components)
- ✅ Install command with animate prop
- ✅ Animated McpToolCall demo (idle/running/done loop)
- ✅ Proof strip with 5 stats
- ✅ 6-card feature grid with correct icons and copy
- ✅ Bento showcase grid (12 cards, category chips)
- ✅ MCP section with indigo top border, 7 component cards, status chips
- ✅ Framework tabs (React/Angular/Vue) with real code examples
- ✅ Copy-paste CTA with animated install + CLI output
- ✅ 4-column footer with MIT badge

**Type consistency:**
- `ComponentEntry` defined once in `data/components.ts`, imported by `ComponentCard` and `components/page.tsx`
- `Framework` union `'react' | 'angular' | 'vue'` consistent across all files
- `getGitHubStars` returns `Promise<number>`, used in `async` `SiteNav` ✓
- `HeroToolCallDemo` is `'use client'`, `HeroSection` imports it (no SSR conflict) ✓
- `InstallCommand` is `'use client'`, used in `HeroSection` (Server Component) — Next.js handles client components inside server components correctly ✓

**No placeholders:** All steps contain complete code.
