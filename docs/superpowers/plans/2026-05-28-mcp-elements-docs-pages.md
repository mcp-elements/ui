# Plan: mcp-elements Component Docs Pages

**Date:** 2026-05-28
**Branch:** feat/docs-component-pages
**Worktree:** `.worktrees/docs-pages`

## Goal

Add `/components/[slug]` individual documentation pages to the `examples/web` Next.js site.

## Deliverables

1. **`examples/web/src/app/components/layout.tsx`** — 3-column shell: sticky left sidebar (all 38 components grouped by category) + main content slot. Sidebar hidden on mobile (`hidden lg:block`).

2. **`examples/web/src/lib/component-docs.ts`** — `ComponentDoc` type + `COMPONENT_DOCS` record with `props: PropRow[]` and `usage: string` for ≥10 components. Exported `getComponentDoc(slug)` helper.

3. **`examples/web/src/app/components/[slug]/page.tsx`** — dynamic route with:
   - `generateStaticParams()` pre-rendering all 38 slugs
   - `generateMetadata()` for SEO
   - Header with name, category badge, framework badges, optional "New" badge, description
   - Installation section using `<InstallCommand>` (updated to accept `slug` prop)
   - Usage section using `<CodeBlock>` when `doc.usage` exists
   - Props table when `doc.props` exists
   - Fallback "coming soon" block when no doc entry found

4. **`InstallCommand` update** — add optional `slug` prop; when provided, show `npx @mcp-elements/cli add <slug>`.

## Steps

1. Write this plan file
2. Create layout.tsx
3. Create component-docs.ts
4. Create [slug]/page.tsx
5. Update InstallCommand to accept slug prop
6. Verify CATEGORIES is exported from components.ts (already done)
7. Run pnpm build in examples/web
8. Fix any TypeScript errors
9. Commit

## Key constraints

- Next.js 15 App Router: `params` is `Promise<{slug: string}>`, must `await params`
- `CodeBlock` is async server component (uses shiki)
- `InstallCommand` is `'use client'` — no async needed
- Site CSS custom properties: `--site-bg`, `--site-bg-elevated`, `--site-accent`, `--site-text`, `--site-text-muted`, `--site-border`
