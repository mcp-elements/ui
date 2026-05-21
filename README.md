<p align="center">
  <h1 align="center">mcp-elements</h1>
</p>

<p align="center">
  MCP-native UI components that copy into your project. Multi-framework. Open Source. Open Code.
</p>

<p align="center">
  <a href="https://mcp-elements.dev/docs"><strong>Documentation</strong></a> ·
  <a href="https://mcp-elements.dev/docs/components"><strong>Components</strong></a> ·
  <a href="https://mcp-elements.dev/docs/themes"><strong>Themes</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18%2F19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Angular-19+-DD0031?logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</p>

---

## About

mcp-elements is a component library that works differently. Instead of installing a package you depend on forever, our CLI copies production-ready source code directly into your project. You own it. You modify it. No lock-in.

The same component logic powers both React and Angular through a layered architecture — CSS and core behavior are shared, framework adapters are thin wrappers on top.

---

## Quick Start

### 1. Initialize

```bash
npx mcp-elements init
```

This will:
- Detect your framework (React or Angular)
- Create `mcp-elements.json` configuration
- Set up component and utils directories
- Generate the `cn()` class utility
- Inject OKLCH design tokens into your CSS

### 2. Add Components

```bash
npx mcp-elements add button dialog tabs
```

Or run without arguments for an interactive picker:

```bash
npx mcp-elements add
```

### 3. Import Base Styles

Add the base styles alongside Tailwind in your CSS:

```css
@import "tailwindcss";
@import "@mcp-elements/css/base";
```

---

## Components (31)

### CSS-Only (14)

Simple, styled components with no JavaScript logic required.

| Component | Description |
|-----------|-------------|
| **Button** | Primary, secondary, outline, ghost, destructive, and link variants with sm/md/lg/icon sizes |
| **Badge** | Inline status indicators with default, secondary, outline, and destructive variants |
| **Card** | Container with header, content, and footer sections |
| **Input** | Styled text input with focus ring and placeholder styling |
| **Textarea** | Multi-line text input |
| **Password Input** | Input with toggle visibility button (depends on Input) |
| **Avatar** | Circular image with fallback initials |
| **Separator** | Horizontal or vertical divider |
| **Skeleton** | Loading placeholder with pulse animation |
| **Progress** | Horizontal progress bar with animated fill |
| **Loader** | Spinning/pulsing loading indicators |
| **Chips** | Tag-like removable chips |
| **Counter** | Animated number counter |
| **Alert** | Contextual alert banners with icon support |

### Interactive (10)

Components with keyboard navigation, ARIA attributes, focus management, and state logic powered by `@mcp-elements/core`.

| Component | Description | Core Deps |
|-----------|-------------|-----------|
| **Dialog** | Modal dialog with focus trap, scroll lock, and aria-labelledby/describedby | dom.ts |
| **Tabs** | Tabbed interface with arrow key navigation | keyboard.ts |
| **Accordion** | Expandable sections (single/multiple mode) with keyboard nav | keyboard.ts |
| **Select** | Custom dropdown with combobox ARIA pattern and aria-activedescendant | dom.ts, keyboard.ts |
| **Tooltip** | Hover/focus tooltip with delay, aria-describedby, and fade animation | — |
| **Popover** | Click-triggered floating panel with click-outside dismiss | dom.ts |
| **Toast** | Notification system with toast manager, auto-dismiss, and stacking | — |
| **Drawer** | Slide-in panel from any edge (left, right, top, bottom) | dom.ts |
| **Dropdown Menu** | Menu with keyboard navigation and click-outside handling | dom.ts, keyboard.ts |
| **Switch** | Toggle switch with checked/unchecked states | — |

### AI (7)

Purpose-built components for AI-powered applications and chat interfaces.

| Component | Description |
|-----------|-------------|
| **Prompt Input** | Multi-line input with attachments, character count, and action buttons |
| **Chat Bubble** | Message bubble for user and assistant messages |
| **AI Badge** | Animated badge indicating AI-generated content |
| **Suggestion Chips** | Clickable suggestion pills for quick responses |
| **Source Card** | Attribution card for cited sources |
| **Streaming Text** | Text component with streaming/typewriter effect |
| **Feedback** | Thumbs up/down with optional text feedback form |

---

## CLI Reference

### `npx mcp-elements init`

Initialize mcp-elements in your project.

- Detects framework from `package.json` (React or Angular)
- Creates `mcp-elements.json` with component paths, utils path, and CSS config
- Generates `cn()` utility for class merging
- Injects OKLCH design tokens and dark theme into your CSS file

### `npx mcp-elements add [components...]`

Add one or more components to your project.

