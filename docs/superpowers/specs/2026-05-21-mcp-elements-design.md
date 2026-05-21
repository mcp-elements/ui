# mcp-elements — Design Spec

**Status**: Draft — pending user review
**Date**: 2026-05-21
**Owner**: Mayur Rawte
**Supersedes**: `snuxt-ui` (current package; will be deprecated)
**Related**: `/WIP.md` (pipeline + decision log), `/docs/research/protocol-cheatsheet.md`, `/docs/research/codebase-conventions.md`, `/docs/research/brand-name-research.md`

---

## 1. Executive Summary

**`mcp-elements`** is a framework-agnostic, MCP-native UI component library distributed shadcn-style — a CLI copies code into the user's project. The headline value: production-grade UI primitives for the Model Context Protocol (server picker, OAuth/PKCE consent, scope inspector, resource browser, tool-call card, app-frame), shipped across React, Angular, and Vue from day one.

This spec covers a Phase 1 MVP — 7 MCP UI primitives plus a Vue adapter — and lays out the path to multi-framework parity and broader agent surfaces in subsequent phases.

## 2. Problem Statement

In May 2026:

- **MCP adoption is exploding** — 97M monthly SDK downloads (from 2M in late 2024), 9,400+ servers in the public registry, 78% of enterprise AI teams running MCP in production.
- **Every existing AI UI library is React-only.** Vercel AI Elements, assistant-ui, CopilotKit, Tambo, Cedar, prompt-kit, shadcn.io/ai — all React. The single multi-framework option (Deep Chat) is a monolithic `<deep-chat>` widget, not composable primitives.
- **No library ships consumer-side MCP UI primitives.** `mcp-ui` org provides the protocol SDK only. Developers building MCP-aware apps hand-roll server pickers, OAuth flows, tool argument forms, and scope inspectors from scratch.
- **Universal developer complaint** ([dev.to/alexander_lukashov, March 2026](https://dev.to/alexander_lukashov/i-evaluated-every-ai-chat-ui-library-in-2026-heres-what-i-found-and-what-i-built-4p10)): *"Streaming is solved. Approval flows, reasoning traces, tool execution displays, cost transparency, MCP UI — these are table stakes but nobody ships them as primitives."*

The wedge: ship the MCP UI primitives that nobody ships, in the frameworks that nobody serves, with the copy-paste model that everyone in the shadcn ecosystem already trusts.

See `/WIP.md` § Market Gap Evidence for full citations.

## 3. Goals & Non-Goals

### Goals
- **G1**: Ship 7 MCP UI primitives covering the MCP consumer surface area (server status, tool call, tool form, scope, consent, resource browser, app frame).
- **G2**: Ship React + Angular + Vue adapters from the v0.1 release.
- **G3**: Stay protocol-aware but runtime-free — components accept descriptor objects via props, no MCP client is bundled.
- **G4**: Match (or exceed) Vercel AI Elements' developer experience for copy-paste install via the CLI.
- **G5**: Provide one reference example app that connects to a real public MCP server and demonstrates all seven primitives.
- **G6**: Reach 500+ GitHub stars, 5,000+ weekly npm downloads, 3+ open-source reference projects within 90 days of v0.1 launch.

### Non-Goals (explicit)
- **N1**: Building an MCP client. Users supply one (`@modelcontextprotocol/sdk`, `mcp-use`, raw fetch).
- **N2**: Building an agent runtime. Users supply one (Mastra, LangChain, AI SDK, Claude Agent SDK, etc.).
- **N3**: Adding more chat-shell primitives — saturated category. The current 7 (PromptInput, ChatBubble, etc.) ship as-is.
- **N4**: Voice/multimodal primitives — ElevenLabs UI and LiveKit cover this.
- **N5**: Coding-agent / IDE primitives — too specialized for a generic library.
- **N6**: A SaaS/cloud offering. MIT, npm-distributed, no managed component.

## 4. Architecture

`mcp-elements` extends the existing 4-layer architecture from `snuxt-ui` unchanged. The architecture is well-understood by the codebase; the only structural change is adding a Vue adapter package and an MCP subdirectory in `core/` and each adapter.

```
Layer 0  packages/css/components/mcp-*.css            7 new stylesheets
Layer 1  packages/core/src/mcp/                       state machines, JSON-Schema→form,
                                                     OAuth/PKCE helpers, postMessage bridge
Layer 2  packages/react/src/mcp/      + hooks/        React components + hooks
         packages/angular/src/mcp/    + services/     Angular standalone components + services
         packages/vue/src/mcp/        + composables/  NEW PACKAGE — Vue 3 SFCs + composables
Layer 3  packages/cli                                 + Vue framework detection
                                                     + new registry entries
```

### 4.1 Layer 0 — CSS
Seven new stylesheets in `packages/css/components/`:
- `mcp-tool-call.css`
- `mcp-tool-form.css`
- `mcp-consent-dialog.css`
- `mcp-scope-inspector.css`
- `mcp-resource-browser.css`
- `mcp-server-status.css`
- `mcp-app-frame.css`

CSS class naming follows existing pattern `mcpe-{component}[-{modifier}]` inside `@layer components` (per `docs/research/codebase-conventions.md` § 2). Prefix changes from `snx-*` → `mcpe-*` across all packages as part of the rebrand (see § 9).

### 4.2 Layer 1 — Core
New module `packages/core/src/mcp/`:
- `types.ts` — TypeScript types for MCP descriptors (Server, Tool, Resource, Prompt, CallToolResult), mirroring the MCP 2025-11-25 spec. Source: `docs/research/protocol-cheatsheet.md` § 1.
- `oauth.ts` — OAuth 2.1 + PKCE state machine (`idle → authorizing → authorized | denied | error`). Includes code_verifier/code_challenge generation per RFC 7636.
- `schema-form.ts` — JSON Schema → form descriptor mapper (string/number/boolean/enum/array/object → field type + validation).
- `tool-state.ts` — Tool execution state machine (`idle → pending → running → done | error | cancelled`).
- `app-bridge.ts` — postMessage envelope helpers for MCP Apps spec.
- `scope.ts` — Parser turning OAuth scope strings into human-readable descriptions.

All core utilities are pure TypeScript with no framework imports, mirroring the existing `dialog.ts`, `tabs.ts`, etc. patterns. Unit-tested with Vitest.

### 4.3 Layer 2 — Framework Adapters
Each adapter (React, Angular, Vue) gets:
- 7 component files matching its idiom (`.tsx` / `.component.ts` / `.vue`)
- 4 headless hook/service/composable files exposing the core state machines

Component API contracts are identical across frameworks (same props, same emitted events), enabling identical documentation and demos.

### 4.4 Layer 3 — CLI
The CLI gets:
- `vue` framework detection in `init` (detects `vue` in package.json dependencies)
- New `registry.json` entries for 7 MCP components × 3 frameworks
- Registry meta `baseUrl` updated to `mcp-elements` repository
- Bin name changes from `snuxt-ui` to `mcp-elements`

## 5. Phase 1 MVP — Component Inventory

### 5.1 McpToolCall (interactive)
Tool execution card. Shows tool name, arguments, status, result/error, retry button.

**Props (shared across frameworks):**
- `tool: ToolCallDescriptor` — `{ id, name, arguments, status, result?, error? }`
- `onRetry?: () => void`
- `onCancel?: () => void`
- `expanded?: boolean`

**State integration:** consumes status from `useMcpToolState` hook or any external source — component is presentational.

**Composes:** Card, Button (already in lib).

### 5.2 McpToolForm (interactive)
Renders a JSON-Schema-defined form for tool arguments. Validates client-side. Submits via callback.

**Props:**
- `schema: JsonSchema` — the tool's input schema
- `defaultValues?: Record<string, unknown>`
- `onSubmit: (values: Record<string, unknown>) => void`
- `submitLabel?: string`

**Mapping rules** per `docs/research/protocol-cheatsheet.md` § 5. Uses `useMcpSchemaForm` hook internally.

**Composes:** Input, Textarea, Select, Switch, Chips.

### 5.3 McpConsentDialog (interactive)
OAuth/PKCE consent UI. Shows requested scopes, server identity, approve/deny actions.

**Props:**
- `server: ServerDescriptor` — `{ name, origin, iconUrl?, description? }`
- `scopes: ScopeDescriptor[]`
- `onApprove: () => void`
- `onDeny: () => void`
- `open: boolean`

**Composes:** Dialog, Button, Alert, Avatar.

### 5.4 McpScopeInspector (interactive)
Expandable list of OAuth/MCP scopes with human-readable descriptions. Used inside `McpConsentDialog` and as a standalone surface.

**Props:**
- `scopes: ScopeDescriptor[]`
- `expandedByDefault?: boolean`
- `onScopeClick?: (scope: ScopeDescriptor) => void`

**Composes:** Accordion, Badge.

### 5.5 McpResourceBrowser (interactive)
Browse MCP resources (files, database rows, etc.) with type-icon list + preview pane on selection.

**Props:**
- `resources: ResourceDescriptor[]`
- `selectedUri?: string`
- `onSelect: (uri: string) => void`
- `loading?: boolean`

**Composes:** Card, Skeleton, Separator.

### 5.6 McpServerStatus (CSS-only, no state machine)
Connection state badge. CSS-only means no Layer-1 state machine — the component is a thin adapter rendering the status passed in by the user. Variants: `connected | disconnected | error | reconnecting`.

**Props:**
- `status: 'connected' | 'disconnected' | 'error' | 'reconnecting'`
- `serverName?: string`

**Composes:** Badge.

### 5.7 McpAppFrame (interactive — **preview**)
Sandboxed iframe wrapper implementing the MCP Apps spec (2026-01-26). Bidirectional postMessage bridge for host ↔ app communication.

**Props:**
- `uiResource: UiResource` — `{ uri, mimeType, content }`
- `onMessage?: (msg: AppMessage) => void`
- `onResize?: (dimensions: { width: number; height: number }) => void`
- `sandbox?: string` — defaults to `"allow-scripts allow-forms"` per spec

**Marked `preview`** because the MCP Apps spec is 4 months old and some message-type strings are not yet finalized (see `docs/research/protocol-cheatsheet.md` § 8). Pinned to MCP Apps spec version `2026-01-26`.

**Composes:** none (raw iframe + helpers).

## 6. Headless Hooks / Services / Composables

Each framework gets four headless primitives that wrap the core state machines.

| Name | React | Angular | Vue |
|---|---|---|---|
| Tool state | `useMcpToolState` | `McpToolStateService` | `useMcpToolState` |
| OAuth flow | `useMcpOAuth` | `McpOAuthService` | `useMcpOAuth` |
| App bridge | `useMcpAppBridge` | `McpAppBridgeService` | `useMcpAppBridge` |
| Schema form | `useMcpSchemaForm` | `McpSchemaFormService` | `useMcpSchemaForm` |

API contracts are intentionally identical (same input/output shapes), differing only in idiom (hook return tuple in React; service class in Angular; composable object in Vue).

## 7. Vue Adapter — `@mcp-elements/vue`

New workspace package: `packages/vue/`. Vue 3 only (Composition API). Vue 2 compat deferred to Phase 2 if requested.

### 7.1 Launch component set
**10 base components** (most-used) ported from React/Angular:
Button, Card, Dialog, Input, Textarea, Select, Tabs, Badge, Switch, Alert

**7 MCP components** (all of them — same set as React/Angular).

**4 composables** matching React hooks.

The remaining 21 base components ship in Phase 2.

### 7.2 File format — `defineComponent` + `.ts` (not `.vue` SFCs)
Per `docs/research/codebase-conventions.md` § 9 (RECOMMENDED): use `defineComponent` in plain `.ts` files, not `.vue` Single-File Components. Rationale:
- Keeps `tsup` build pipeline identical to React adapter (no `vite-plugin-vue` needed)
- Mirrors React's `forwardRef` + `displayName` template exactly — easier to maintain parallel implementations
- Templates use `h(...)` render functions or JSX (with `@vue/babel-plugin-jsx`)
- Composables live at `packages/vue/src/composables/use-{name}.ts` and use `computed()` where React uses `useMemo`

### 7.3 Build
- `tsup` config (no SFC plugin needed since we use `defineComponent` + `.ts`)
- Peer dependencies: `vue: ^3.4.0`
- Entry: `dist/index.mjs` + `dist/index.cjs` + `dist/index.d.ts`

### 7.3 Example app
New `examples/vue-app/` mirroring `examples/react-app/`. Demonstrates all 10 base + 7 MCP components with live MCP server connection.

## 8. CLI Changes

- Bin name: `snuxt-ui` → `mcp-elements`
- `init` command:
  - Detects `react`, `angular`, OR `vue` in user's `package.json`
  - Writes `mcp-elements.json` config (was `snuxt-ui.json`)
- `add` command:
  - Resolves component files via updated `registry.json`
  - Supports `npx mcp-elements add mcp-tool-call mcp-consent-dialog ...`
- `add @mcp` (Phase 2): group install of all MCP primitives — deferred, requires registry category support.
- All CSS class references in copied files use the new `mcpe-*` prefix.

## 9. Migration from `snuxt-ui`

Existing snuxt-ui adopters (zero known users today, but possible) get:
- A deprecation notice on `snuxt-ui` npm packages pointing at `@mcp-elements/*`.
- A migration guide at `docs/migration/from-snuxt-ui.md` documenting:
  - Rename imports: `from '@snuxt-ui/react' → from '@mcp-elements/react'`
  - Rename CSS classes: `snx-* → mcpe-*` (via codemod script)
  - Update CLI invocations: `npx snuxt-ui ... → npx mcp-elements ...`
- A codemod (`scripts/migrate-from-snuxt-ui.ts`) using `jscodeshift` or simple find-and-replace.

The pivot is essentially a rename + repositioning. No semantic API changes to existing components.

## 10. Testing Strategy

- **Unit tests**: Vitest, framework-free, against `packages/core/src/mcp/*`. Coverage target: 80%+ for state machines (OAuth, tool-state, schema-form, app-bridge).
- **Adapter integration tests**:
  - React: Vitest + `@testing-library/react`
  - Angular: Vitest + Angular CDK testing utilities
  - Vue: Vitest + `@vue/test-utils`
- **Visual regression**: deferred to Phase 2 (Chromatic via Storybook).
- **End-to-end**: the reference example app (`examples/mcp-agent/`) connects to a real MCP server (GitHub MCP or filesystem MCP) and is verified manually before each release.
- **Type tests**: `tsd` against public types in `@mcp-elements/core`.

## 11. Documentation

- New site at `mcp-elements.dev` (Astro + Starlight, same stack as existing docs).
- Hero rewritten with new tagline: *"MCP UI for any framework."*
- New top-level docs sections:
  - **Getting Started** — install, framework picker
  - **MCP UI** — the 7 primitives, each with React/Angular/Vue tabs and live demo
  - **Hooks & Services** — the 4 headless primitives
  - **Examples** — link to `mcp-agent` reference app
  - **Migration** — from snuxt-ui
- Framework-specific Quick Start guides: React, Angular, Vue.
- Per-component pages mirror existing structure (description, props table, examples, accessibility notes).

## 12. Phased Delivery

**Capacity assumption (resolved OQ5)**: solo builder, ~10-15 hrs/week. All timeboxes are calendar weeks under this constraint.

| Phase | Calendar Timebox | Deliverables |
|---|---|---|
| **1 — MCP UI MVP** | 8-10 weeks | All 7 MCP primitives × 3 frameworks, 4 headless hooks/services/composables × 3, Vue adapter bootstrap (10 base + 7 MCP), CLI Vue support, docs section, reference example app |
| **1.5 — Polish** | 3-4 weeks | Bug fixes, accessibility audit (axe + manual), reference example app stress-test against 3+ real MCP servers, launch blog post + Show HN |
| **2 — Multi-framework parity** | 6-8 weeks | Remaining 21 base components → Vue, Svelte adapter (existing + MCP), web-components adapter via Lit, Storybook + Chromatic |
| **3 — Agent primitives** | separate spec | Plan tree, reasoning trace, cost meter, agent timeline, multi-agent dashboard, interrupt/resume |

Total time-to-launch (Phase 1 + 1.5): ~12 weeks calendar, ~150-200 builder-hours.

## 13. Success Metrics (90 days post v0.1)

| Metric | Target | Source |
|---|---|---|
| GitHub stars | 500+ | github.com/mcp-elements |
| Weekly npm downloads (combined) | 5,000+ | npmjs.com |
| Open-source reference projects | 3+ | search + community submissions |
| MCP ecosystem mentions | 1+ | Anthropic blog/docs, MCP-UI showcase, ag-ui-protocol docs |
| Enterprise inbound conversations | 1+ | direct |

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MCP Apps spec shifts during Phase 1 | Medium | Medium | `McpAppFrame` shipped with `preview` tag + pinned to spec version `2026-01-26` |
| Vue adapter delays Phase 1 launch | Medium | Medium | Port only 10 essential base components at launch; remaining 21 → Phase 2 |
| Vercel ships multi-framework AI Elements within 6 months | Low | High | Their public roadmap shows no multi-framework intent in 2026; if they do, we differentiate on MCP-native + agent-control |
| Copy-paste of complex state machines is brittle | Medium | Low | State machines stay in `@mcp-elements/core` (npm dep); only thin component shells are copied |
| MCP adoption plateaus | Low | High | Position broadens to "agent UI" in Phase 3; current 7 chat-shell components remain |
| Brand "mcp-elements" looks too tied to MCP if MCP fades | Low | Medium | Possible rebrand post-Phase-2 if needed; brand pivots are cheap at small scale |

## 15. Open Questions

| ID | Question | Resolution | Status |
|---|---|---|---|
| OQ1 | Defer `McpAppFrame` to Phase 1.5 vs ship with `preview`? | **Ship in Phase 1 with `preview` tag**, pinned to spec version `2026-01-26` | ✅ Resolved 2026-05-21 |
| OQ2 | Vue 2.7 compat — Phase 2 or never? | Phase 2 only if community asks | Default; revisit post-launch |
| OQ3 | Should the CLI support `npx mcp-elements add @mcp` to install the whole MCP kit at once? | Defer to Phase 2 | Default; revisit post-launch |
| OQ4 | Storybook now or Phase 2? | Phase 2 | Default; revisit pre-release |
| OQ5 | Team size and weekly time commitment | **Solo builder, ~10-15 hrs/week** | ✅ Resolved 2026-05-21 |

## 16. Out-of-Scope Future Work

Captured here so they're explicitly deferred and not lost:
- **GraphRAG / entity-aware search UI** (entity chip with popover, source-confidence bar, subgraph mini-map) — Phase 3 candidate
- **Computer-use agent replay & approval kit** (screenshot scrubber, bbox overlay) — Phase 3 candidate
- **Hosted demo deployment** (Vercel preview env per release)
- **shadcn-style Skills integration** (`shadcn add @mcp-elements/mcp-tool-call`)
- **Marketplace listing** on MCP-UI org showcase

## 17. Appendix: Research Sources

Full source list lives in `/WIP.md` § Research Sources. Highlights:

- **Competitive map**: elements.ai-sdk.dev, github.com/vercel/ai-elements, copilotkit.ai, assistant-ui.com, tambo.co, deepchat.dev
- **MCP adoption**: blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/, digitalapplied.com/blog/mcp-adoption-statistics-2026, mcpui.dev
- **Pain points**: dev.to/alexander_lukashov/i-evaluated-every-ai-chat-ui-library-in-2026, github.com/vercel/ai-elements/issues/66, github.com/vercel/ai-elements/issues/285, maximepeabody.com/blog/mcp-missing-ui
- **Protocol references**: `docs/research/protocol-cheatsheet.md` (in-repo digest of MCP, MCP Apps, AG-UI, OAuth 2.1)
- **Codebase conventions**: `docs/research/codebase-conventions.md` (in-repo style guide derived from existing snuxt-ui code)

---

## How to use this spec

1. **Read § 1-3** to understand what we're building and why.
2. **Read § 4-7** for the technical surface area.
3. **Read § 12-15** for sequencing and tradeoffs.
4. **Resolve § 15 open questions** before invoking the writing-plans skill.
5. **Hand this spec + WIP.md to writing-plans skill** to produce step-by-step implementation tasks.
