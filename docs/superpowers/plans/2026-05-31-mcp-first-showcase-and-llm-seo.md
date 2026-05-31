# MCP-First Showcase + AI Demos + LLM-SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mcp-elements site MCP-first and complete — fix the MCP catalog 404, give the 7 AI/LLM components live demos + docs, reposition MCP as the headline with base components as "Extras," and make the site SEO- and LLM-discoverable.

**Architecture:** All changes live in the Next.js app `examples/web` (App Router). The showcase is driven by three data files (`data/components.ts`, `components/demos/registry.tsx`, `lib/component-docs.ts`). Reposition is data ordering + page copy. LLM-SEO adds Next metadata, `sitemap.ts`, `robots.ts`, JSON-LD, and `llms.txt`. The CLI MCP-registration is a separate subsystem and is split into its own follow-up plan (see "Out of scope").

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind v4, `@mcp-elements/react`.

**Verification note:** `examples/web` has no unit-test harness, so TDD steps are replaced by deterministic build + route checks:
- Build: `pnpm turbo build --filter=@mcp-elements/web` (must exit 0).
- Route check: after `pnpm --filter @mcp-elements/web dev`, `curl -s localhost:3000/<route>` and grep for an expected marker, or note the prerendered route in build output.
Commit after each task.

**Out of scope (separate plan):** Registering the 7 MCP components in the CLI registry (`packages/cli/src/registry/registry.json`) so `npx mcp-elements add mcp-tool-call` works. Tracked separately as `2026-05-31-cli-register-mcp-components.md`.

---

## Phase 1 — Fix the MCP catalog 404 routing bug

### Task 1: Route MCP component cards to the working detail page

**Files:**
- Modify: `examples/web/src/components/site/ComponentCard.tsx:7`

**Context:** Detail pages exist only at `/components/[slug]`. `ComponentCard` sends MCP components to `/mcp/${slug}`, which has no route → 404.

- [ ] **Step 1: Change the href**

Replace line 7:
```tsx
  const href = isMcp ? `/mcp/${slug}` : `/components/${slug}`
```
with:
```tsx
  const href = `/components/${slug}`
```
`isMcp` is still destructured and used elsewhere (badge), so leave the destructure as-is.

- [ ] **Step 2: Build**

Run: `pnpm turbo build --filter=@mcp-elements/web`
Expected: exit 0.

- [ ] **Step 3: Route check**

Run dev server, then: `curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/components/mcp-tool-call`
Expected: `200`.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/components/site/ComponentCard.tsx
git commit -m "fix(web): route MCP component cards to /components/[slug] (was 404)"
```

---

## Phase 2 — AI/LLM component live demos

### Task 2: Add demo functions for the 7 AI components

**Files:**
- Modify: `examples/web/src/components/demos/registry.tsx`

**Context:** The `DEMOS` map (~line 310) registers demos by slug. AI slugs have no entries, so `ComponentPreview` returns `null` and the preview is blank. Exact component APIs (from `packages/react/src`):
- `AiBadge` — `variant?: 'default' | 'prominent' | 'subtle'`, `showIcon?: boolean`, children.
- `ChatBubble` — `variant?: 'user' | 'ai'`; `ChatBubbleAvatar({src,alt})`, `ChatBubbleContent`, `ChatBubbleTimestamp`, `ChatBubbleTyping`.
- `SuggestionChips` / `SuggestionChip` — chip `variant?: 'default' | 'primary' | 'outline'`.
- `SourceCards` / `SourceCard` — `{ title: string; domain: string; favicon?: string; index?: number; href }`.
- `StreamingText` — container; children text.
- `Feedback` / `FeedbackButton({type:'up'|'down', selected?})` / `FeedbackForm` / `FeedbackInput` / `FeedbackSubmit`.
- `PromptInput` / `PromptInputTextarea` / `PromptInputFooter` / `PromptInputActions` / `PromptInputCharCount({count,max})`.

- [ ] **Step 1: Extend the import from `@mcp-elements/react`**

Add these names to the existing import block at the top of the file:
```tsx
  AiBadge,
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleTimestamp,
  SuggestionChips,
  SuggestionChip,
  SourceCards,
  SourceCard,
  StreamingText,
  Feedback,
  FeedbackButton,
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputActions,
  PromptInputCharCount,