```bash
# Add specific components
npx mcp-elements add button dialog select

# Interactive multi-select picker
npx mcp-elements add

# Overwrite existing files
npx mcp-elements add dialog --overwrite

# Dev mode (read from local monorepo)
npx mcp-elements add button --local
```

**Options:**
| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `-o, --overwrite` | Overwrite existing component files |
| `--local` | Read files from local monorepo instead of GitHub (dev only) |

**What gets copied:**
- Framework adapter (React hook + component, or Angular standalone component)
- CSS file to your styles directory
- Core logic file (for interactive components)
- Utility dependencies (dom.ts, keyboard.ts, cn.ts) as needed
- Internal component dependencies (e.g., Dialog pulls in Button)

**Import transforms:**
All `@mcp-elements/core` imports are automatically rewritten to local paths. For example:
```typescript
// Before (source)
import { cn, trapFocus, lockScroll } from '@mcp-elements/core'

// After (in your project)
import { cn } from './utils/cn'
import { trapFocus, lockScroll } from './utils/dom'
```

### `npx mcp-elements theme <theme>`

Add a theme to your project.

```bash
# Dark theme (instructions only — tokens are already in base CSS)
npx mcp-elements theme dark

# Glass theme (copies glass.css + shows instructions)
npx mcp-elements theme glass
```

### `npx mcp-elements list`

List all 31 available components with their types.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  Layer 3: CLI       npx mcp-elements add button   │
│  Copies code into your project              │
├─────────────────────────────────────────────┤
│  Layer 2: Framework Adapters                │
│  React hooks + components                   │
│  Angular standalone components              │
├─────────────────────────────────────────────┤
│  Layer 1: Core      Plain TypeScript        │
│  State machines, props, ARIA attributes     │
│  Keyboard navigation, focus management      │
├─────────────────────────────────────────────┤
│  Layer 0: CSS       Tailwind v4 styles      │
│  OKLCH design tokens, @theme, @apply        │
│  Zero JavaScript                            │
└─────────────────────────────────────────────┘
```

Each layer is independent. Use the CSS on its own, wire up core logic with any framework, or let the CLI handle everything.

### Project Structure

```
mcp-elements/
├── packages/
│   ├── css/                  # Layer 0 — Tailwind v4 styles
│   │   ├── base.css          # Design tokens (OKLCH), dark theme
│   │   ├── components/       # 31 component CSS files
│   │   └── themes/           # default, dark, glass
│   │
│   ├── core/                 # Layer 1 — Plain TypeScript logic
│   │   └── src/
│   │       ├── dialog.ts     # createDialog(), createTabs(), etc.
│   │       ├── ...
│   │       └── utils/
│   │           ├── cn.ts     # Class merging
│   │           ├── dom.ts    # Focus trap, scroll lock, click outside
│   │           └── keyboard.ts  # Arrow nav, key constants
│   │
│   ├── react/                # Layer 2 — React adapters
│   │   └── src/
│   │       ├── dialog.tsx    # Components using core hooks
│   │       ├── ...
│   │       └── hooks/        # useDialog(), useTabs(), etc.
│   │
│   ├── angular/              # Layer 2 — Angular adapters
│   │   └── src/              # Standalone components + directives
│   │
│   └── cli/                  # Layer 3 — CLI tool
│       └── src/
│           ├── commands/     # init, add, theme, list
│           ├── registry/     # Component manifest + dependency resolution
│           └── utils/        # fetch, transform, detect, fs
│
└── examples/
    ├── docs/                 # Astro + Starlight documentation site
    ├── react-app/            # Vite + React example
    └── angular-app/          # Angular example
