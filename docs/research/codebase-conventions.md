# snuxt-ui Codebase Conventions Reference

> This document is a ground-truth reference for implementation agents writing new code (MCP UI components, Vue adapter, etc.). Every pattern documented here was read directly from source files. Recommendations for the new Vue adapter are marked **RECOMMENDED**.

---

## 1. Repo Layout

### pnpm workspace structure

`pnpm-workspace.yaml` (line 1-3):
```yaml
packages:
  - "packages/*"
  - "examples/*"
```

Packages in `packages/`:

| Package | Name | Description |
|---------|------|-------------|
| `packages/css` | `@snuxt-ui/css` | Layer 0 — pure CSS, no build step |
| `packages/core` | `@snuxt-ui/core` | Layer 1 — plain TS state factories |
| `packages/react` | `@snuxt-ui/react` | Layer 2 — React adapter |
| `packages/angular` | `@snuxt-ui/angular` | Layer 2 — Angular adapter (source-distributed) |
| `packages/cli` | `snuxt-ui` (bin) | Layer 3 — CLI tool |

Examples in `examples/`:
- `examples/docs` — Astro + Starlight docs site
- `examples/react-app` — Vite + React example
- `examples/angular-app` — Angular example

### Turborepo task graph

`turbo.json`:
```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "test":  { "dependsOn": ["build"] },
    "clean": { "cache": false },
    "lint":  { "dependsOn": ["^build"] }
  }
}
```

Key insight: `"^build"` means a package must build its dependencies first. `test` and `lint` also depend on `build`.

### Build commands

```bash
pnpm build       # turbo build — all packages in dependency order
pnpm dev         # turbo dev — watch mode for all packages
pnpm test        # turbo test — runs after build
pnpm lint        # biome check .
pnpm lint:fix    # biome check --write .
pnpm format      # biome format --write .
pnpm clean       # turbo clean && rm -rf node_modules
```

Individual package builds use `tsup` (see each `package.json`).

### How the CLI consumes the registry to copy files

The registry (`packages/cli/src/registry/registry.json`) stores relative paths like `"react": "react/src/button.tsx"`. The CLI reads the `baseUrl` (`https://raw.githubusercontent.com/thepsygeek/snuxt-ui/main/packages`) and fetches:

```
https://raw.githubusercontent.com/thepsygeek/snuxt-ui/main/packages/react/src/button.tsx
```

The `--local` flag causes the CLI to read from the local filesystem instead (useful during development). After fetching, `transformImports()` rewrites all `@snuxt-ui/core` imports to local paths.

---

## 2. CSS Conventions

### Tailwind v4 setup

Tailwind v4 is CSS-first. There is NO `@import 'tailwindcss'` in any package source file — the user's own CSS does that. The `base.css` comment makes this explicit:

`packages/css/base.css` line 1:
```css
/* Design tokens for snuxt-ui. Import tailwindcss separately in your project. */
```

The `@theme` block in `base.css` defines all design tokens using Tailwind v4 CSS variables convention. Tailwind v4 generates utility classes from `@theme` automatically (e.g., `--color-primary` → `bg-primary`, `text-primary`).

The `@custom-variant` directive wires data-theme attributes to Tailwind variants:

