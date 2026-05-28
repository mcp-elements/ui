# Spec: mcp-elements Full Site Redesign

**Date:** 2026-05-28
**Status:** Approved
**Replaces:** Existing Astro/Starlight docs site at `examples/docs/`

---

## 1. Goal

Replace the current Astro/Starlight docs site with a fully custom Next.js 15 site that:

- Positions mcp-elements as the definitive MCP UI library
- Looks production-grade (Vercel/shadcn.ui-level polish)
- Drives GitHub stars via a compelling hero + showcase
- Ships complete documentation for all 38+ components
- Includes an MCP primitives showcase (the unique differentiator)
- Provides a live code playground
- Is fast, accessible, and mobile-responsive

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Same as shadcn.ui, Radix UI, Vercel docs |
| Language | TypeScript 5.7+ | Strict mode |
| Package manager | pnpm (workspace) | Existing monorepo setup |
| Styling | **Tailwind CSS v4** + existing `@mcp-elements/css` | Reuse all design tokens from `packages/css/` |
| Fonts | **Geist Sans + Geist Mono** via `next/font/local` (bundled in Next.js 15) | Clean, modern, Vercel-grade |
| Animation | **Framer Motion** | Hero animations, scroll reveals, transitions |
| Code highlighting | **Shiki** (`bright` or `rehype-pretty-code`) | Accurate, zero-flash, dark/light aware |
| Playground | **Sandpack** (`@codesandbox/sandpack-react`) | In-browser live editor with real `@mcp-elements/react` |
| MDX | `@next/mdx` + `rehype-pretty-code` + `remark-gfm` | Component documentation pages |
| Icons | **Lucide React** | Consistent with existing usage |
| Metadata | `next/og` for social images | Auto-generated OG per component |
| Deploy | **Vercel** | `examples/web/` → `mcp-elements.dev` |

**Location in repo:** `examples/web/` (new package, alongside `examples/react-app/`, `examples/angular-app/`)

**Package name:** `@mcp-elements/web` (private, not published to npm)

**Workspace deps:** `@mcp-elements/react`, `@mcp-elements/core`, `@mcp-elements/css` imported directly.

---

## 3. Site Map

```
/                        Marketing homepage
/components              Component browser (all 38+)
/components/[slug]       Per-component docs + live demo + props
/mcp                     MCP primitives marketing/showcase page
/mcp/[slug]              Per-MCP-component docs
/playground              Full live code editor (Sandpack)
/themes                  Visual theme picker + token reference
```

No `/docs/` prefix — this is the primary domain, not a docs subdomain.

---

## 4. Design Language

### 4.1 Color Palette (dark-first)

The site is **dark-first**. Light mode is supported via `data-theme="light"` attribute.

```css
/* Dark mode (default) */
--site-bg:           oklch(0.06 0.005 286);   /* near-black */
--site-bg-elevated:  oklch(0.10 0.007 286);   /* card surfaces */
--site-bg-subtle:    oklch(0.13 0.007 286);   /* hover states */
--site-border:       oklch(0.18 0.008 286);   /* hairlines */
--site-border-focus: oklch(0.637 0.174 265);  /* accent */
--site-text:         oklch(0.95 0 0);         /* primary text */
--site-text-muted:   oklch(0.55 0.012 286);   /* secondary text */
--site-text-subtle:  oklch(0.38 0.010 286);   /* tertiary/disabled */
--site-accent:       oklch(0.637 0.174 265);  /* electric indigo */
--site-accent-dim:   oklch(0.45 0.15 265);    /* darker accent */
--site-accent-glow:  oklch(0.637 0.174 265 / 0.12); /* glow bg */
--site-success:      oklch(0.72 0.17 145);    /* green */
--site-warning:      oklch(0.82 0.18 85);     /* amber */
--site-error:        oklch(0.62 0.22 25);     /* red */
```

These extend (do not replace) the existing `packages/css/base.css` tokens. The site uses `--site-*` for layout/chrome; `--color-*` from `packages/css/base.css` inside component demos.

### 4.2 Typography