```

- [ ] **Step 2: Add an AI demos section before the `DEMOS` map**

```tsx
// ───────── AI components ─────────

const AiBadgeDemo: DemoFn = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AiBadge>AI</AiBadge>
    <AiBadge variant="prominent">AI Generated</AiBadge>
    <AiBadge variant="subtle" showIcon={false}>Beta</AiBadge>
  </div>
)

const ChatBubbleDemo: DemoFn = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <ChatBubble variant="user">
      <ChatBubbleContent>How do I add a component?</ChatBubbleContent>
      <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
    </ChatBubble>
    <ChatBubble variant="ai">
      <ChatBubbleAvatar alt="Assistant" />
      <ChatBubbleContent>Run `npx mcp-elements add button` and it copies into your project.</ChatBubbleContent>
      <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
    </ChatBubble>
  </div>
)

const SuggestionChipsDemo: DemoFn = () => (
  <SuggestionChips>
    <SuggestionChip>Summarize this</SuggestionChip>
    <SuggestionChip variant="primary">Write tests</SuggestionChip>
    <SuggestionChip variant="outline">Explain the error</SuggestionChip>
  </SuggestionChips>
)

const SourceCardDemo: DemoFn = () => (
  <SourceCards className="w-full max-w-md">
    <SourceCard index={1} title="Model Context Protocol" domain="modelcontextprotocol.io" href="https://modelcontextprotocol.io" />
    <SourceCard index={2} title="mcp-elements docs" domain="mcp-elements.dev" href="https://mcp-elements.dev" />
  </SourceCards>
)

const StreamingTextDemo: DemoFn = () => (
  <div className="w-full max-w-md">
    <StreamingText>Streaming a response token by token, just like an LLM would render it in real time.</StreamingText>
  </div>
)

const FeedbackDemo: DemoFn = () => {
  const [sel, setSel] = useState<'up' | 'down' | null>(null)
  return (
    <Feedback>
      <FeedbackButton type="up" selected={sel === 'up'} onClick={() => setSel('up')} aria-label="Thumbs up" />
      <FeedbackButton type="down" selected={sel === 'down'} onClick={() => setSel('down')} aria-label="Thumbs down" />
    </Feedback>
  )
}