`packages/css/base.css` line 3:
```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

`packages/css/themes/glass.css` line 5:
```css
@custom-variant glass (&:where([data-theme=glass], [data-theme=glass] *));
```

### Design tokens (`@theme` block)

All colors use OKLCH for perceptual uniformity. `packages/css/base.css` lines 5-37:
```css
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0.042 265.755);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0.001 286.375);
  --color-secondary-foreground: oklch(0.205 0.042 265.755);
  --color-accent: oklch(0.97 0.001 286.375);
  --color-accent-foreground: oklch(0.205 0.042 265.755);
  --color-muted: oklch(0.97 0.001 286.375);
  --color-muted-foreground: oklch(0.556 0.019 286);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: oklch(0.922 0.004 286.32);
  --color-input: oklch(0.922 0.004 286.32);
  --color-ring: oklch(0.708 0.028 256);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);
  --color-overlay: oklch(0 0 0 / 0.8);

  --radius-sm: 0.25rem;
  --radius-md: calc(var(--radius-sm) + 0.125rem);
  --radius-lg: calc(var(--radius-sm) + 0.25rem);
  --radius-xl: calc(var(--radius-sm) + 0.5rem);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
}
```

### CSS class naming: `snx-*` prefix + flat modifier pattern

All classes use the `snx-` prefix. Classes follow a flat modifier pattern, NOT BEM's double-underscore/double-dash. Pattern is:
```
snx-{component}           — base class
snx-{component}-{variant} — variant modifier
snx-{component}-{part}    — sub-component / element
snx-{component}-{state}   — state (e.g., -active, -selected)
```

Examples from `packages/css/components/button.css`:
```css
.snx-btn            /* base */
.snx-btn-primary    /* variant */
.snx-btn-secondary  /* variant */
.snx-btn-sm         /* size */
.snx-btn-md         /* size */
.snx-btn-icon       /* size variant */
```

Examples from `packages/css/components/dialog.css`:
```css
.snx-dialog-overlay     /* element */
.snx-dialog-content     /* element */
.snx-dialog-header      /* element */
.snx-dialog-footer      /* element */
.snx-dialog-title       /* element */
.snx-dialog-description /* element */
.snx-dialog-close       /* element + action */
```

### CSS file structure

Each component has its own CSS file in `packages/css/components/{name}.css`. All rules are wrapped in `@layer components { ... }`.

`packages/css/components/button.css` lines 1-21:
```css
@layer components {
  .snx-btn {
    @apply inline-flex items-center justify-center gap-2 ...;
  }
  .snx-btn-primary { @apply bg-primary text-primary-foreground ...; }
  ...
}
```

The `packages/css/package.json` exports:
```json
{
  "exports": {
    "./base": "./base.css",
    "./components/*": "./components/*.css",
    "./themes/*": "./themes/*.css"
  }
}
```

### Theme wiring

Three themes:
1. **Default/light**: built into `base.css` `@theme` block
2. **Dark**: `base.css` `@layer base { [data-theme='dark'] { ... } }` — overrides tokens via CSS custom properties
3. **Glass**: `themes/glass.css` — imports separately; adds `@custom-variant glass`, overrides tokens, adds `backdrop-filter` overrides per-component

Activation: `document.documentElement.setAttribute('data-theme', 'dark')` or `data-theme="dark"` on `<html>`.

Theme overrides use `[data-theme='glass'] .snx-card { ... }` selector pattern (not a variant utility class).

### Gotchas

1. **NO `group` in `@apply`** — Tailwind v4 cannot use `group` pseudo-class inside `@apply`. Use explicit parent-child selectors instead:
   ```css
   /* Wrong: */
   .snx-toast-close { @apply group-hover:opacity-100; }
   /* Correct: */
   .snx-toast:hover .snx-toast-close { @apply opacity-100; }
   ```
   Observed in `packages/css/components/toast.css` lines 35-38.

2. **NO `tailwindcss-animate` plugin** — Animations use plain `transition-opacity`, `transition-all`, and `duration-200`. Example from `dialog.css` line 8: `duration-200`.

3. **Accordion animation** uses CSS custom properties and `@keyframes` defined directly in `base.css`, not a plugin:
   ```css
   @keyframes accordion-down { from { height: 0; } to { height: var(--radix-accordion-content-height, auto); } }
   ```

4. **`focus-visible:` not `focus:`** — All focus rings use `focus-visible:` for keyboard-only styling.

5. **Glass theme fallbacks**: `packages/css/themes/glass.css` includes `@supports not (backdrop-filter: ...)` fallback blocks AND `@media (prefers-reduced-motion: reduce)` blocks. New glass components must follow this pattern.

---

## 3. Core (Layer 1) Conventions

### File naming

One file per interactive component concept, kebab-case:
```
packages/core/src/
  dialog.ts
  tabs.ts
  accordion.ts
  select.ts
  tooltip.ts
  popover.ts
  toast.ts
  drawer.ts
  dropdown-menu.ts
  switch.ts
  index.ts
  utils/
    cn.ts
    dom.ts
    keyboard.ts