```
Heading 1:   Geist Sans, 800, 3.5–5rem, letter-spacing: -0.03em
Heading 2:   Geist Sans, 700, 2–3rem, letter-spacing: -0.02em
Heading 3:   Geist Sans, 600, 1.25–1.5rem
Body:        Geist Sans, 400, 1rem, line-height: 1.7
Code inline: Geist Mono, 400, 0.875em, bg: --site-bg-elevated
Code block:  Geist Mono, 400, 0.8125rem
Label:       Geist Sans, 500, 0.75rem, letter-spacing: 0.08em, uppercase
```

### 4.3 Motion

All animations use Framer Motion. Philosophy: subtle, purposeful, fast.

```
Page transitions:    fade + translateY(8px), duration 0.2s
Scroll reveals:      opacity 0→1 + translateY(16px), stagger 0.05s
Hero card loop:      Framer Motion keyframes, 4s cycle
Hover states:        CSS transitions, 0.15s ease
Spring physics:      stiffness: 300, damping: 30 (for interactive elements)
```

Respect `prefers-reduced-motion` — disable all animations when set.

### 4.4 Layout

```
Max content width:   1280px
Gutter (desktop):    2rem
Gutter (mobile):     1rem
Nav height:          64px (sticky)
Section padding:     6rem vertical (desktop), 4rem (mobile)
Card radius:         0.75rem
Input radius:        0.5rem
```

---

## 5. Shared Components (site-level)

These live in `src/components/site/` and are NOT mcp-elements components — they are the site's own UI.

| Component | Purpose |
|---|---|
| `<SiteNav>` | Sticky top nav with logo, links, GitHub button, theme toggle |
| `<SiteFooter>` | Links, social, MIT badge |
| `<CodeBlock>` | Shiki-powered code block with copy button, line highlighting, language badge |
| `<ComponentPreview>` | Sandpack-powered live preview with code toggle |
| `<PropsTable>` | Typed props table from source (auto-generated or MDX-authored) |
| `<InstallCommand>` | Animated terminal showing `npx mcp-elements add <name>` |
| `<FrameworkTabs>` | React/Angular/Vue tab switcher for code samples |
| `<CopyButton>` | Copy-to-clipboard with animation |
| `<ThemeToggle>` | Dark/light toggle (site chrome) |
| `<Breadcrumb>` | For component/MCP doc pages |

---

## 6. Page Specs

### 6.1 Homepage (`/`)

**Section order:**

#### 6.1.1 Navbar
- Logo: wordmark `mcp-elements` in Geist Mono + small indigo dot
- Nav links: `Components` / `MCP` / `Playground` / `Themes`
- Right side: GitHub star button (live count from GitHub API, cached 1h), `v0.1` version chip, theme toggle
- Background: `--site-bg` with 60% opacity + backdrop blur on scroll
- Mobile: hamburger → slide-in drawer

#### 6.1.2 Hero
- **Left column (text)**
  - Badge chip: `"MCP UI · React · Angular · Vue"` with indigo border + glow
  - H1 (2 lines): `"The UI kit for`  /  `MCP applications."`
  - Subhead: `"Pre-built consent dialogs, tool-call cards, and scope inspectors. Copy-paste into any framework. No runtime lock-in."`
  - CTA row: `[Get Started →]` (filled indigo) + `[Browse Components]` (outline)
  - Install command: `npx mcp-elements add mcp-tool-call` with animated blinking cursor + copy icon
- **Right column (demo)**
  - Floating `McpToolCall` card cycling through 3 states with Framer Motion:
    1. **Idle** (0–0.8s): card appears, tool name `search_files`, args shown, status `idle`
    2. **Running** (0.8–2.5s): progress bar animates 0→100%, status badge `running` (amber pulse)
    3. **Done** (2.5–4s): status `done` (green), result text fades in: `"Found 47 TypeScript files"`
    4. Loop back to idle with crossfade
  - Subtle radial glow (indigo) behind the card
  - Two smaller ghost cards partially visible at top and bottom edges (depth effect)
- **Full bleed dark section**, no border below

#### 6.1.3 Proof strip
Single full-width bar, muted text, centered:
```
97M+ monthly MCP downloads  ·  9,652+ servers  ·  React · Angular · Vue  ·  MIT License  ·  Copy-paste
```

#### 6.1.4 Feature cards ("Why mcp-elements")
3-column grid (1 col mobile, 3 col desktop). Each card:
- Icon (Lucide, 20px, accent color)
- H3 title
- Body text (2 lines max)