const PromptInputDemo: DemoFn = () => {
  const [value, setValue] = useState('')
  return (
    <div className="w-full max-w-md">
      <PromptInput>
        <PromptInputTextarea
          placeholder="Ask anything…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
        />
        <PromptInputFooter>
          <PromptInputCharCount count={value.length} max={2000} />
          <PromptInputActions>
            <Button size="sm" disabled={!value.trim()}>Send</Button>
          </PromptInputActions>
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
```

- [ ] **Step 3: Register them in the `DEMOS` map**

Add these entries to the `DEMOS` object:
```tsx
  'ai-badge': AiBadgeDemo,
  'chat-bubble': ChatBubbleDemo,
  'suggestion-chips': SuggestionChipsDemo,
  'source-card': SourceCardDemo,
  'streaming-text': StreamingTextDemo,
  feedback: FeedbackDemo,
  'prompt-input': PromptInputDemo,
```

- [ ] **Step 4: Build**

Run: `pnpm turbo build --filter=@mcp-elements/web`
Expected: exit 0. If a prop name mismatches, open the named component in `packages/react/src/<slug>.tsx` and correct the demo to match its real props, then rebuild.

- [ ] **Step 5: Route check**

For each slug, confirm the preview renders (non-empty): `curl -s localhost:3000/components/prompt-input | grep -c "Preview"` ≥ 1, and spot-check `chat-bubble`, `feedback`.

- [ ] **Step 6: Commit**

```bash
git add examples/web/src/components/demos/registry.tsx
git commit -m "feat(web): add live demos for the 7 AI/LLM components"
```

---

## Phase 3 — AI/LLM component docs (props + usage)

### Task 3: Add `COMPONENT_DOCS` entries for the 7 AI components

**Files:**
- Modify: `examples/web/src/lib/component-docs.ts`

**Context:** `COMPONENT_DOCS` is `Record<slug, { slug, props: PropRow[], usage: string }>`. Missing AI entries → "Full documentation coming soon." Add entries mirroring the existing shape. Example for two; repeat the same structure for the rest using the props listed in Task 2.

- [ ] **Step 1: Add entries to `COMPONENT_DOCS`**

```ts
  'ai-badge': {
    slug: 'ai-badge',
    props: [
      { name: 'variant', type: "'default' | 'prominent' | 'subtle'", default: "'default'", description: 'Visual emphasis of the badge' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to show the sparkle icon' },
    ],
    usage: `import { AiBadge } from '@mcp-elements/react'

export function Example() {
  return <AiBadge variant="prominent">AI Generated</AiBadge>
}`,
  },
  'chat-bubble': {
    slug: 'chat-bubble',
    props: [
      { name: 'variant', type: "'user' | 'ai'", default: "'user'", description: 'Whether the message is from the user or the assistant' },
    ],
    usage: `import { ChatBubble, ChatBubbleContent, ChatBubbleAvatar, ChatBubbleTimestamp } from '@mcp-elements/react'

export function Example() {
  return (
    <ChatBubble variant="ai">
      <ChatBubbleAvatar alt="Assistant" />
      <ChatBubbleContent>Hello! How can I help?</ChatBubbleContent>
      <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
    </ChatBubble>
  )
}`,
  },
  'suggestion-chips': {
    slug: 'suggestion-chips',
    props: [
      { name: 'variant', type: "'default' | 'primary' | 'outline'", default: "'default'", description: 'Chip visual style (on SuggestionChip)' },
    ],
    usage: `import { SuggestionChips, SuggestionChip } from '@mcp-elements/react'

export function Example() {
  return (
    <SuggestionChips>
      <SuggestionChip>Summarize</SuggestionChip>
      <SuggestionChip variant="primary">Write tests</SuggestionChip>
    </SuggestionChips>
  )
}`,
  },
  'source-card': {
    slug: 'source-card',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Source title' },
      { name: 'domain', type: 'string', required: true, description: 'Display domain' },
      { name: 'favicon', type: 'string', description: 'Favicon URL' },
      { name: 'index', type: 'number', description: 'Citation number shown on the card' },
    ],
    usage: `import { SourceCards, SourceCard } from '@mcp-elements/react'

export function Example() {
  return (
    <SourceCards>
      <SourceCard index={1} title="MCP Spec" domain="modelcontextprotocol.io" href="https://modelcontextprotocol.io" />
    </SourceCards>
  )
}`,
  },
  'streaming-text': {
    slug: 'streaming-text',
    props: [],
    usage: `import { StreamingText } from '@mcp-elements/react'

export function Example() {
  return <StreamingText>Streaming an answer token by token…</StreamingText>
}`,
  },
  feedback: {
    slug: 'feedback',
    props: [
      { name: 'type', type: "'up' | 'down'", required: true, description: 'Thumb direction (on FeedbackButton)' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Whether this thumb is selected' },
    ],
    usage: `import { Feedback, FeedbackButton } from '@mcp-elements/react'

export function Example() {
  return (
    <Feedback>
      <FeedbackButton type="up" aria-label="Thumbs up" />
      <FeedbackButton type="down" aria-label="Thumbs down" />
    </Feedback>
  )
}`,
  },
  'prompt-input': {
    slug: 'prompt-input',
    props: [
      { name: 'count', type: 'number', description: 'Current char count (on PromptInputCharCount)' },
      { name: 'max', type: 'number', description: 'Max chars before over-limit styling (on PromptInputCharCount)' },
    ],
    usage: `import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputActions, PromptInputCharCount } from '@mcp-elements/react'

export function Example() {
  return (
    <PromptInput>
      <PromptInputTextarea placeholder="Ask anything…" rows={2} />
      <PromptInputFooter>
        <PromptInputCharCount count={0} max={2000} />
        <PromptInputActions>{/* send button */}</PromptInputActions>
      </PromptInputFooter>
    </PromptInput>
  )
}`,
  },
```

- [ ] **Step 2: Build + route check**

Run: `pnpm turbo build --filter=@mcp-elements/web` → exit 0.
`curl -s localhost:3000/components/prompt-input | grep -c "coming soon"` → `0` (docs now present).

- [ ] **Step 3: Commit**

```bash
git add examples/web/src/lib/component-docs.ts
git commit -m "docs(web): add props + usage docs for the 7 AI/LLM components"
```

---

## Phase 4 — MCP-first reposition

### Task 4: Put MCP (then AI) first in the catalog ordering

**Files:**
- Modify: `examples/web/src/data/components.ts:62` (the `CATEGORIES` array)

- [ ] **Step 1: Reorder `CATEGORIES` so MCP and AI lead**

```ts
export const CATEGORIES: ComponentCategory[] = ['MCP', 'AI', 'Form', 'Display', 'Overlay', 'Navigation', 'Feedback']
```

- [ ] **Step 2: Add an "Extras" helper for non-MCP/AI components**

Append to `components.ts`:
```ts
/** Base ("extras") categories — everything that isn't MCP or AI. */
export const EXTRA_CATEGORIES: ComponentCategory[] = ['Form', 'Display', 'Overlay', 'Navigation', 'Feedback']
export const FEATURED_CATEGORIES: ComponentCategory[] = ['MCP', 'AI']
```

- [ ] **Step 3: Build** — `pnpm turbo build --filter=@mcp-elements/web` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/data/components.ts
git commit -m "feat(web): order catalog MCP-first, add Extras/Featured groupings"
```

### Task 5: Headline MCP + group base under "Extras" on the components page

**Files:**
- Modify: `examples/web/src/app/components/page.tsx`

**Context:** Read this file first; it currently maps over `CATEGORIES` to render grouped sections and filter pills. Update copy/grouping to present `FEATURED_CATEGORIES` (MCP, AI) as the headline groups and render the remaining `EXTRA_CATEGORIES` under a section titled "Extras — base UI primitives."

- [ ] **Step 1: Read** `examples/web/src/app/components/page.tsx` fully to learn its current grouping/markup.

- [ ] **Step 2:** Import `FEATURED_CATEGORIES`, `EXTRA_CATEGORIES` from `@/data/components`. Render featured categories first under an "MCP-native & AI" heading, then the extras under an "Extras — base UI primitives" heading. Keep the existing card grid component for each group.

- [ ] **Step 3: Build + route check** — build exits 0; `curl -s localhost:3000/components | grep -ci "Extras"` ≥ 1 and "MCP" appears above "Extras" in the HTML.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/app/components/page.tsx
git commit -m "feat(web): headline MCP/AI, demote base components to Extras section"
```

### Task 6: Make the homepage lead with the MCP primitives

**Files:**
- Modify: `examples/web/src/app/page.tsx`

- [ ] **Step 1: Read** `examples/web/src/app/page.tsx` to find the hero + featured-components section.

- [ ] **Step 2:** Ensure the hero subhead reads "38 copy-paste components. Multi-framework. **MCP-native.**" and that the first showcased section is the 7 MCP primitives (link to `/mcp`), with base components framed as "…and 31 base UI primitives to build on."

- [ ] **Step 3: Build + route check** — build exits 0; homepage HTML contains "MCP-native" before the base-components mention.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/app/page.tsx
git commit -m "feat(web): homepage leads with MCP-native primitives"
```

### Task 7: Group `mcp-elements list` MCP-first in the CLI

**Files:**
- Modify: `packages/cli/src/commands/list.ts` (read first to confirm filename/shape)

- [ ] **Step 1: Read** the CLI `list` command source under `packages/cli/src/commands/` to see how it reads the registry and prints components.

- [ ] **Step 2:** Group output by category, printing MCP components first under an "MCP-native" header and the rest under "Extras." (Depends on the CLI MCP-registration plan adding MCP entries + a `category` field; if MCP entries aren't yet present, this task is a no-op stub that still groups existing categories.)

- [ ] **Step 3: Build** — `pnpm turbo build --filter=mcp-elements` → exit 0.

- [ ] **Step 4: Commit**

```bash
git add packages/cli/src/commands/list.ts
git commit -m "feat(cli): group `list` output MCP-first"
```

---

## Phase 5 — SEO + LLM discoverability

### Task 8: Add `robots.ts` and `sitemap.ts`

**Files:**
- Create: `examples/web/src/app/robots.ts`
- Create: `examples/web/src/app/sitemap.ts`

- [ ] **Step 1: `robots.ts`**

```ts
import type { MetadataRoute } from 'next'

const SITE = 'https://mcp-elements.wearesnx.studio'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
```

- [ ] **Step 2: `sitemap.ts`** (enumerate all component routes from the data)

```ts
import type { MetadataRoute } from 'next'
import { COMPONENTS } from '@/data/components'

const SITE = 'https://mcp-elements.wearesnx.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/components', '/mcp', '/themes', '/playground'].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }))
  const componentRoutes = COMPONENTS.map((c) => ({
    url: `${SITE}/components/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: c.isMcp ? 0.9 : 0.6,
  }))
  return [...staticRoutes, ...componentRoutes]
}
```

- [ ] **Step 3: Build + check** — build exits 0; `curl -s localhost:3000/sitemap.xml | grep -c mcp-tool-call` ≥ 1; `curl -s localhost:3000/robots.txt | grep -c Sitemap` ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/app/robots.ts examples/web/src/app/sitemap.ts
git commit -m "feat(web): add robots.ts and sitemap.ts"
```