```

### Public API pattern: factory functions returning prop getter objects

Every core module exports a `create{Name}(config)` factory. The factory returns an object with **prop getter methods** — pure functions that return attribute objects ready to spread onto DOM elements.

From `packages/core/src/dialog.ts`:
```typescript
export function createDialog(config: DialogConfig = {}) {
  const { modal = true, onOpenChange } = config
  const id = `snx-dialog-${++dialogCounter}`

  return {
    id,
    getTriggerProps: (isOpen: boolean) => ({
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': isOpen,
      onClick: () => onOpenChange?.(!isOpen),
    }),
    getContentProps: (isOpen: boolean) => ({
      role: 'dialog' as const,
      'aria-modal': modal,
      'aria-labelledby': `${id}-title`,
      'aria-describedby': `${id}-description`,
      hidden: !isOpen ? true : undefined,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange?.(false)
      },
    }),
    getOverlayProps: () => ({ 'aria-hidden': true as const, onClick: ... }),
    getCloseProps: () => ({ 'aria-label': 'Close', onClick: ... }),
  }
}
```

Key patterns:
- Module-level counter for stable IDs: `let dialogCounter = 0`, used as `snx-dialog-${++dialogCounter}`
- `hidden: !isOpen ? true : undefined` — avoids `hidden="false"` in DOM (important!)
- `as const` for ARIA role literals to satisfy TypeScript
- `onOpenChange?.(value)` — optional chaining on all callbacks
- The factory is **pure** — no DOM access, no side effects beyond the counter

### TypeScript conventions

- Interfaces for config types: `export interface DialogConfig { ... }`
- Interfaces exported from the module
- `index.ts` exports both the function and its config type: `export { createDialog } from './dialog'` + `export type { DialogConfig } from './dialog'`
- No classes — all plain functions and interfaces

From `packages/core/src/tabs.ts`:
```typescript
export interface TabsConfig {
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface TabItem {
  value: string
  disabled?: boolean
}

export function createTabs(items: TabItem[], config: TabsConfig = {}) { ... }
```

### Utilities

**`cn.ts`** — simple class merger (no `clsx` or `tailwind-merge` dependency):
```typescript
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
```

**`dom.ts`** — exports: `getFocusableElements`, `trapFocus`, `createClickOutsideHandler`, `lockScroll`. Used by interactive components with focus management or scroll locking.

**`keyboard.ts`** — exports: `Keys` constant object, `getNextIndex`, `handleArrowNavigation`, `KeyboardDirection` type. Used by components needing arrow key navigation (Tabs, Accordion, Select, Dropdown Menu).

### Export pattern in `index.ts`

`packages/core/src/index.ts` groups exports by: utils first, then components alphabetically. Each component exports the factory function + all its types separately:
```typescript
export { cn } from './utils/cn'
export { getFocusableElements, trapFocus, createClickOutsideHandler, lockScroll } from './utils/dom'
export { Keys, getNextIndex, handleArrowNavigation } from './utils/keyboard'
export type { KeyboardDirection } from './utils/keyboard'

export { createDialog } from './dialog'
export type { DialogConfig } from './dialog'
```

Note `export type { ... }` for type-only re-exports.

---

## 4. React Adapter Conventions

### File naming

```
packages/react/src/
  {name}.tsx          — component(s)
  hooks/
    use-{name}.ts     — hook wrapping core factory
```

CSS-only components have no corresponding hook.

### Component pattern

**CSS-only components** use `forwardRef` with `React.HTMLAttributes<X>`:

`packages/react/src/button.tsx`:
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('snx-btn', `snx-btn-${variant}`, `snx-btn-${size}`, className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
```

Rules:
- Always `forwardRef` for elements that render a DOM element
- Always set `ComponentName.displayName = 'ComponentName'`
- `className` prop merged via `cn(...)` with component base class first, then user-supplied last
- Variant/size classes built via template literals: `` `snx-btn-${variant}` ``

**CSS-only compound components** (e.g., Card sub-components) all use `forwardRef`:
```typescript
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-card-header', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'
```

**Interactive components** use the hook internally; may or may not use `forwardRef` depending on whether the root element is directly exposed. `Dialog` does NOT use forwardRef on the top-level because it renders a Portal-like structure.

### Compound components

Interactive components use compound sub-components exported from the same file, not a separate sub-file. They use React Context to share IDs between parent and children:

`packages/react/src/dialog.tsx`:
```typescript
const DialogIdContext = createContext<string>('')

export function Dialog({ open: controlledOpen, onOpenChange, modal = true, children }: DialogProps) {
  const dialogId = useId()
  ...
  return (
    <DialogIdContext.Provider value={dialogId}>
      ...
    </DialogIdContext.Provider>
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const dialogId = useContext(DialogIdContext)
  return <h2 id={`${dialogId}-title`} className={cn('snx-dialog-title', className)} {...props} />
}
```

### Hooks API style

Hooks live in `packages/react/src/hooks/use-{name}.ts`. They:
1. Import the `create{Name}` factory from `@snuxt-ui/core`
2. Use `useState` to hold open/value state
3. Use `useMemo` to memoize the API object (only recreate when config changes)
4. Wire the state setter as the `on*Change` callback to the factory
5. Return spread of `{ state, setter, ...api }`

`packages/react/src/hooks/use-dialog.ts`:
```typescript
export function useDialog(config: Omit<DialogConfig, 'onOpenChange'> = {}) {
  const [open, setOpen] = useState(false)

  const api = useMemo(
    () => createDialog({ ...config, onOpenChange: setOpen }),
    [config.modal]
  )

  return { open, setOpen, ...api }
}
```

Note: `config` with `onOpenChange` stripped via `Omit<..., 'onOpenChange'>` — the hook handles wiring it.

`useMemo` deps array contains only the config properties that would change the factory structure (e.g., `config.modal` for dialog, `config.delay` for tooltip, `items` for tabs/select).

**Special case (`use-select.ts`)**: When the core API's method name conflicts with React's event handler type, the core method is destructured and shadowed:
```typescript
const { handleKeyDown: _coreHandleKeyDown, ...restApi } = api

return { ..., handleKeyDown, ...restApi }
```
The `_` prefix is used to suppress TypeScript's "unused variable" warning on the destructured-away name.

### TypeScript: Omit pattern for conflicting prop types

`packages/react/src/feedback.tsx` lines 11-13:
```typescript
export interface FeedbackButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type: 'up' | 'down'
  selected?: boolean
}
```
Use `Omit` when a prop name collides with a native HTML attribute's type.

### index.ts export pattern

`packages/react/src/index.ts` — groups exports by category with comments:
```typescript
// CSS-only components
export { Button } from './button'
export type { ButtonProps } from './button'
...
// Interactive components
export { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription, useDialog } from './dialog'
export type { DialogProps } from './dialog'
...
// AI components
export { PromptInput, ... } from './prompt-input'
```

Rules:
- Components and types exported separately on adjacent lines
- Hooks re-exported from the component file (the hook file also exports the hook; the component file re-exports it, and `index.ts` imports from the component file)
- Compound sub-components listed explicitly (no `export *`)

### tsup config

`packages/react/tsup.config.ts`:
```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
})
```

Key points: ESM only, generates `.d.ts`, externalizes peer deps (`react`, `react-dom`).

### React tsconfig

`packages/react/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

---

## 5. Angular Adapter Conventions

### Standalone component pattern

All Angular components are standalone (`standalone: true`) — no NgModule. They import core factories directly from `@snuxt-ui/core`.

`packages/angular/src/button.component.ts`:
```typescript
import { Component, computed, input } from '@angular/core'

@Component({
  selector: 'snx-button',
  standalone: true,
  template: `
    <button [class]="classes()" [disabled]="disabled()" [type]="type()">
      <ng-content />
    </button>
  `,
})
export class SnxButtonComponent {
  variant = input<ButtonVariant>('primary')
  size = input<ButtonSize>('md')
  disabled = input(false)
  type = input<'button' | 'submit' | 'reset'>('button')
  class = input('')

