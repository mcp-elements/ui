# WIP: Pivot to `mcp-elements` — MCP-Native, Multi-Framework AI UI Library

**Status**: All Stage E (React MCP), Stage E8 (React hooks), Stage F (Angular MCP), Stage C (Vue adapter bootstrap), Plan 3b (docs pages), Plan 3d (MCP site pages) complete. Build green. 46 static routes. Next: Stage I (launch — npm publish, blog post, distribution).
**Started**: 2026-05-21
**Last updated**: 2026-05-28

---

## 🚨 Quick Resume (read this first if context is lost)

We're pivoting `snuxt-ui` (generic UI lib with 31 components + 7 thin AI components, near-zero traction) into **`mcp-elements`** — an MCP-native, multi-framework AI UI library.

- **Brand**: `mcp-elements` (locked 2026-05-21)
- **Tagline**: "MCP UI for any framework."
- **npm**: `@mcp-elements/{core,react,angular,vue,css,cli}` — all free
- **Domain**: `mcp-elements.dev` (preferred); .ui / .io / .tools / .app also free
- **GitHub**: `github.com/mcp-elements` (org) — available
- Architecture: keep the existing 4-layer (CSS → core → adapters → CLI)
- New deliverable: 7 MCP UI primitives + Vue adapter + 4 headless hooks per framework
- Frameworks at launch: **React + Angular + Vue**

**Status**:
- ✅ Plan 1 (rename) executed + merged to main — 12 commits, build green
- 📝 Plan 2 (MCP core utilities) drafted at `docs/superpowers/plans/2026-05-21-mcp-elements-02-core.md` — NOT yet executed
- ⏳ Plans 3-6 to be drafted

**Next concrete step**: draft + execute Plan 3 — MCP × React (7 React components + 4 hooks using `@mcp-elements/core/mcp/*`).

---

## ✅ Locked Decisions

1. **Wedge**: MCP-native UI kit — server picker, consent, scope, tool-call, resource browser, app-frame
2. **Frameworks at launch**: React + Angular + Vue (Svelte + web-components → Phase 2)
3. **Protocol stance**: Protocol-aware but **runtime-free** (no MCP client bundled; user supplies one)
4. **Target user**: Builders shipping production agents on Claude Agent SDK / OpenAI Agents / Mastra / LangGraph / custom
5. **Packaging**: Single rebranded repo. Retire `snuxt-ui` name; new brand becomes the umbrella for base + MCP + future agent components
6. **Pivot scope**: Rename + sharpen positioning — new brand, new domain, new docs, **same codebase** (existing 31 components become the foundation)
7. **Distribution**: Copy-paste CLI (`npx <brand> add mcp-tool-call`) + npm packages for `@<brand>/core` and adapters
8. **License**: MIT

---

## 📊 Market Gap Evidence (so we don't re-research)

### Competitive landscape — May 2026
| Library | Stars | Frameworks | Distribution | Gap |
|---|---|---|---|---|
| Vercel AI Elements | ~2K, 38K/wk | **React/Next.js only** | Copy-paste, MIT | No multi-framework; no MCP-Apps support |
| assistant-ui | 10.2K | React only (+ RN, Ink) | npm + $50/mo cloud | React-only; cloud upsell |
| CopilotKit | 31.6K | React + Angular | npm, $27M Series A May 2026 | Heavy/coupled; full runtime adoption required |
| Tambo | 11.2K | React only | SDK + cloud | Whole-stack commitment |
| Liveblocks AI Copilots | — | React only | SaaS-only | Locked behind platform |
| shadcn.io/ai | — | React only | Copy-paste | Re-packaged AI Elements |
| shadcn-chatbot-kit (Blazity) | 788 | React only | Copy-paste | Solid, unremarkable |
| Cedar-OS | 172 | React only | Copy-paste | Tightly coupled to Mastra |
| LlamaIndex chat-ui | — | React only | npm | Bound to LlamaIndex |
| Deep Chat | 3.6K | **Multi-framework** | npm | **MONOLITHIC single `<deep-chat>` widget — not composable primitives** |

**Verdict**: No library ships **framework-agnostic, composable, copy-paste AI primitives**. Deep Chat is multi-framework but monolithic. Everyone else is React-only.