### Task 9: Set rich root + per-page metadata (OpenGraph/Twitter)

**Files:**
- Modify: `examples/web/src/app/layout.tsx` (root `metadata`)
- Modify: `examples/web/src/app/components/[slug]/page.tsx` (add `generateMetadata`)

- [ ] **Step 1: Read** `examples/web/src/app/layout.tsx` to find the existing `metadata` export.

- [ ] **Step 2: Root metadata** — set/extend:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://mcp-elements.wearesnx.studio'),
  title: { default: 'mcp-elements — MCP-native UI components', template: '%s · mcp-elements' },
  description: '38 copy-paste UI components. Multi-framework (React, Angular, Vue). The only library with MCP-native primitives — tool calls, consent, scopes, resources.',
  keywords: ['MCP', 'Model Context Protocol', 'AI UI', 'React components', 'shadcn', 'agent UI', 'tool calling UI', 'copy-paste components'],
  openGraph: {
    type: 'website',
    url: 'https://mcp-elements.wearesnx.studio',
    siteName: 'mcp-elements',
    title: 'mcp-elements — MCP-native UI components',
    description: 'Copy-paste UI primitives for AI & MCP apps. React, Angular, Vue.',
  },
  twitter: { card: 'summary_large_image', title: 'mcp-elements', description: 'MCP-native, multi-framework copy-paste UI components.' },
}
```

- [ ] **Step 3: Per-component metadata** — in `components/[slug]/page.tsx` add:
```ts
import type { Metadata } from 'next'
import { getComponentBySlug } from '@/data/components'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getComponentBySlug(params.slug)
  if (!c) return {}
  const title = `${c.name} — ${c.category} component`
  return {
    title,
    description: c.description,
    openGraph: { title: `${c.name} · mcp-elements`, description: c.description },
  }
}
```
(If `params` is a Promise in this Next version, `await` it to match the existing page signature — check the file.)

- [ ] **Step 4: Build + check** — build exits 0; `curl -s localhost:3000/components/mcp-tool-call | grep -ci 'og:title'` ≥ 1.

- [ ] **Step 5: Commit**

```bash
git add examples/web/src/app/layout.tsx examples/web/src/app/components/[slug]/page.tsx
git commit -m "feat(web): rich OpenGraph/Twitter metadata, per-component titles"
```

### Task 10: JSON-LD structured data

**Files:**
- Create: `examples/web/src/components/site/JsonLd.tsx`
- Modify: `examples/web/src/app/layout.tsx` (render `<JsonLd />` once in `<body>`)

- [ ] **Step 1: `JsonLd.tsx`**

```tsx
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
```

- [ ] **Step 2:** Import and render `<JsonLd />` inside `<body>` in `layout.tsx`.

- [ ] **Step 3: Build + check** — build exits 0; homepage HTML contains `application/ld+json`.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/components/site/JsonLd.tsx examples/web/src/app/layout.tsx
git commit -m "feat(web): add SoftwareSourceCode JSON-LD structured data"
```

