# Show HN draft (I8)

HN text posts are plain text — no markdown, no code blocks. Paragraph breaks only.
Title is 71 chars (limit 80).

---

## Title

Show HN: Mcp-elements – copy-paste UI components for MCP clients

## URL

https://mcp-elements.wearesnx.studio

## Text

I kept rebuilding the same screens every time I worked on an MCP client: the OAuth consent dialog, the tool-call card with its state machine, a scope list, a resource browser. Chat UI is a solved problem — there are a dozen good kits — but the MCP-specific surface isn't, so every client hand-rolls it.

mcp-elements is 38 components you copy into your project with a CLI, shadcn-style. Seven are MCP-specific: tool-call card (idle/pending/running/done/error/cancelled, with retry), JSON-Schema-to-form with validation, OAuth consent dialog, scope inspector, resource browser, server status badge, and a sandboxed iframe frame for the MCP Apps spec. The other 31 are the base and AI pieces you need around them — chat bubble, streaming text, prompt input, and so on.

The architecture is three layers: plain-TypeScript state machines in a core package (tool lifecycle, consent flow, schema-to-form), thin adapters for React, Angular and Vue on top, and a separate CSS layer with OKLCH design tokens. All three frameworks share the same state machines and the same CSS, so behavior and appearance match across them. The CLI copies source files into your repo and rewrites imports to relative paths — no runtime dependency, you own the code. MIT.

Details I spent real time on: dialog focus management (focus moves in on open, Escape closes, focus restores to the trigger), aria-live announcements on connection status, WCAG AA contrast in both themes.

Caveats: it's v0.1. All seven MCP components ship for all three frameworks; the base set is complete in React and Angular, while Vue has ten of them so far. The MCP Apps frame follows the spec as published in January — the spec is young and may still move.

The docs site runs every component live on the page (no screenshots), including the playground: https://mcp-elements.wearesnx.studio/playground

If you've built an MCP client, I'd like to know what's missing from the set.