```

### Core Utilities

| Utility | Exports | Used By |
|---------|---------|---------|
| `cn.ts` | `cn()` — class merging | All components |
| `dom.ts` | `trapFocus()`, `lockScroll()`, `createClickOutsideHandler()`, `getFocusableElements()` | Dialog, Drawer, Select, Popover, Dropdown Menu |
| `keyboard.ts` | `Keys`, `getNextIndex()`, `handleArrowNavigation()` | Tabs, Accordion, Select, Dropdown Menu |

---

## Themes

Ships with three themes — **light** (default), **dark**, and **glass**.

### Dark Theme

Dark theme tokens are included in `base.css`. Activate with:

```html
<html data-theme="dark">
```

```js
document.documentElement.setAttribute('data-theme', 'dark')
```

### Glass Theme (Glassmorphism)

```bash
npx mcp-elements theme glass
```

Then import in your CSS:

```css
@import './glass.css';
```

```html
<html data-theme="glass">
```

The glass theme applies `backdrop-filter: blur()` to cards, dialogs, popovers, tooltips, selects, and inputs. Includes solid fallbacks for browsers without backdrop-filter support, and respects `prefers-reduced-motion`.

### Custom Themes

Override the OKLCH design tokens in your CSS:

```css
[data-theme='custom'] {
  --color-background: oklch(0.98 0.01 250);
  --color-foreground: oklch(0.2 0.02 250);
  --color-primary: oklch(0.55 0.2 250);
  /* ... */
}
```

---

## Accessibility

All interactive components follow WAI-ARIA patterns:

- **Dialog** — `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`, focus trap, Escape to close
- **Tabs** — Arrow key navigation between triggers, `aria-expanded`, `aria-controls`
- **Accordion** — `aria-expanded`, `aria-controls`, `aria-labelledby`, Home/End keys
- **Select** — `role="combobox"`, `role="listbox"`, `aria-activedescendant`, `aria-expanded`
- **Tooltip** — `role="tooltip"`, `aria-describedby` with stable IDs
- **Drawer** — `role="dialog"`, `aria-modal`, focus trap, Escape to close

CSS uses `focus-visible:` (not `focus:`) for keyboard-only focus rings across all components. The `hidden` attribute uses proper boolean handling to prevent `hidden="false"` in the DOM.

---

## Design Tokens

All colors use OKLCH for perceptual uniformity:

| Token | Light | Dark |
|-------|-------|------|
| `--color-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--color-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--color-primary` | `oklch(0.205 0.042 265)` | `oklch(0.985 0 0)` |
| `--color-destructive` | `oklch(0.577 0.245 27)` | `oklch(0.704 0.191 22)` |
| `--color-border` | `oklch(0.922 0.004 286)` | `oklch(0.269 0.007 286)` |
| `--color-ring` | `oklch(0.708 0.028 256)` | `oklch(0.442 0.017 285)` |
| `--color-overlay` | `oklch(0 0 0 / 0.8)` | `oklch(0 0 0 / 0.8)` |

Additional tokens: `--color-secondary`, `--color-accent`, `--color-muted`, `--color-card`, `--color-popover`, and their `-foreground` counterparts.

---

## Development

### Prerequisites

- Node.js 20+
- pnpm 9.15+

### Setup

```bash
git clone https://github.com/snxstudio/mcp-elements.git
cd mcp-elements
pnpm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages (Turborepo) |
| `pnpm dev` | Watch mode for all packages |
| `pnpm test` | Run tests across all packages |
| `pnpm lint` | Lint with Biome |
| `pnpm lint:fix` | Lint and auto-fix |
| `pnpm format` | Format with Biome |
| `pnpm clean` | Clean all build artifacts |

### Package Build Output

| Package | Size | Format |
|---------|------|--------|
| `@mcp-elements/core` | ~16 KB | ESM + DTS |
| `@mcp-elements/react` | ~47 KB | ESM + DTS |
| `mcp-elements` (CLI) | ~20 KB | ESM (with `#!/usr/bin/env node` banner) |
| `@mcp-elements/angular` | Source-distributed via CLI | — |
| `@mcp-elements/css` | Pure CSS | — |

### Documentation Site

```bash
cd examples/docs
pnpm dev          # Astro dev server
pnpm build        # Static build (38 pages)
```

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + React for interactive demos.

### React Example App

```bash
cd examples/react-app
pnpm dev          # Vite dev server at localhost:5173
```

### Monorepo Structure

```
pnpm-workspace.yaml     # Workspace: packages/* + examples/*
turbo.json              # Build orchestration
tsconfig.base.json      # Shared TS config (ES2022, strict)
biome.json              # Linter + formatter (single quotes, no semicolons, 2-space tabs)
```

### Adding a New Component

1. Create CSS in `packages/css/components/{name}.css`
2. If interactive, create core logic in `packages/core/src/{name}.ts`
3. Create React adapter in `packages/react/src/{name}.tsx`
4. Create React hook in `packages/react/src/hooks/use-{name}.ts` (if interactive)
5. Create Angular adapter in `packages/angular/src/{name}.component.ts`
6. Add entry to `packages/cli/src/registry/registry.json`
7. Export from each package's `index.ts`
8. Add documentation page in `examples/docs/src/content/docs/components/`
9. Add demo component in `examples/docs/src/demos/`

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [pnpm](https://pnpm.io) | Package manager + workspaces |
| [Turborepo](https://turbo.build) | Monorepo build orchestration |
| [tsup](https://tsup.egoist.dev) | TypeScript bundler (ESM) |
| [Biome](https://biomejs.dev) | Linter + formatter |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS with @theme tokens |
| [Commander.js](https://github.com/tj/commander.js) | CLI framework |
| [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) | Documentation site |
| [Vite](https://vite.dev) | Dev server + bundler for examples |

---

## Contributing

We welcome contributions! Please read our [contributing guide](CONTRIBUTING.md) before submitting a pull request.

## License

Licensed under the [MIT License](LICENSE.md).