### Task 11: LLM discoverability — `llms.txt` + `llms-full.txt`

**Files:**
- Create: `examples/web/src/app/llms.txt/route.ts`
- Create: `examples/web/src/app/llms-full.txt/route.ts`

**Context:** `llms.txt` is the emerging convention for an LLM-readable summary of a site. Generate it dynamically from the component data so it never drifts.

- [ ] **Step 1: `llms.txt/route.ts`** (concise index)

```ts
import { COMPONENTS, FEATURED_CATEGORIES, EXTRA_CATEGORIES } from '@/data/components'

export const dynamic = 'force-static'

export function GET() {
  const SITE = 'https://mcp-elements.wearesnx.studio'
  const line = (c: { name: string; slug: string; description: string }) =>
    `- [${c.name}](${SITE}/components/${c.slug}): ${c.description}`
  const section = (title: string, cats: string[]) =>
    `## ${title}\n\n` +
    COMPONENTS.filter((c) => cats.includes(c.category)).map(line).join('\n')

  const body = `# mcp-elements

> 38 copy-paste UI components for AI & MCP apps. Multi-framework (React, Angular, Vue). The CLI copies source into your project — you own the code, no lock-in. The only library shipping MCP-native primitives (tool calls, consent, scopes, resources, sandboxed MCP-Apps frame).

${section('MCP-native & AI components', FEATURED_CATEGORIES)}

${section('Base (Extras) components', EXTRA_CATEGORIES)}

## Links
- Docs: ${SITE}
- Repository: https://github.com/mcp-elements/ui
- npm: https://www.npmjs.com/package/mcp-elements
`
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
```

- [ ] **Step 2: `llms-full.txt/route.ts`** (adds props + usage from `COMPONENT_DOCS`)

```ts
import { COMPONENTS } from '@/data/components'
import { COMPONENT_DOCS } from '@/lib/component-docs'