| Icon | Title | Body |
|---|---|---|
| `<Layers />` | MCP-native | The only library with pre-built consent dialogs, tool-call cards, and scope inspectors. |
| `<Globe2 />` | Every framework | React, Angular, Vue. Same API, same design tokens, same copy-paste CLI. |
| `<Clipboard />` | You own the code | Components are copied into your project. No runtime dependency, no version lock-in. |
| `<Palette />` | Beautiful by default | OKLCH design tokens, dark/glass/light themes, Tailwind v4. Looks great out of the box. |
| `<Accessibility />` | Accessible first | WAI-ARIA patterns, keyboard navigation, screen reader support — built into core. |
| `<Zap />` | Framework-free core | Pure TypeScript state machines. OAuth PKCE, tool-state, schema-form — no framework required. |

#### 6.1.5 Component showcase (bento grid)
Heading: `"38 components. Ready to copy."` + `[View all →]` link.

Upgraded bento grid — 3 asymmetric columns, 12–14 cards, mix of sizes. Cards:
- Hover: subtle lift + border brightens
- Each card: component name label (top-left chip) + live component demo
- Featured large cards: `McpToolCall` (animated), `McpConsentDialog` (interactive)
- Normal-size cards: Button, Input, Card, Badge, Switch, Tabs, Alert, ChatBubble, Progress, Select
- Background: `--site-bg-elevated` with `1px solid --site-border`

#### 6.1.6 MCP primitives section
Full-width dark section with indigo accent border at top.

Heading: `"The primitives MCP was missing."`
Subhead: `"Every MCP application needs server consent, tool call UI, and scope inspection. Nobody ships them as copy-paste primitives. Until now."`

7-card grid (auto-fit, min 280px). Each card:
- Component name + status chip (`stable` / `preview`)
- One-line description
- Miniature live demo (non-interactive, just visual)
- `[Docs →]` link

| Component | Status | Description |
|---|---|---|
| `McpToolCall` | stable | Tool execution card: idle → running → done/error with retry |
| `McpToolForm` | stable | JSON Schema → dynamic form with validation |
| `McpConsentDialog` | stable | OAuth consent UI: scope list, approve/deny |
| `McpScopeInspector` | stable | Expandable scope tree with human-readable descriptions |
| `McpResourceBrowser` | stable | Browse MCP resources with type icons and preview |
| `McpServerStatus` | stable | Connection badge: connected/disconnected/error/reconnecting |
| `McpAppFrame` | preview | Sandboxed iframe + postMessage bridge for MCP Apps spec |

#### 6.1.7 Framework section
Heading: `"Your framework. Same components."`
Subhead: `"React, Angular, and Vue — all supported at launch. Svelte and web components coming in Phase 2."`

3-tab code block (React / Angular / Vue) showing `McpToolCall` usage in each framework. Code animates/crossfades on tab switch. Framework logos displayed.

#### 6.1.8 Copy-paste CTA
Dark card, centered, full-width inner:
- H2: `"Own your code."`
- Body: `"Run one command. The CLI copies source files into your project. No npm dependency for components — just code you control."`
- Animated terminal: types `npx mcp-elements add mcp-tool-call` → shows file listing:
  ```
  ✓  css/components/mcp-tool-call.css
  ✓  react/mcp/mcp-tool-call.tsx
  ✓  core/mcp/tool-state.ts
  ```
- CTA: `[Read the docs →]`

#### 6.1.9 Footer
4-column grid (stacks on mobile):
- Col 1: Logo + tagline + MIT badge
- Col 2: Documentation links (Getting Started, Components, MCP, Playground)
- Col 3: Community (GitHub, Issues, Discussions, Changelog)
- Col 4: Framework (React, Angular, Vue, CLI)
- Bottom strip: `© 2026 mcp-elements · MIT License · Built with ☕`

---

### 6.2 Component Browser (`/components`)

**Layout:** Full-width page, no sidebar.

**Top section:**
- H1: `"Components"`
- Subhead: `"38 components for AI applications. Copy-paste into React, Angular, or Vue."`
- Search input (full-width on mobile, 400px on desktop) — filters in real-time, no server round-trip
- Filter chips: `All · Form · Display · Overlay · Navigation · Feedback · AI · MCP` — active chip has accent bg