### Ecosystem signals (the WHY)
- **MCP**: SDK downloads **2M → 97M/month** (+4,750%) by March 2026. **9,400+ MCP servers** in registry (up from 1,200 Q1 2025). **78% of enterprise AI teams** have an MCP-backed agent in production.
- **MCP Apps spec**: shipped Nov 2025/Jan 2026. Formalized UI-over-MCP via sandboxed iframes + postMessage.
- **AG-UI protocol**: CopilotKit raised $27M (May 5 2026). Adopted by Google, Microsoft, Amazon, Oracle, AWS Bedrock AgentCore.
- **Vercel AI SDK 6**: Agent abstraction shipped; AI SDK RSC paused.
- **Computer-use agents**: Claude/Operator/Codex/Cursor3/Windsurf — every product reinvents screenshot+action-log+scrubber+approval. No primitive library.
- **Cursor 3** (Apr 2026): "Agents Window" tiling concurrent agents. **Claude Code Agent View** (May 2026): async-by-default dashboard.

### Top pain points (from dev forums, GitHub issues, blogs)
1. **Agent primitives missing** — universal complaint: "streaming is solved; approvals, reasoning traces, tool execution, cost transparency are table stakes but no one ships them as primitives" (Lukashov, Mar 2026)
2. **Non-React frameworks underserved** — Svelte issue on `vercel/ai-elements` (#66) open since Sept 2025, unanswered; "AI-focused React libraries are 3-4x larger than Vue's"
3. **Customization frustration** — "AI Elements too opinionated, assistant-ui too heavyweight, CopilotKit too coupling"
4. **MCP has no standard component layer** — explicit requests: vercel/ai-elements #285 (MCP Apps), LibreChat discussion #10089, Peabody blog Apr 2025
5. **Citations/RAG inline attribution half-solved** — Vercel AI SDK docs: "no official support for inline citations"
6. **Streaming aria-live broken** — almost no library handles screen-reader announcements correctly during token streaming
7. **Mobile chat input + virtual keyboard interaction** unsolved on Android web

### The open category: MCP consumer UI
**No library ships**: server picker, OAuth/PKCE consent dialog, scope inspector, resource browser, tool-call card with arg form, MCP-Apps sandboxed renderer. `mcp-ui` org provides protocol SDK only — no opinionated primitives.

---

## 🏗️ Design

### Architecture (extends existing 4-layer)
```
Layer 0  packages/css/components/mcp-*.css            7 new stylesheets
Layer 1  packages/core/src/mcp/                       state machines, JSON-Schema→form, OAuth/PKCE, postMessage bridge
Layer 2  packages/react/src/mcp/      + hooks/        React components + hooks
         packages/angular/src/mcp/    + services/     Angular standalone components + services
         packages/vue/src/mcp/        + composables/  NEW PACKAGE — Vue 3 SFCs + composables
Layer 3  packages/cli                                 + Vue framework detection + new registry entries
```

**Key rule**: `@<brand>/core` stays in npm (state machines too complex to copy-paste reliably). Only thin component shells get copied via CLI. Same boundary that already exists.

### Phase 1 MVP — 7 MCP primitives
| Component | Type | Purpose | Composes |
|---|---|---|---|
| `McpToolCall` | interactive | Tool call card: name, args, status (idle→pending→running→done/error), result, retry | Card, Button |
| `McpToolForm` | interactive | JSON Schema → form fields with validation, submit | Input, Textarea, Select, Switch |
| `McpConsentDialog` | interactive | OAuth/PKCE consent UI: scope list, approve/deny | Dialog, Button, Alert |
| `McpScopeInspector` | interactive | Expandable scope tree with human-readable descriptions | Accordion, Badge |
| `McpResourceBrowser` | interactive | Browse MCP resources with type icons + preview pane | Card, Skeleton |
| `McpServerStatus` | css-only | Connection badge: connected / disconnected / error / reconnecting | Badge |
| `McpAppFrame` | interactive (**preview**) | Sandboxed iframe wrapper for MCP Apps spec; bidirectional postMessage bridge | — |

### Headless hooks/services (per framework)
- `useMcpToolState` — idle → pending → running → done | error
- `useMcpOAuth` — idle → authorizing → authorized | denied | error
- `useMcpAppBridge` — postMessage send/receive with MCP App iframes
- `useMcpSchemaForm` — JSON Schema → form descriptors + validation

### Vue adapter scope at launch (`@<brand>/vue`)
- 10 most-used base components ported (Button, Card, Dialog, Input, Textarea, Select, Tabs, Badge, Switch, Alert)
- All 7 new MCP components
- 4 composables matching React hooks
- Remaining 21 base components → Phase 2

### Non-goals (explicit)
- ❌ Building an MCP client — use `@modelcontextprotocol/sdk` or `mcp-use`
- ❌ Bundling an agent runtime — BYO (Mastra, LangChain, AI SDK, raw)
- ❌ More chat-shell primitives — saturated category; keep current 7 unchanged
- ❌ Voice/multimodal — ElevenLabs UI + LiveKit cover it
- ❌ Building an IDE / coding-agent UI — too specialized for a generic library

### Risks
| Risk | Mitigation |
|---|---|
| MCP Apps spec is young (Jan 2026), could shift | Ship `McpAppFrame` with **preview** tag; pin to spec version |
| Vue adapter is meaningful new surface; could delay launch | Port only 10 essential base components at launch, finish in Phase 2 |
| shadcn-style copy-paste of complex state machines is brittle | Keep machines in `@<brand>/core` npm dep; copy only thin shells |
| 78% enterprise MCP adoption could plateau | Position as "agent UI" more broadly — MCP is the wedge |
| Vercel ships multi-framework AI Elements | Their public roadmap shows no multi-framework intent in 2026 — we get 12+ month lead |

### Success metrics (90 days post v0.1 launch)
- 500+ GitHub stars
- 5,000+ weekly npm downloads across packages
- 3+ open-source reference projects using the MCP kit
- 1+ mention in MCP ecosystem channels (Anthropic docs, MCP blog, MCP-UI org)
- 1+ enterprise inbound conversation

---

## 🛠️ Pipeline / Steps To Execute

> Convention: stages run sequentially A→I unless marked **(parallel ok)**. Inside a stage, items may parallelize.

### Stage A: Pre-build (sequential, blocking)
- [ ] **A1: Decide brand name** — see [Q1](#q1-brand-name-blocks-stage-a3-and-stage-b)
- [ ] **A2: Verify domain + npm scope availability** for chosen name
- [ ] **A3: Write formal spec** at `docs/superpowers/specs/2026-05-21-<brand>-design.md`
- [ ] **A4: Spec self-review** (placeholders, contradictions, ambiguity, scope)
- [ ] **A5: User reviews spec**
- [ ] **A6: Invoke writing-plans skill** to produce step-by-step implementation plan

### Stage B: Repo restructure ✅ COMPLETE 2026-05-21
On branch `feat/rename-to-mcp-elements`, 11 commits (`7f5dd8f`..`7cf3264`). Build green 7/7. Assertion script `scripts/check-no-stale-brand.sh` passes.

- [x] **B1: Rename packages** `@snuxt-ui/*` → `@mcp-elements/*` across codebase (commits `975ca6f`, `8cf7148`, `158fdc4`, `0acb36d`)
- [x] **B2: Update docs domain** (snuxt-ui.dev → `mcp-elements.dev`) — done in docs site task (commit `92d902e`)
- [x] **B3: Update README + homepage** — new positioning + tagline (commit `7cf3264`)
- [ ] **B4: Rename GitHub repo** — deferred; do manually when ready to push (org `mcp-elements` reserved per brand research)
- [ ] **B5: Deprecate `snuxt-ui` npm packages** with pointer to new name — deferred until v0.1 npm publish (Stage I)
- [x] **B6: Update all internal references** (`snx-` CSS prefix → `mcpe-`) — commit `bf7c31f`, 794 occurrences

**Follow-ups discovered during execution:**
- CLI `transform.ts` regex literal needed manual fix (escaped slash bypassed sed; caught by code review, commit `9fb4db6`)
- Plan underspecified examples/* package.json touch points (forced by pnpm workspace deps) — corrected during execution
- macOS sed lacks `\b` word boundaries; future plans should use plain string match
- CNAME file updated to `mcp-elements.wearesnx.studio` — DNS will need separate update when domain is acquired
- Angular `snxTooltip` (camelCase) renamed to `mcpeTooltip` — would have been missed by hyphen-only sed; agent caught it
- `packages/core/src/{dialog,tooltip}.ts` had `snx-` DOM ID prefixes that plan grep missed — agent caught

### Stage C: Vue adapter bootstrap (parallel ok with D) ✅ COMPLETE 2026-05-28
On branch `feat/vue-adapter`, merged via no-ff. Build green. `packages/vue/` ships 10 Vue 3 components as `.ts` files using `defineComponent` + render functions (tsup-compatible, no `.vue` SFC files needed).
- [x] **C1: Create `packages/vue/`** skeleton — `package.json`, `tsconfig.json`, `tsup.config.ts`
- [x] **C2: Use `cn()` utility from `@mcp-elements/core`** (workspace dep)
- [x] **C3: Port 10 base components** as Vue 3 `defineComponent`s:
  - [x] Button, Card (+ Header/Title/Description/Content/Footer), Dialog (Teleport + scroll lock), Input, Textarea, Select, Tabs, Badge, Switch, Alert
- [ ] **C4: Vue example app** in `examples/vue-app/` (deferred)
- [ ] **C5: CLI updates** — detect Vue projects in `init`, emit Vue files in `add` (deferred)
- [ ] **C6: Add Vue entries to `registry.json`** (deferred)

### Stage D: MCP core utilities (parallel ok with C)
- [x] **D1: MCP types** — `packages/core/src/mcp/types.ts`
- [x] **D2: OAuth/PKCE state machine** — `packages/core/src/mcp/oauth.ts`
- [x] **D3: JSON Schema → form descriptor** — `packages/core/src/mcp/schema-form.ts`
- [x] **D4: Tool state machine** — `packages/core/src/mcp/tool-state.ts`
- [x] **D5: postMessage bridge** for MCP Apps — `packages/core/src/mcp/app-bridge.ts`
- [x] **D6: Scope parser** — `packages/core/src/mcp/scope.ts`
- [x] **D7: Unit tests** (Vitest, framework-free) for D1-D6

### Stage E: MCP components × React (after D) ✅ COMPLETE 2026-05-28
On branch `feat/mcp-react-components`, 9 commits. Build green. All 7 components in `packages/react/src/mcp/` + CSS in `packages/css/components/mcp-*.css`. Accessible via `@mcp-elements/react` root import.
- [x] **E1: McpServerStatus** (CSS + React)
- [x] **E2: McpToolCall** (CSS + React, subscribes to ToolStateApi)
- [x] **E3: McpToolForm** (CSS + React, schemaToFields → dynamic form)
- [x] **E4: McpScopeInspector** (CSS + React, accordion)
- [x] **E5: McpConsentDialog** (CSS + React, parseScopes + Dialog + Button)
- [x] **E6: McpResourceBrowser** (CSS + React, Skeleton loading state)
- [x] **E7: McpAppFrame** (CSS + React, sandboxed iframe + createAppBridge)
- [x] **E8: React hooks** — useMcpToolState, useMcpOAuth, useMcpAppBridge (ref pattern for stable inline callbacks), useMcpSchemaForm (useCallback stable refs) ✅ 2026-05-28

### Stage F: MCP components × Angular (parallel ok with E, after D) ✅ COMPLETE 2026-05-28
On branch `feat/angular-mcp`, merged via no-ff. Build green. 7 Angular 19 standalone components in `packages/angular/src/mcp/` using signals + effect() for state subscriptions.
- [x] All 7 Mcp components: ServerStatus, ToolCall, ToolForm (typed event handlers, no `$any()`), ConsentDialog, ScopeInspector, ResourceBrowser, AppFrame
- [x] All use `McpeXxx` class naming + `mcpe-mcp-*` selectors
- [x] Barrel export wired via `export * from './mcp'` in `packages/angular/src/index.ts`
- [ ] **F8: Angular services** — equivalents of React hooks (deferred to Phase 1.5)

### Stage G: MCP components × Vue (after C + D)
- [ ] Same 7 components as Vue 3 SFCs + composables (deferred — base 10 done in Stage C)

### Stage H: Website + Docs (replaces old Astro/Starlight site)

#### Plan 3a: Site Foundation ✅ COMPLETE 2026-05-28
On branch `feat/web-site-foundation`, 9 commits. Build green. Routes: `/`, `/components`.
- [x] **H-W1: Next.js 15 scaffold** — `examples/web/` with Tailwind v4, Geist fonts, workspace deps
- [x] **H-W2: Shared site components** — SiteNav (GitHub stars), SiteFooter, ThemeToggle (dark/light), CodeBlock (Shiki), CopyButton, InstallCommand
- [x] **H-W3: Homepage** — hero (animated HeroToolCallDemo), proof strip, 6-card features, 12-card bento showcase, MCP section, framework tabs, copy-paste CTA, footer
- [x] **H-W4: Component browser** — `/components` page with 38-entry registry, search + category filter, ComponentCard grid

#### Plan 3b: Component Docs Pages ✅ COMPLETE 2026-05-28
On branch `feat/docs-component-pages`, merged. 38 routes statically generated.
- [x] `/components/[slug]` dynamic page with `generateStaticParams()` for all 38 components
- [x] Sidebar layout grouped by 7 categories
- [x] Header with name + category + framework + isNew badges
- [x] Install command, usage code block (Shiki-highlighted), props table
- [x] 15 fully documented components in `examples/web/src/lib/component-docs.ts` (Button, Badge, Input, Dialog, Card, Alert, Tabs, Skeleton + all 7 MCP)
- [x] InstallCommand updated to accept optional `slug` prop
- [ ] Remaining 23 components have "coming soon" fallback — content TBD

#### Plan 3c: MCP React Components ✅ COMPLETE 2026-05-28
On branch `feat/mcp-react-components`, 9 commits. Build green. All 7 MCP components shipped + barrel export wired.
- [x] 7 components in `packages/react/src/mcp/` + CSS in `packages/css/components/mcp-*.css`
- [x] Uses `@mcp-elements/core` state machines (createToolState, parseScopes, schemaToFields, createAppBridge)

#### Plan 3d: MCP site pages + Playground + Themes ✅ COMPLETE 2026-05-28
On branch `feat/mcp-site-pages`, merged. All 3 routes static-rendered.
- [x] `/mcp` showcase page — hero, 4-step protocol flow (Connect/Authenticate/Execute/Render) linking to component docs, 7-MCP-component grid, quick start CodeBlock
- [x] `/playground` — 5 tabbed examples (Server Status, Tool Call, Tool Form, Scope Inspector, Consent Dialog) with copy button (Sandpack deferred — tabbed code playground works without it)
- [x] `/themes` — 4 OKLCH theme swatches (Dark, Midnight, Forest, Light) + CSS vars reference block

### Stage I: Launch
- [ ] **I1: Publish v0.1.0** packages to npm under new scope
- [ ] **I2: Launch blog post** — "the MCP UI library, multi-framework, copy-paste"
- [ ] **I3: Show HN** post
- [ ] **I4: Submit to MCP-UI org showcase** (`mcpui.dev`)
- [ ] **I5: Distribution** — Twitter thread, dev.to article, r/LocalLLaMA, r/LangChain, r/nextjs
- [ ] **I6: Reach out to MCP server authors** (Cursor, Cloudflare, GitHub) for cross-promo

### Stage J: Phase 2 (post-launch)
- [ ] Remaining 21 base components → Vue
- [ ] Svelte adapter (existing + MCP)
- [ ] Web components adapter via Lit
- [ ] Storybook + Chromatic visual regression
- [ ] Start Phase 3 design (agent primitives: plan tree, reasoning trace, cost meter, agent timeline, multi-agent dashboard)

---

## ❓ Open Questions

### Q1: BRAND NAME ✅ RESOLVED 2026-05-21
**Answer: `mcp-elements`**

Availability verified:
- npm scope `@mcp-elements/*`: ✅ free
- npm unscoped `mcp-elements`: ✅ free
- Domains: `.dev` ✅ `.ui` ✅ `.io` ✅ `.tools` ✅ `.app` ✅ — all free
- GitHub org `github.com/mcp-elements`: ✅ available (HTTP 404)

Rationale: Maximum MCP positioning clarity. Reads as "the multi-framework alternative to Vercel AI Elements, MCP-native." Brand explicitly sets up the comparison we want.

Other finalists: `handshake-ui` (metaphor brand, full availability), `pact-ui` (poetic, full availability). Discarded because `mcp-elements` won on positioning clarity.

Disqualified candidates: `mcpkit` (.dev/.io/.app taken + GitHub taken); `conduit-ui` (GitHub taken); `agentkit`, `proto-ui`, `bridge-ui`, `relay-ui`, `loom-ui`, etc. (unscoped npm taken).

### Q2: MCP Apps timing ✅ RESOLVED 2026-05-21
**Answer: Ship `McpAppFrame` in Phase 1 with `preview` tag, pinned to spec version `2026-01-26`.**

### Q3: Vue 2 vs Vue 3
**Default**: Vue 3 only at launch. Add Vue 2.7 compat in Phase 2 if requested.

### Q4: License & governance
**Default**: MIT, single-maintainer governance initially. Foundation alignment with MCP-UI org as a stretch goal post-launch.

### Q5: Timeline / team size ✅ RESOLVED 2026-05-21
**Answer: Solo builder, ~10-15 hrs/week.** Phase 1 calendar timebox: **8-10 weeks** (revised from 4-6). Phase 1+1.5 total: ~12 weeks calendar / ~150-200 builder-hours.

---

## 📚 Research Sources (kept for re-reference)

### Competitive landscape
- https://elements.ai-sdk.dev/
- https://github.com/vercel/ai-elements
- https://vercel.com/changelog/introducing-ai-elements
- https://vercel.com/changelog/ai-code-elements
- https://vercel.com/changelog/ai-voice-elements
- https://www.assistant-ui.com/
- https://www.assistant-ui.com/pricing
- https://github.com/assistant-ui/assistant-ui
- https://www.copilotkit.ai/
- https://github.com/CopilotKit/CopilotKit
- https://techcrunch.com/2026/05/05/copilotkit-raises-27m-to-help-devs-deploy-app-native-ai-agents/
- https://www.copilotkit.ai/ag-ui
- https://github.com/ag-ui-protocol/ag-ui
- https://www.shadcn.io/ai
- https://shadcn-chatbot-kit.vercel.app/
- https://github.com/Blazity/shadcn-chatbot-kit
- https://github.com/CedarCopilot/cedar-OS
- https://tambo.co/
- https://github.com/tambo-ai/tambo
- https://liveblocks.io/ai-copilots
- https://ui.llamaindex.ai/
- https://deepchat.dev/
- https://github.com/OvidijusParsiunas/deep-chat
- https://github.com/chatscope/chat-ui-kit-react

### Ecosystem signals
- https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/
- https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
- https://medium.com/mcp-server/the-rise-of-mcp-protocol-adoption-in-2026-and-emerging-monetization-models-cb03438e985c
- https://mcpui.dev/
- https://docs.ag-ui.com/introduction
- https://vercel.com/blog/ai-sdk-6
- https://medium.com/@akshaychame2/the-complete-guide-to-generative-ui-frameworks-in-2026-fde71c4fa8cc
- https://developers.googleblog.com/a2ui-v0-9-generative-ui/
- https://claudefa.st/blog/guide/agents/agent-view
- https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk
- https://www.youngju.dev/blog/ai-platform/2026-04-12-browser-computer-use-agents-practical-guide.en
- https://blog.cloudflare.com/browser-run-for-ai-agents/
- https://laminar.sh/article/2026-04-23-top-6-agent-observability-platforms
- https://evilmartians.com/chronicles/debug-ai-fast-agent-prism-open-source-library-visualize-agent-traces
- https://softcery.com/lab/choosing-the-right-voice-agent-platform-in-2026
- https://ui.elevenlabs.io/
- https://calmops.com/ai/graphrag-complete-guide-2026/

### Pain points
- https://dev.to/alexander_lukashov/i-evaluated-every-ai-chat-ui-library-in-2026-heres-what-i-found-and-what-i-built-4p10
- https://alexander-lukashov.medium.com/the-overview-of-ui-libraries-for-ai-chat-interfaces-in-2026-146a1492114a
- https://github.com/vercel/ai-elements/issues/66
- https://github.com/vercel/ai-elements/issues/285
- https://forum.langchain.com/t/unable-to-distinguish-between-reasoning-text-and-final-response-in-streaming-mode-with-tool-calls/2803
- https://www.abstractalgorithms.dev/langgraph-streaming-agent-responses
- https://www.katonic.ai/blog/agent-ui-problem
- https://github.com/danny-avila/LibreChat/discussions/10089
- https://www.maximepeabody.com/blog/mcp-missing-ui
- https://ai-sdk.dev/elements/components/inline-citation
- https://github.com/Mintplex-Labs/anything-llm/issues/2064
- https://callsphere.ai/blog/accessibility-ai-agent-interfaces-screen-readers-keyboard-inclusive-design
- https://github.com/streamlit/streamlit/issues/11891
- https://news.ycombinator.com/item?id=46953473

---

## 🔄 How To Resume This Work

If you (Claude or human) lost context, here's how to pick up:

1. **Read this file in full**, top to bottom
2. **Check** `docs/superpowers/specs/` for any spec file (created during Stage A3)
3. **Check** `~/.claude/projects/-Users-mayurrawte-thepsygeek-snx-ui/memory/MEMORY.md` for the `pivot-to-mcp-ui` project memory
4. **Run** `git log --oneline -20` to see what's been done since this WIP was written
5. **Find** the lowest-numbered unchecked task in [Pipeline](#️-pipeline--steps-to-execute) — that's where to start
6. **If [Q1 brand name](#q1-brand-name-blocks-stage-a3-and-stage-b) is still open**, ASK THE USER before doing anything else — it blocks everything downstream
7. **Update** this file as you complete tasks (check boxes, add notes, append "Decision log" entries below)

---

## 📝 Decision Log (append as decisions land)

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-21 | Pivot to MCP-native, multi-framework UI lib | Market research showed empty category + 97M/mo MCP adoption + no multi-framework AI primitives anywhere |
| 2026-05-21 | Retire `snuxt-ui` brand | Near-zero existing traction; cleaner positioning |
| 2026-05-21 | Frameworks at launch: React + Angular + Vue | Vue is largest underserved framework; Svelte/web-components Phase 2 |
| 2026-05-21 | Protocol-aware, runtime-free | Avoids CopilotKit-style coupling complaint |
| 2026-05-21 | 7 MCP primitives for Phase 1 MVP | Covers consumer-side of MCP from server picker → tool execution → app rendering |
| 2026-05-21 | Brand name: `mcp-elements` | Full availability on npm/domain/GitHub; reads as "multi-framework alternative to Vercel AI Elements, MCP-native"; positioning clarity prioritized |
| 2026-05-21 | Considered alternative: `herald` | Brand-name agent's top recommendation (also full availability, scales beyond MCP). Not chosen — `mcp-elements` won on launch-positioning clarity. Reference: `docs/research/brand-name-research.md` |
| 2026-05-21 | Capacity: solo builder, 10-15 hrs/week | Phase 1 calendar revised to 8-10 weeks (was 4-6); Phase 1+1.5 = ~12 weeks |
| 2026-05-21 | OQ1 resolved: ship McpAppFrame in Phase 1 with `preview` tag | Pinned to MCP Apps spec version `2026-01-26`; allows "full MCP UI kit" launch story |
| 2026-05-21 | Stage B (rename) complete on feat/rename-to-mcp-elements branch | All package names, CLI bin, CSS prefix, docs, README renamed. 11 commits. Build + assertion green. Branch ready to merge to main pending user review. Historical refs preserved in WIP.md/specs/research/. |
| 2026-05-21 | Stage B merged to main via fast-forward | 12 commits (rename + WIP). Branch deleted. .astro build cache untracked + gitignored separately. |
| 2026-05-21 | Plan 2 (MCP core utilities) drafted | 1351 lines, 9 TDD tasks. References protocol cheatsheet for type shapes. Execution pending. |
| 2026-05-28 | Stage D (MCP core utilities) complete | 6 modules + 46 tests on feat/mcp-core-utilities. Merged to main. |
| 2026-05-28 | Plan 3a (site foundation) complete | `examples/web/` Next.js 15 site: homepage (7 sections, animated hero), component browser (38 components, search+filter), shared site components (SiteNav, SiteFooter, CodeBlock, InstallCommand). Build green on `feat/web-site-foundation`. |
| 2026-05-28 | Plan 3c (MCP React components) complete | 7 MCP components: McpServerStatus, McpToolCall, McpToolForm, McpConsentDialog, McpScopeInspector, McpResourceBrowser, McpAppFrame. Each has CSS + React. All use `@mcp-elements/core` state machines. Barrel export wired. Build green on `feat/mcp-react-components`. |
| 2026-05-28 | 5 parallel streams executed via git worktrees | Stage E8 (React hooks), Stage C (Vue adapter), Stage F (Angular MCP), Plan 3b (docs pages), Plan 3d (MCP site pages) — all built and merged same day. Worktrees live in `.worktrees/` (gitignored). Strategy: dispatch independent agents in parallel, run spec+quality reviews in parallel with next implementer, fix issues before merge. |
| 2026-05-28 | Adopted worktree-parallel-development strategy | 5 streams × ~250kB diff merged cleanly via `git merge --no-ff` (one auto-generated `next-env.d.ts` needed to be untracked + gitignored). No human-blocking conflicts. All reviewers caught real issues (HTMLAttributes spread, useCallback stability, $any() in templates, missing class prop). Builds: 46 static pages, all 4 packages green. |