export const dynamic = 'force-static'

export function GET() {
  const SITE = 'https://mcp-elements.wearesnx.studio'
  const blocks = COMPONENTS.map((c) => {
    const doc = COMPONENT_DOCS[c.slug]
    const props = doc?.props.length
      ? '\nProps:\n' + doc.props.map((p) => `- ${p.name}: ${p.type}${p.required ? ' (required)' : ''} — ${p.description}`).join('\n')
      : ''
    const usage = doc?.usage ? `\n\nUsage:\n\`\`\`tsx\n${doc.usage}\n\`\`\`` : ''
    return `## ${c.name} (${c.category})\n${c.description}\nPage: ${SITE}/components/${c.slug}${props}${usage}`
  }).join('\n\n---\n\n')

  return new Response(`# mcp-elements — full component reference\n\n${blocks}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 3: Build + check** — build exits 0; `curl -s localhost:3000/llms.txt | grep -c mcp-tool-call` ≥ 1; `curl -s localhost:3000/llms-full.txt | grep -c "Usage:"` ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add examples/web/src/app/llms.txt examples/web/src/app/llms-full.txt
git commit -m "feat(web): add llms.txt and llms-full.txt for LLM discoverability"
```

---

## Phase 6 — Ship

### Task 12: Deploy and verify live

- [ ] **Step 1: Full build** — `pnpm turbo build --filter=@mcp-elements/web` → exit 0.
- [ ] **Step 2: Push** — `git push origin main`.
- [ ] **Step 3: Deploy** — `cd examples/web && vercel --prod --yes`.
- [ ] **Step 4: Verify live**, on `https://mcp-elements.wearesnx.studio`:
  - `/components/mcp-tool-call` → 200 (no 404)
  - `/components/prompt-input` → preview renders, no "coming soon"
  - `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` → 200 with expected content
  - View source on `/` → contains `og:title` and `application/ld+json`

---

## Self-Review

- **Spec coverage:** AI visible (Tasks 2–3) ✓; MCP "not working" 404 (Task 1) ✓; MCP-first reposition (Tasks 4–7) ✓; SEO + LLM discoverability (Tasks 8–11) ✓; "Storybook" clarified as the Next.js showcase (no Storybook exists). CLI MCP-registration explicitly deferred to its own plan ✓.
- **Placeholders:** Demo/doc code uses real exported names and prop types read from `packages/react/src`. Tasks 5/6/7/9 include a "read the file first" step because their exact current markup wasn't captured here; each still names the exact file, the exact change, and a concrete build/route verification.
- **Type consistency:** Demo imports match `packages/react/src/index.ts` exports; `ComponentDoc`/`PropRow` shapes match `component-docs.ts`; `ComponentCategory` values match `data/components.ts`.