**Grid section:**
- Masonry-ish grid: `auto-fill, minmax(280px, 1fr)`
- Each card:
  - Category chip (top-right, subtle)
  - Component name (bold)
  - One-line description
  - Live miniature preview (interactive where safe)
  - Framework availability: `React Angular Vue` chips (greyed if not yet available)
  - `[View docs]` button (ghost, shows on hover)
- Clicking card → navigates to `/components/[slug]`
- Empty state: `"No components match '[query]'"` with clear button

**Metadata:** Each component entry defined in `src/data/components.ts` — not MDX frontmatter, so the browser can filter/search client-side.

---

### 6.3 Component Docs (`/components/[slug]`)

**Layout:** 3-column (sidebar / content / TOC)

**Sidebar (left, 240px):**
- All components grouped by category
- Current page highlighted
- Collapsible groups on mobile

**Content (center, fluid):**
- Breadcrumb: `Components / Button`
- H1: component name
- Description (1–2 sentences)
- `<ComponentPreview>` — Sandpack live editor with:
  - Preview tab (rendered component)
  - Code tab (editable, live)
  - Copy button
  - Framework tab switcher (React / Angular / Vue code)
- Installation: `<InstallCommand name="button" />`
- Usage section: basic code example
- Variants section: visual grid of all variants with labels
- Props table: `PropName | Type | Default | Description`
- Accessibility notes (keyboard, ARIA roles)

**TOC (right, 200px):**
- Auto-generated from H2/H3 headings
- Sticky, highlights current section on scroll
- Hidden on mobile

**Slug → component mapping:** Generated from `src/data/components.ts`. 404 for unknown slugs.

**Component list (31 base + 7 MCP = 38 docs pages):**
Form: button, input, textarea, password-input, select, switch, counter
Display: badge, card, avatar, separator, skeleton, progress, loader
Overlay: dialog, tooltip, popover, toast, drawer
Navigation: tabs, accordion, dropdown-menu
Feedback: alert, chips
AI: prompt-input, chat-bubble, ai-badge, suggestion-chips, source-card, streaming-text, feedback
MCP: mcp-tool-call, mcp-tool-form, mcp-consent-dialog, mcp-scope-inspector, mcp-resource-browser, mcp-server-status, mcp-app-frame

---

### 6.4 MCP Showcase (`/mcp`)

A marketing-style page for the MCP primitives section.

**Sections:**

1. **Hero** (full-bleed, indigo glow bg):
   - H1: `"Every MCP application needs these."`
   - Subhead: `"Pre-built, accessible, copy-paste UI primitives for the MCP protocol. Server consent, tool calls, scope inspection — the components nobody else ships."`
   - CTAs: `[Browse MCP components →]` + `[Read the spec ↗]` (links to MCP Apps spec)

2. **7-component showcase:**
   Each component gets a dedicated horizontal card:
   - Left: component name, description, install command, link to full docs
   - Right: large live animated/interactive demo
   - Alternates left/right on desktop

3. **How it fits together:**
   A flow diagram showing: MCP Server → `McpServerStatus` → OAuth → `McpConsentDialog` → `McpScopeInspector` → Tool call → `McpToolCall` + `McpToolForm` → Result → `McpResourceBrowser` → Embed → `McpAppFrame`

4. **`@mcp-elements/core` section:**
   "The state machines under the hood" — shows the 6 pure TypeScript utilities (createToolState, createOAuthFlow, schemaToFields, parseScope, etc.) with code snippets. Emphasises framework-free.

---

### 6.5 MCP Component Docs (`/mcp/[slug]`)

Same 3-column layout as `/components/[slug]` but with an additional section:
- **Protocol context** — which MCP spec section this component implements
- **State machine diagram** — ASCII or SVG showing the state transitions (idle → running → done, etc.)
- **Integration example** — how to wire the component to a real MCP client (`@modelcontextprotocol/sdk`)

---

### 6.6 Playground (`/playground`)

**Layout:** Full-screen, no navbar overlap (navbar present but minimal)