  classes = computed(() =>
    ['snx-btn', `snx-btn-${this.variant()}`, `snx-btn-${this.size()}`, this.class()]
      .filter(Boolean)
      .join(' ')
  )
}
```

### Naming conventions

- File: `{name}.component.ts` (or `{name}.directive.ts` for directives)
- Class: `Snx{Name}Component` (or `Snx{Name}Directive`)
- Selector: `snx-{name}` (kebab-case, `snx-` prefix)

### Inputs / Outputs

Use Angular 17+ signals API (`input()`, `output()`, `signal()`, `computed()`):
```typescript
modal = input(true)             // input with default
open = signal(false)            // writable signal
openChange = output<boolean>()  // output event
```

Class computation pattern using `computed()`:
```typescript
classes = computed(() =>
  ['snx-btn', `snx-btn-${this.variant()}`, `snx-btn-${this.size()}`, this.class()]
    .filter(Boolean)
    .join(' ')
)
```

### How the core API is used in Angular

`packages/angular/src/tabs.component.ts`:
```typescript
private api = computed(() =>
  createTabs(this.items(), {
    defaultValue: this.defaultValue(),
    onValueChange: (v) => this.activeValue.set(v),
  })
)
```

The factory is wrapped in a `computed()` signal so it recreates when inputs change.

### Directive pattern

Tooltip uses a directive (not a component) because it enhances an existing element. `packages/angular/src/tooltip.directive.ts`:
```typescript
@Directive({
  selector: '[snxTooltip]',
  standalone: true,
})
export class SnxTooltipDirective implements OnDestroy {
  snxTooltip = input<string>('')
  tooltipDelay = input(700)
  ...
  @HostListener('mouseenter') @HostListener('focus')
  onShow() { ... }
  ...
}
```

### Angular package.json

`packages/angular/package.json` — Angular is **source-distributed** (no build step):
```json
{
  "main": "./src/index.ts",
  "scripts": {
    "build": "echo 'Angular components are source-distributed via CLI'"
  }
}
```

### Module / entry exports

`packages/angular/src/index.ts` uses the same grouping pattern as React (CSS-only, Interactive, AI sections with comments). Angular naming is `Snx{Name}Component` throughout:
```typescript
export { SnxButtonComponent } from './button.component'
export { SnxDialogComponent } from './dialog.component'
export { SnxTooltipDirective } from './tooltip.directive'
```

---

## 6. CLI / Registry Conventions

### registry.json schema

`packages/cli/src/registry/registry.json` top-level structure:
```json
{
  "meta": {
    "baseUrl": "https://raw.githubusercontent.com/thepsygeek/snuxt-ui/main/packages",
    "sharedCoreDeps": ["core/src/utils/cn.ts"]
  },
  "components": { ... }
}
```

Each component entry (`packages/cli/src/registry/resolve.ts` lines 3-17 for the TypeScript shape):
```typescript
interface ComponentEntry {
  name: string
  type: 'css-only' | 'interactive'
  files: {
    css?: string
    core?: string
    react?: string | string[]    // string or array of strings
    angular?: string | string[]
  }
  coreDeps?: string[]            // only on interactive components
  dependencies: {
    internal: string[]           // other component names (will be auto-installed)
    npm: Record<string, string[]>
  }
}
```

Example entry for an interactive component (`dialog`):
```json
{
  "name": "dialog",
  "type": "interactive",
  "files": {
    "css": "css/components/dialog.css",
    "core": "core/src/dialog.ts",
    "react": ["react/src/dialog.tsx", "react/src/hooks/use-dialog.ts"],
    "angular": "angular/src/dialog.component.ts"
  },
  "coreDeps": ["core/src/utils/dom.ts"],
  "dependencies": { "internal": ["button"], "npm": {} }
}
```

Example entry for a CSS-only component (`button`):
```json
{
  "name": "button",
  "type": "css-only",
  "files": {
    "css": "css/components/button.css",
    "react": "react/src/button.tsx",
    "angular": "angular/src/button.component.ts"
  },
  "dependencies": { "internal": [], "npm": {} }
}
```

Key differences between types:
- `type: "css-only"` — no `core` key, no `coreDeps` key
- `type: "interactive"` — has `core`, may have `coreDeps`
- React is a string for single-file components, array for component + hook pairs

### How file paths are resolved

All paths in `files.*` are relative to `baseUrl`. The CLI constructs:
```
{baseUrl}/{files.react}
```
e.g., `https://.../packages/react/src/dialog.tsx`

The `--local` flag resolves relative to `path.join(__dirname, '..', '..', '..', relativePath)` (three levels up from `packages/cli/src/utils/`).

### Import transforms

`packages/cli/src/utils/transform.ts` rewrites `@snuxt-ui/core` imports to local paths using a symbol-to-file map. When adding a new MCP utility to `@snuxt-ui/core`, you MUST add every exported symbol to `SYMBOL_TO_FILE` in `transform.ts`. Relative hook imports (`./hooks/use-*`) are also rewritten: `from './hooks/` → `from './`.

### Framework detection logic

`packages/cli/src/utils/detect.ts`:
```typescript
if (allDeps['@angular/core']) return 'angular'
if (allDeps['react']) return 'react'
```

Detection checks both `dependencies` and `devDependencies`. Angular is checked first. The detection does NOT yet check for `vue` — this must be added for Vue support.

### `snuxt-ui.json` config shape

```typescript
interface SnxConfig {
  $schema?: string
  framework: string       // 'react' | 'angular' | future: 'vue'
  typescript: boolean
  tailwind: {
    css: string           // path to user's global CSS file
    baseColor: string     // 'zinc' (currently only option)
  }
  aliases: {
    components: string    // e.g. 'src/components/ui'
    utils: string         // e.g. 'src/lib/utils'
  }
}
```

---

## 7. Docs Site Conventions

### Astro + Starlight setup

`examples/docs/astro.config.mjs`:
- Starlight for navigation/layout
- `@astrojs/react` for interactive demos
- `@tailwindcss/vite` plugin for Tailwind v4 in Vite
- Custom `ThemeToggle.astro` replaces the default `ThemeSelect` slot

### Sidebar config

Sidebar groups in `astro.config.mjs`: Getting Started, Form, Display, Overlay, Navigation, Feedback, AI. New MCP components go into a new `MCP` group appended to the sidebar array.

### How to add a new component's doc page

1. Create `examples/docs/src/content/docs/components/{name}.mdx`
2. Create `examples/docs/src/demos/{Name}Demo.tsx`
3. Add the export to `examples/docs/src/demos/index.ts`
4. Add the sidebar entry in `examples/docs/astro.config.mjs`

### Doc page structure (MDX template)

Based on `examples/docs/src/content/docs/components/dialog.mdx`:
```mdx
---
title: ComponentName
description: One-sentence description.
---

import { Tabs, TabItem } from '@astrojs/starlight/components'
import { ComponentDemo } from '../../../demos/ComponentDemo'
import ComponentPreview from '../../../components/ComponentPreview.astro'
import PropsTable from '../../../components/PropsTable.astro'

Brief description of what the component does.

## Preview

<Tabs>
  <TabItem label="Preview">
    <ComponentPreview>
      <ComponentDemo client:load />
    </ComponentPreview>
  </TabItem>
  <TabItem label="React">
    ```tsx
    {code snippet}
    ```
  </TabItem>
  <TabItem label="Angular">
    ```ts
    {code snippet}
    ```
  </TabItem>
</Tabs>

## Installation

<Tabs>
  <TabItem label="CLI">
    ```bash
    npx snuxt add {name}
    ```
  </TabItem>
  <TabItem label="Manual (React)">
    {file list}
  </TabItem>
  <TabItem label="Manual (Angular)">
    {file list}
  </TabItem>
</Tabs>

## Usage

{usage code blocks}

## API Reference

<PropsTable props={[
  { name: '...', type: '...', description: '...' },
]} />
```

### Demo file pattern

`examples/docs/src/demos/DialogDemo.tsx`:
```tsx
import { useState } from 'react'
import { Dialog, DialogHeader, ..., Button } from '@snuxt-ui/react'

export function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      ...
    </div>
  )
}
```

Rules:
- Named export (not default)
- PascalCase: `{Name}Demo`
- File: `{Name}Demo.tsx` (PascalCase filename)
- Imports from `@snuxt-ui/react` (the workspace package)
- Minimal self-contained example of the component's primary use case

`examples/docs/src/demos/index.ts` re-exports all demos:
```typescript
export { ButtonDemo } from './ButtonDemo'
export { DialogDemo } from './DialogDemo'
...
```

---

## 8. TypeScript / Lint Conventions

### tsconfig.base.json settings

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Key strict flags: `noUnusedLocals`, `noUnusedParameters` — unused variables must be prefixed with `_` (e.g., `_coreHandleKeyDown`, `_highlightedIndex`). `isolatedModules: true` means type-only imports must use `import type { ... }`.

Each package extends this base and adds its own `outDir`, `rootDir`, and (for React) `jsx`.

### Biome rules

`biome.json`:
```json
{
  "formatter": {
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "linter": {
    "rules": {
      "recommended": true,
      "complexity": { "noForEach": "off" },
      "style": { "noNonNullAssertion": "warn" }
    }
  },
  "files": {
    "ignore": ["node_modules", "dist", ".turbo", "*.css"]
  }
}
```

Critical formatting rules:
- **Tabs** (not spaces) for indentation
- **Single quotes**
- **No semicolons** (ASI)
- Line width: 100

### Naming conventions

| Context | Convention | Examples |
|---------|-----------|---------|
| Files (React) | kebab-case | `dialog.tsx`, `use-dialog.ts` |
| Files (Angular) | kebab-case + `.component.ts` / `.directive.ts` | `dialog.component.ts` |
| Files (CSS) | kebab-case | `dropdown-menu.css` |
| React components | PascalCase | `Dialog`, `DialogTitle` |
| Angular classes | PascalCase with `Snx` prefix | `SnxDialogComponent` |
| Functions/hooks | camelCase | `createDialog`, `useDialog` |
| TypeScript interfaces | PascalCase | `DialogConfig`, `DialogProps` |
| CSS classes | `snx-` prefix, kebab-case | `snx-dialog-content` |
| CLI registry keys | kebab-case | `"dropdown-menu"` |

---

## 9. Vue Adapter Recommendations (NEW package)

> All items in this section are **RECOMMENDED** (not observed — `packages/vue/` does not exist yet). Recommendations are based on matching the React adapter's patterns as closely as possible.

### package.json shape

**RECOMMENDED** `packages/vue/package.json`:
```json
{
  "name": "@snuxt-ui/vue",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@snuxt-ui/core": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "tsup": "^8.3.0",
    "typescript": "^5.7.0",
    "vue": "^3.4.0",
    "vitest": "^2.1.0"
  }
}
```

### File naming recommendation

**RECOMMENDED**: Use `.ts` files with `defineComponent` + render function (NOT `.vue` SFCs) to match the React adapter's pattern of pure TypeScript files. This also makes tsup compilation simpler (no separate Vue plugin needed for SFC compilation).

However, if SFCs are preferred for readability, use `{name}.vue` for components and `composables/use-{name}.ts` for composables. SFCs require `@vitejs/plugin-vue` (see tsup config below).

**RECOMMENDED file structure**:
```
packages/vue/src/
  button.ts              (or button.vue)
  dialog.ts              (or dialog.vue)
  ...
  composables/
    use-dialog.ts
    use-tabs.ts
    use-accordion.ts
    use-select.ts
    use-tooltip.ts
    use-popover.ts
    use-toast.ts
    use-drawer.ts
    use-dropdown-menu.ts
  index.ts
```

### How to mirror React hook API in Vue composables

React hooks return `{ state, setter, ...coreApi }`. The Vue equivalent is composables returning `{ state (ref), ...coreApi }`.

**RECOMMENDED** `packages/vue/src/composables/use-dialog.ts`:
```typescript
import { ref, computed } from 'vue'
import { createDialog, type DialogConfig } from '@snuxt-ui/core'

export function useDialog(config: Omit<DialogConfig, 'onOpenChange'> = {}) {
  const open = ref(false)

  const api = computed(() =>
    createDialog({ ...config, onOpenChange: (v) => { open.value = v } })
  )

  return { open, api }
}
```

**RECOMMENDED** `packages/vue/src/composables/use-tabs.ts`:
```typescript
import { ref, computed } from 'vue'
import { createTabs, type TabItem, type TabsConfig } from '@snuxt-ui/core'

export function useTabs(items: TabItem[], config: Omit<TabsConfig, 'onValueChange'> = {}) {
  const value = ref(config.defaultValue ?? items[0]?.value ?? '')

  const api = computed(() =>
    createTabs(items, { ...config, onValueChange: (v) => { value.value = v } })
  )

  return { value, api }
}
```

Note: `computed()` replaces React's `useMemo()` for memoizing the factory object. The `onOpenChange` / `onValueChange` callbacks mutate the `ref` value directly.

### Component pattern recommendation

**RECOMMENDED** `packages/vue/src/button.ts` (defineComponent pattern):
```typescript
import { defineComponent, computed, h } from 'vue'
import { cn } from '@snuxt-ui/core'

export const Button = defineComponent({
  name: 'Button',
  props: {
    variant: {
      type: String as () => 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link',
      default: 'primary',
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg' | 'icon',
      default: 'md',
    },
    class: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
    const classes = computed(() =>
      cn('snx-btn', `snx-btn-${props.variant}`, `snx-btn-${props.size}`, props.class)
    )
    return () => h('button', { class: classes.value, ...attrs }, slots.default?.())
  },
})
```

### index.ts export pattern

**RECOMMENDED** `packages/vue/src/index.ts` — mirror React's grouping:
```typescript
// CSS-only components
export { Button } from './button'
export { Badge } from './badge'
...
// Interactive components
export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, useDialog } from './dialog'
...
// Composables
export { useDialog } from './composables/use-dialog'
export { useTabs } from './composables/use-tabs'
...
// AI components
export { PromptInput, ... } from './prompt-input'
```

### tsup config for Vue

**RECOMMENDED** `packages/vue/tsup.config.ts`:

If using `.ts` files only (no SFCs):
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['vue'],
})
```

If using `.vue` SFCs, tsup requires esbuild Vue plugin:
```typescript
import { defineConfig } from 'tsup'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['vue'],
  esbuildPlugins: [vue()],
})
```

**RECOMMENDED**: Use `vue-component-type-helpers` or `vue-tsc` for type generation when using SFCs, as tsup's `dts: true` does not understand `.vue` files natively. Simpler to stay with `.ts` + `defineComponent`.

### How to add Vue files to registry.json

**RECOMMENDED** — add `"vue"` key to each component entry alongside `"react"` and `"angular"`:
```json
{
  "name": "button",
  "type": "css-only",
  "files": {
    "css": "css/components/button.css",
    "react": "react/src/button.tsx",
    "angular": "angular/src/button.component.ts",
    "vue": "vue/src/button.ts"
  },
  "dependencies": { "internal": [], "npm": {} }
}
```

For interactive Vue components with composables:
```json
{
  "name": "dialog",
  "type": "interactive",
  "files": {
    "css": "css/components/dialog.css",
    "core": "core/src/dialog.ts",
    "react": ["react/src/dialog.tsx", "react/src/hooks/use-dialog.ts"],
    "angular": "angular/src/dialog.component.ts",
    "vue": ["vue/src/dialog.ts", "vue/src/composables/use-dialog.ts"]
  },
  "coreDeps": ["core/src/utils/dom.ts"],
  "dependencies": { "internal": ["button"], "npm": {} }
}
```

Framework detection in `packages/cli/src/utils/detect.ts` needs a new check:
```typescript
if (allDeps['vue']) return 'vue'
```
Add this before the `react` check or after `angular`.

### Vue tsconfig

**RECOMMENDED** `packages/vue/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "preserve"
  },
  "include": ["src"]
}
```

---

## 10. Inconsistencies / Questions

1. **Angular package has no actual build step** — `packages/angular/package.json` build script is `echo 'Angular components are source-distributed via CLI'`. This means `@snuxt-ui/angular` is never compiled to `dist/`. It can only be used by consumers via the CLI copy mechanism. The `main: "./src/index.ts"` points to TypeScript source. This is intentional per the project's design but means the Angular package cannot be `npm install`-ed and imported like the React package can. Worth clarifying if Angular is ever to be npm-distributed.

2. **`init.ts` injects `@import 'tailwindcss'` but `base.css` explicitly says NOT to** — The `init` command writes a `base.css` with `@import 'tailwindcss'` into the user's CSS file. The `packages/css/base.css` comment says users should import Tailwind separately. These are consistent in intent (the init-generated file IS the user's CSS file), but the comment in the package-level `base.css` may confuse agents who conflate the two files.

3. **`dialog.ts` accordion keyframe reference** — `base.css` contains `var(--radix-accordion-content-height, auto)` in the `@keyframes accordion-down`. This implies a previous Radix UI dependency. The accordion now seems to work without Radix, but this variable is a dead leftover unless the accordion actually uses Radix under the hood (the Angular/React accordion components use the custom `createAccordion` from core). This keyframe `var()` may never resolve correctly in production without Radix.

4. **`useMemo` deps in hooks can go stale** — `use-dialog.ts` has `useMemo(..., [config.modal])`. If config is an object passed inline (e.g., `useDialog({ modal: false })`), the dependency array is fine because the primitive is compared. But passing an object reference won't cause issues here since `config.modal` is a primitive. However `use-tabs.ts` has `[items, config.defaultValue]` — if `items` is a new array reference each render, the memo will bust on every render. This is a known React hook pattern issue, not a bug per se, but something Vue composables should handle differently with `watchEffect` or by requiring stable refs.

5. **`transform.ts` fallback for unknown symbols points to `cn`** — If a symbol imported from `@snuxt-ui/core` is not in `SYMBOL_TO_FILE`, it gets assigned to the `cn` file as a fallback (lines 80-84). This would silently produce a broken import in the user's project. New MCP core exports MUST be added to `SYMBOL_TO_FILE` before shipping.

6. **CSS `themes/dark.css` and `themes/default.css` exist but are not referenced anywhere** — `packages/css/themes/` contains `dark.css`, `default.css`, and `glass.css`. The `glass.css` is documented and used. But `dark.css` and `default.css` are not referenced in the docs, the CLI theme command, or the README. They may be redundant stubs.
