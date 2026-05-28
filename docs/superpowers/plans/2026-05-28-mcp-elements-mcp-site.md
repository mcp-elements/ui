# Plan 3d — MCP Site Pages: /mcp, /playground, /themes

**Date:** 2026-05-28
**Branch:** feat/mcp-site-pages
**Worktree:** /Users/mayurrawte/thepsygeek/snx-ui/.worktrees/mcp-site

## Goal

Add three new pages to the mcp-elements documentation site at `examples/web/`:

1. `/mcp` — MCP protocol flow showcase + 7-component grid + quick-start code
2. `/playground` — 5 tabbed copy-paste examples for all MCP components
3. `/themes` — OKLCH theme previewer + CSS custom properties reference

SiteNav already has all 4 links (Components, MCP, Playground, Themes) — no changes needed there.

## Implementation Notes

- `CodeBlock` is an async server component (uses shiki). Cannot be used directly in `'use client'` pages.
- `/playground` page is client-only (tab state). Use a styled `<pre>` block for code display instead of `<CodeBlock>`.
- `/mcp` page is a server component — can use `<CodeBlock>` normally.
- `/themes` page is client-only (theme switcher state). Uses styled `<pre>` for CSS vars display.

## Steps

1. [x] Write plan to docs/superpowers/plans/
2. [ ] Create examples/web/src/app/mcp/page.tsx
3. [ ] Create examples/web/src/app/playground/page.tsx
4. [ ] Create examples/web/src/app/themes/page.tsx
5. [ ] Confirm SiteNav already has new routes (it does)
6. [ ] pnpm build check
7. [ ] git commit

## File Paths

- `examples/web/src/app/mcp/page.tsx`
- `examples/web/src/app/playground/page.tsx`
- `examples/web/src/app/themes/page.tsx`
- `examples/web/src/components/site/SiteNav.tsx` (no changes needed)