**Structure:**
- Top bar: preset selector + share button + theme toggle + fullscreen toggle
- Left pane (50%): code editor (Sandpack's `SandpackCodeEditor`)
- Right pane (50%): live preview (`SandpackPreview`)
- Pane divider: draggable
- Mobile: toggle between code and preview panes

**Presets** (dropdown):
- McpToolCall — basic usage
- McpConsentDialog — with scope list
- Button variants — all 6 variants
- Card — with header/content/footer
- Chat — ChatBubble conversation
- Custom — blank starter

**Sandpack configuration:**
- Template: `react-ts`
- External deps: Since `@mcp-elements/react` is not yet published to npm, the playground uses a **pre-bundled UMD/ESM build** of `@mcp-elements/react` served as a static asset from `public/mcp-elements-bundle.js`. Sandpack's `customSetup.dependencies` maps the package name to this file via an `externalResources` approach. When `@mcp-elements/react` is published to npm (Stage I in WIP.md), update to use the npm package directly.
- CSS: `@mcp-elements/css` base tokens + all component styles loaded as an `externalResources` CSS file served from `public/mcp-elements.css`
- Theme: matches site dark theme

**Share:** Encodes current code in URL (base64 or LZ-compressed). Copying the URL copies the playground state.

---

### 6.7 Themes (`/themes`)

**Layout:** Single-column, wide content area

**Sections:**

1. **Theme switcher tabs:** Default / Dark / Glass
   - Selecting a tab live-updates the demo below
   - Each tab has a description of the theme's design intent

2. **Component preview grid:**
   Shows 8 representative components (Button, Card, Input, Badge, Dialog, Tabs, Alert, Switch) in the selected theme, using the actual mcp-elements component styles.

3. **Token reference:**
   Full table of `--color-*` tokens for the selected theme with color swatches.

4. **Copy theme block:**
   CSS block with all token overrides for the selected theme.
   `[Copy CSS]` button.

5. **Custom theme note:**
   "Override any token in your own CSS file. See the theming docs."

---

## 7. MCP React Components (new — Plan 3 of roadmap)

Before the site can demo MCP components, they must exist in `packages/react/src/mcp/`. This is a prerequisite.

The 7 components to build (using `@mcp-elements/core/mcp/*` as state engine):

### 7.1 `McpServerStatus`
CSS-only. A badge variant showing connection state.
```tsx
<McpServerStatus status="connected" />    // green dot + "Connected"
<McpServerStatus status="connecting" />  // amber pulse + "Connecting"
<McpServerStatus status="disconnected" /> // gray + "Disconnected"
<McpServerStatus status="error" />       // red + "Error"
```
Props: `status: 'connected' | 'connecting' | 'disconnected' | 'error'`, `serverName?: string`

### 7.2 `McpToolCall`
Card showing a single tool execution. Accepts a `ToolStateApi` (from `createToolState()`).
```tsx
<McpToolCall
  toolName="search_files"
  args={{ path: '/src', pattern: '*.ts' }}
  state={toolState}      // ToolStateApi instance
  onRetry={() => {}}
/>
```
Visual states: idle (dim), pending (loading spinner), running (progress bar + stream output), done (green, result), error (red, message + retry).

### 7.3 `McpToolForm`
Dynamic form from JSON Schema. Uses `schemaToFields()` internally.
```tsx
<McpToolForm
  schema={tool.inputSchema}
  onSubmit={(args) => {}}
  loading={isRunning}
/>
```
Renders the correct field type per `FieldDescriptor.kind`.

### 7.4 `McpConsentDialog`
OAuth consent modal. Composes `Dialog` + `Button` + `Alert`.
```tsx
<McpConsentDialog
  open={open}
  serverName="GitHub MCP"
  serverIcon="https://..."
  scopes={['repo:read', 'user:email']}
  onApprove={() => {}}
  onDeny={() => {}}
/>
```

### 7.5 `McpScopeInspector`
Expandable tree of scopes. Composes `Accordion` + `Badge`.
```tsx
<McpScopeInspector
  scopes={parseScopes('repo:read user.email:read')}
  descriptions={{ 'repo:read': 'Read repository contents' }}
/>
```

### 7.6 `McpResourceBrowser`
List of MCP resources with type icons + click-to-preview. Composes `Card` + `Skeleton`.
```tsx
<McpResourceBrowser
  resources={resources}
  onSelect={(resource) => {}}
  loading={false}
/>
```

### 7.7 `McpAppFrame`
Sandboxed `<iframe>` for MCP Apps spec. Uses `createAppBridge()` internally.
```tsx
<McpAppFrame
  src="https://app.example.com/mcp-ui"
  onMessage={(env) => {}}
  sendMessage={bridge.send}
/>
```
Adds `sandbox="allow-scripts allow-same-origin"` and wires postMessage automatically.

---

## 8. Implementation Plan (task breakdown for writing-plans)

The implementation has 9 independent or sequentially-dependent stages:

### Stage W1 — Next.js app scaffold
Create `examples/web/` with Next.js 15, TypeScript, Tailwind v4, Geist fonts, workspace deps. Basic layout components (SiteNav, SiteFooter). Dark theme CSS vars. Health check: `pnpm dev` loads.

### Stage W2 — Shared site components
CodeBlock (Shiki), ComponentPreview (Sandpack), PropsTable, InstallCommand, FrameworkTabs, CopyButton, ThemeToggle, Breadcrumb.

### Stage W3 — Homepage
All 9 homepage sections including animated hero with ToolCall card, bento showcase grid, MCP section, framework tabs, copy-paste CTA.

### Stage W4 — Component browser + data layer
`src/data/components.ts` with all 38 component entries. `/components` page with search/filter. Component card grid.

### Stage W5 — Component docs pages (base 31)
MDX files + `/components/[slug]` layout. Covers all 31 base components. Sandpack live preview per page.

### Stage W6 — MCP React components (7 primitives)
`packages/react/src/mcp/` — all 7 components using `@mcp-elements/core` state machines. CSS in `packages/css/components/mcp-*.css`.

### Stage W7 — MCP site pages
`/mcp` showcase page + `/mcp/[slug]` docs for all 7 MCP components. MDX content.

### Stage W8 — Playground
`/playground` page with Sandpack, presets, share-via-URL.

### Stage W9 — Themes page + final polish
`/themes` page, light mode CSS, mobile responsiveness pass, OG images, sitemap, README update.

**Dependency order:** W1 → W2 → W3, W4 (parallel) → W5, W6 (parallel) → W7 → W8, W9 (parallel)

---

## 9. Non-goals (explicit)

- ❌ No server-side search (client-side filter only — 38 components is small enough)
- ❌ No CMS integration — all content is MDX files in the repo
- ❌ No analytics (add later)
- ❌ No authentication
- ❌ No versioned docs (v0.1 only)
- ❌ No Svelte/web-components adapter (Phase 2 per WIP.md)
- ❌ Not migrating Angular-specific demo apps

---

## 10. Success criteria

- `pnpm dev` in `examples/web/` runs cleanly
- All 38 component pages load with a live Sandpack preview
- Hero animation runs at 60fps (Framer Motion, no jank)
- Lighthouse score ≥ 90 performance, 100 accessibility
- Mobile layout correct at 375px and 768px breakpoints
- `pnpm build` produces zero type errors
- Share URL in playground encodes/decodes state correctly

---

## 11. File structure (`examples/web/`)

```
examples/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (SiteNav + SiteFooter + fonts)
│   │   ├── page.tsx                 # Homepage
│   │   ├── components/
│   │   │   ├── page.tsx             # Component browser
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Component docs
│   │   ├── mcp/
│   │   │   ├── page.tsx             # MCP showcase
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # MCP component docs
│   │   ├── playground/
│   │   │   └── page.tsx             # Live playground
│   │   └── themes/
│   │       └── page.tsx             # Theme picker
│   ├── components/
│   │   └── site/                    # Site-level UI (not mcp-elements)
│   │       ├── SiteNav.tsx
│   │       ├── SiteFooter.tsx
│   │       ├── CodeBlock.tsx
│   │       ├── ComponentPreview.tsx
│   │       ├── PropsTable.tsx
│   │       ├── InstallCommand.tsx
│   │       ├── FrameworkTabs.tsx
│   │       └── ThemeToggle.tsx
│   ├── content/
│   │   ├── components/              # MDX per base component (31 files)
│   │   └── mcp/                     # MDX per MCP component (7 files)
│   ├── data/
│   │   └── components.ts            # Component registry (name, slug, category, etc.)
│   └── styles/
│       └── globals.css              # Site CSS vars, Tailwind imports, dark theme
├── package.json
├── next.config.ts
├── tailwind.config.ts               # (v4: just imports)
└── tsconfig.json
```
