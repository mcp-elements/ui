# WIP: Pivot to `mcp-elements` — MCP-Native, Multi-Framework AI UI Library

**Status**: 🚀 **LAUNCHED — v0.1.0 live on npm (2026-05-31)** and docs site live at **https://mcp-elements.wearesnx.studio**. Repo renamed to **https://github.com/mcp-elements/ui**. Post-launch shipped: MCP-first reposition + AI demos/docs + SEO/LLM discoverability (2026-05-31); **CLI registry — 7 MCP components now `add`-able (the headline feature works), README/site count alignment, and a live-site install-command fix — PR #12 merged + site redeployed (2026-06-18)**. **Launch-readiness pass (2026-06-24): all 38 component doc pages completed (was 22; 16 stubs filled with real props + live demos), 2 correctness bugs fixed (accordion core type, inaccurate input doc), and Stage G shipped — Vue now has all 7 MCP components + 4 composables AND CLI Vue support, so "multi-framework MCP-native" is true across React + Angular + Vue.** **Readiness + repositioning pass (2026-06-25): a DX audit found the copy-paste `add` flow was broken in default projects (bare-specifier imports + orphaned CSS) — both FIXED (relative imports, auto-linked CSS), plus css `"."` export + README accuracy. A competitive audit said the "multi-framework" pitch is the weak axis and the defensible wedge is the host-side MCP-domain primitive kit — so the brand/site/README were repositioned to lead with "the MCP-native UI kit". Added React/Angular/Vue usage tabs to the 7 MCP doc pages (+ fixed several pre-existing React doc inaccuracies), and `@mcp-elements/angular` now builds (tsup, exports, types). All packages build, web builds all 51 pages, 54 tests pass.** **Housekeeping + premium UI pass (2026-07-01): PR #13 merged to main; stripped the `Co-Authored-By: Claude` trailer from all commits (history rewritten + force-pushed); repointed all user-facing URLs to the live `mcp-elements.wearesnx.studio` (user does NOT own `mcp-elements.dev` — off the table); published **v0.1.1** (PR #13 fixes had never reached npm, so the site built against stale 0.1.0 and failed) and wired Vercel to the account. Then a full design pass shipped as **v0.1.2**: tightened radius scale + shared status tokens (success/warning/danger + brand pink→coral, dropped the violet AI cliché), layered elevation on surfaces + buttons, redesigned toast (status icons, Sonner/Linear style) + consent dialog (divider'd footer, hover-lift rows, amber WRITE badges), and FIXED a real modal-centering bug (portal-to-body + flexbox centering; was off-center under transformed ancestors) + the scroll-lock background shake. Replicated across React + Vue + Angular. All 6 packages published + site redeployed; 54 tests pass. See memory `design-system`.** **shadcn-restraint refinement (site-only, 2026-07-01): removed the gradient headline + all colored ambient orbs/glows, flattened CTAs/icon-chips to a single solid accent, neutralized the purple-tinted bg to match the (already-neutral) components, crisper hairline borders + tighter radii + higher-contrast text, dropped the glassy edge sheen + pink shadow-glow; only `examples/web` changed → NO npm republish — committed `025835a`, redeployed to prod (packages stay v0.1.2).** Remaining: launch posts (I7–I11). See Decision Log (2026-06-24 / 2026-06-25 entries) for full detail.
**Started**: 2026-05-21
**Last updated**: 2026-07-01

---

## 🚨 Quick Resume (read this first if context is lost)

We're pivoting `snuxt-ui` (generic UI lib with 31 components + 7 thin AI components, near-zero traction) into **`mcp-elements`** — an MCP-native, multi-framework AI UI library.

- **Brand**: `mcp-elements` (locked 2026-05-21)
- **Tagline**: "38 copy-paste components. Multi-framework. MCP-native." (revised 2026-05-29 — was "MCP UI for any framework", which read as MCP-only)
- **Positioning** (revised 2026-05-31 → MCP-first): site headlines the 7 MCP-native + 7 AI primitives as "Featured"; the 24 base UI components are "Extras — primitives to build on". 38 total. (README/npm still use the "31 base + 7 MCP" framing — align later.)
- **Accent palette**: hot pink → coral (not blue+violet — that's the AI-template cliché)
- **Logo**: periodic table element tile — atomic number 7 (the 7 MCP components), symbol "Mcp", "ELEMENTS" subtitle
- **npm**: `@mcp-elements/{core,react,angular,vue,css,cli}` — all free
- **Domain**: `mcp-elements.dev` (preferred, not yet wired); **live now at `mcp-elements.wearesnx.studio`** (Vercel)
- **GitHub**: org `github.com/mcp-elements`, repo **`mcp-elements/ui`** (renamed from `/mcp-elements` 2026-05-31, shadcn `brand/ui` convention) + `.github` repo for org profile
- Architecture: keep the existing 4-layer (CSS → core → adapters → CLI)
- Frameworks at launch: **React + Angular + Vue**

**Status**:
- ✅ Plan 1 (rename) — merged to main
- ✅ Plan 2 (MCP core utilities) — 6 modules + 46 tests, merged
- ✅ Plan 3a (site foundation) — `examples/web/` Next.js 15 site, merged
- ✅ Plan 3c (MCP React components) — 7 components, merged
- ✅ Plan 3b (component docs pages) — 38 routes, merged
- ✅ Plan 3d (MCP site + playground + themes) — 3 routes, merged
- ✅ Stage E8 (React MCP hooks) — 4 hooks, merged
- ✅ Stage C (Vue adapter) — 10 base components, merged
- ✅ Stage F (Angular MCP components) — 7 components, merged
- ✅ Visual + brand pass (2026-05-29) — see [Stage H+ section](#stage-h-design--brand-pass-2026-05-29) below
- ✅ **README + LICENSE (MIT)** — written 2026-05-31
- ✅ **CI/CD** — `.github/workflows/`: ci.yml (build+test blocking, lint non-blocking), release.yml (tag `v*` → `pnpm -r publish` w/ provenance). Actions on checkout@v5/setup-node@v5/Node 24.
- ✅ **Repo rename** `mcp-elements/mcp-elements` → `mcp-elements/ui`; CLI raw-content URLs + package.json repo fields repointed; org profile `.github` repo added.
- ✅ **Stage I (launch) — npm publish v0.1.0 (2026-05-31)** — all 6 packages live: `mcp-elements` (CLI) + `@mcp-elements/{core,react,vue,angular,css}`. Note: unscoped `mcp-elements` required a **Classic Automation token** (granular tokens 403/404 on new/unscoped packages); 5 scoped published via CI/local, CLI via interactive account.
- ✅ **Vercel deploy** — site live at `mcp-elements.wearesnx.studio` (project `mayurrawtes-projects/mcp-elements`, deploys `examples/web`; site deps pinned to published `^0.1.0` + `link-workspace-packages=true` for local dev).
- ✅ **Post-launch site work (2026-05-31)** — fixed MCP catalog 404; added live demos + docs for the 7 AI components (were blank); repositioned MCP-first (Featured = 7 MCP + 7 AI, Extras = 24 base, 38 total); added SEO/LLM surfaces: robots.ts, sitemap.ts, OpenGraph/Twitter, JSON-LD, `llms.txt` + `llms-full.txt`. Plan: `docs/superpowers/plans/2026-05-31-mcp-first-showcase-and-llm-seo.md`.
- ✅ **Stage G (Vue MCP components) — DONE 2026-06-24** (issue #4). All 7 MCP components + 4 composables in `packages/vue/src/mcp/` + `packages/vue/src/composables/`, defineComponent/`h()` convention, same `mcpe-*` CSS. CLI Vue support added (detect/init/add/resolve + 7 `vue` registry paths). Verified end-to-end via `add --local`.
- ✅ **PR #13 merged + author cleanup + v0.1.1 (2026-07-01)** — launch-readiness PR merged; `Co-Authored-By: Claude` trailer stripped from all commits (history force-pushed); user-facing URLs repointed to `mcp-elements.wearesnx.studio` (`.dev` not owned); v0.1.1 published (PR #13 fixes were never on npm).
- ✅ **Premium UI pass — v0.1.2 (2026-07-01)** — design system (radius/status tokens/elevation), toast + consent redesign, modal-centering + scroll-shake bugs fixed, React/Vue/Angular parity. All 6 pkgs published, site redeployed. Memory: `design-system`.
- ✅ **shadcn-restraint pass — site-only (2026-07-01)** — removed gradient headline + all colored ambient orbs/glows; flattened gradient CTAs/icon-chips to a single solid accent; neutralized the purple-tinted bg to match the (already-neutral) components; crisper hairline borders, tighter radii, higher-contrast text, dropped the glassy edge sheen + pink shadow-glow. Only `examples/web` touched → NO npm republish; committed `025835a` + redeployed to prod (live on `mcp-elements.wearesnx.studio`). Packages stay v0.1.2.
- ✅ **Prod-readiness verification + mobile fix (2026-07-01)** — clean-room install of the **published** CLI verified across React/Vue/Angular (transitive deps, core-util copy, CSS auto-link resolvable, `tsc` exit 0) + a React runtime smoke-render (tool-state machine cycles idle→running→done; consent dialog Allow→approved→closes). Live-site QA: 0 console errors, light mode + mobile OK. Fixed a mobile headline spacing bug (`kitfor`→`kit for`), committed `e0d144b`, redeployed + verified live.
- ✅ **A11y pass + fixes — v0.1.3 PUBLISHED, ⏳ site redeploy pending (2026-07-01)** — keyboard/ARIA/contrast audit. Strong baseline (semantic roles, `aria-live` on ServerStatus, `aria-modal`/`aria-labelledby` dialog, list/region roles; contrast all pass WCAG AA — the restraint pass raised them). **Fixed one real bug**: the shared **Dialog never moved focus into itself on open** → Escape didn't close (handler bound to the unfocused content el), focus trap inert, no focus restore. Now: focus the dialog container (`tabindex=-1`) on open, document-level keydown for Escape + Tab-trap, restore focus on close — across React (shared `Dialog`, used by consent), Vue (shared `McpeDialog` **+** inline consent — they'd diverged), Angular (shared + inline consent), + css `outline:none` on the focused container. Also gave **Switch** an accessible name (React `aria-label`/`aria-labelledby`; Vue `label`→`aria-label`; Angular `ariaLabel` input) + labeled the site demos. **React fix runtime-verified** on the locally-linked pkg (focus enters on open, Escape closes, focus restored, 0 unnamed buttons); **Vue/Angular = build + typecheck + code-parity only** (no runtime harness this pass). Committed `5ec133f`; **react/vue/angular/css PUBLISHED to npm @ 0.1.3** (2026-07-01; core/cli stay 0.1.2 — unchanged). ⏳ **Site redeploy still pending** — live site serves 0.1.2 until `examples/web` is bumped to `^0.1.3` + redeployed, so the dialog/switch fix is NOT yet live.
- ✅ **Pre-launch review + fix pass (2026-07-07)** — full UI/deploy/marketing review (live-site browse of all page types + all 38 component pages fetched: 0 "coming soon", 0 404s, 0 console errors, light/dark + mobile layout OK). **Found + fixed 5 real gaps**: (1) [high] **mobile nav hamburger was a dead button** (no handler — mobile users had NO header nav; new `MobileMenu.tsx` client component, verified open/navigate/close + Escape); (2) [high] **no `og:image`/`twitter:image`** despite `twitter:card=summary_large_image` — social/HN shares had no card; added `opengraph-image.tsx` + `twitter-image.tsx` (next/og, on-brand 1200×630, verified rendering); (3) hero demo first paint showed `fn unknown · idle` before the lifecycle kicked in — now passes `toolName`/`args` fallbacks to `McpToolCall`; (4) `favicon.ico` 404 (legacy fallback + crawlers) — added 32/48/256 PNG-in-ICO + `apple-icon.png` (rendered from `icon.svg` via canvas); (5) **npm pages were bare** — no license/description/keywords/homepage/repository on ANY published package (verified via `npm view`) — all six package.json now carry full metadata, **versions aligned to 0.1.4** (metadata-only; no code changes vs 0.1.3). README css count 31→38. Web deps bumped: react/css `^0.1.3`, core stays `^0.1.2` (no core 0.1.3 exists; all ranges auto-pick 0.1.4 once published). Build 9/9 + all tests green. Commits `083faf5`, `e2f6765`, `868e402`. **SHIPPED same day (user supplied fresh npm token + approved deploy): 5 scoped packages published @ 0.1.4, site deployed to prod + fully verified live** (favicon/og-image 200, mobile menu opens+navigates, hero first frame `search_files`, consent dialog: focus enters on open → Escape closes → focus restores to trigger). ⏳ **Only the unscoped `mcp-elements` CLI is NOT at 0.1.4** — the granular token 403s on it (scope tokens don't cover unscoped packages); publish from `packages/cli` with a token that includes the `mcp-elements` package. ⚠️ Rotate the token pasted in chat 2026-07-07 (in `~/.npmrc`).
- ⏳ Launch posts (blog, Show HN) — pending

- ✅ **CLI registry: 7 MCP components registered (2026-06-18)** — `npx mcp-elements add mcp-tool-call` now works. Added 7 `category:"mcp"` entries to `registry.json` (react/angular/css files + `core`/`coreDeps` wiring: tool-call→tool-state.ts, tool-form→schema-form.ts, consent/scope-inspector→scope.ts, app-frame→app-bridge.ts, all interactive ones +types.ts; consent-dialog internal deps→[dialog,button], resource-browser→[skeleton]). Extended `transform.ts` `SYMBOL_TO_FILE` with all MCP core exports + added a `../`→`./` collapse rule (MCP components live in a `mcp/` subdir but copy flat). **Also fixed a pre-existing bug**: `fetch.ts` used `__dirname` (undefined in ESM) + wrong depth → `--local` mode was fully broken; now derives dir from `import.meta.url`. Added `packages/cli/test/mcp-registry.test.ts` (8 tests, green). Verified end-to-end via `add --local`: transitive deps + dedup + import rewriting all correct. **Not yet committed.**

- ✅ **Docs alignment + install-command bug fix (2026-06-18)** — README reframed to the site's "24 base + 7 AI + 7 MCP = 38" grouping (was "31 base + 7 MCP"); added `npx mcp-elements add mcp-*` examples to Quick Start, the MCP-Native section, and the CLI Reference (advertising the now-installable headline feature). **Fixed a shipped bug**: the live docs site (`InstallCommand.tsx`, `FeatureCards.tsx`) told users to run `npx @mcp-elements/cli add …`, but the published CLI is the unscoped `mcp-elements` — so every install command on the site was broken. Now `npx mcp-elements add …`. Web typechecks clean.

- ✅ **PR #12 merged + site redeployed (2026-06-18)** — `feat/cli-register-mcp-components` merged to main (merge commit `a545d6c`, branch deleted). Site redeployed to production via `vercel --prod` from `examples/web`; verified live on `mcp-elements.wearesnx.studio` + `mcp-elements.vercel.app` (corrected install command present, zero stale `@mcp-elements/cli`). ⚠️ **Vercel has NO Git auto-deploy** — merging to main does not update the live site; deploys are manual `vercel --prod --yes` from `examples/web`. See memory `vercel-deploy-manual`.

**Next concrete step** (resume here): **launch posts (I7–I11)** — the product is now genuinely launch-ready AND visually premium (v0.1.2 design pass done + live). Copy-paste flow works, 38/38 docs, all 3 frameworks + all packages build, MCP-first positioning. Strategic note from the 2026-06-25 competitive audit: **ship + claim the "MCP-native UI kit" niche fast** — it's real but time-limited (incumbents are adding MCP UI). Stage G (Vue MCP) DONE; readiness/DX + design blockers FIXED.
**Deploy note (2026-07-01):** current live **site** = **v0.1.2** (a11y fixes **published to npm @ v0.1.3** but site not yet redeployed — see the RESUME follow-up below). To ship UI changes: bump all pkg versions, `pnpm -r --filter ./packages/* build`, `pnpm --filter <pkg> publish --access public --no-git-checks` (npm token authed as `rawtemayur`; unscoped CLI needs an Automation token), bump `examples/web` deps + lockfile, then `npx vercel@latest --prod --force --yes` from `examples/web` (`--force` avoids stale node_modules cache). Vercel still has NO git auto-deploy (GitHub App not installed on the org). See memories `vercel-deploy-pipeline` + `design-system`. ⚠️ Rotate the npm token pasted in chat (`npm_0QK…`) — still in `~/.npmrc`.

**Open (non-blocking) follow-ups, by priority:**
- ⏳ **RESUME HERE — launch posts (I7–I11)**. Everything else shipped + verified live 2026-07-07 (see the pre-launch review entry above). Two loose ends: (1) publish the unscoped `mcp-elements` CLI @ 0.1.4 from `packages/cli` (needs a token that includes the unscoped package — current granular token 403s on it; low urgency, CLI works fine at 0.1.2 since `add` fetches source from GitHub main); (2) rotate the npm token pasted in chat 2026-07-07. **Also worth**: runtime-verify the Vue/Angular dialog fix (only React was runtime-tested; Vue/Angular are build+parity only) via clean-room harnesses.
- **No Vue test harness / example app** — Vue (components + CLI) verified via tsup `dts` build + manual CLI e2e only; add a smoke test / example app.
- **`@mcp-elements/angular` build is JIT-style (tsup)** — esbuild doesn't run Angular AOT; adopt ng-packagr if an AOT-grade published artifact is needed (caveat documented in its tsup.config.ts).
- Deferred config (user said "leave for now" 2026-06-18): Biome `indentStyle` tab→space (lint perpetually red), registry drift-guard test, CI build of `examples/web`.
- Minor: consent-dialog/resource-browser carry React-composition `internal` deps (`dialog`/`button`/`skeleton`) that Vue+Angular inline → benign "Skipped: no vue adapter" on `add` (same as Angular's existing behavior).

Open issues + roadmap board: https://github.com/orgs/mcp-elements/projects/1 (issues #1–#10).
3. **Deploy site to Vercel** (`vercel link` + `vercel deploy --prod`) — points the public URL somewhere before launch.
4. **npm publish v0.1.0** (`pnpm -r publish --access public`) — **one-way door**, double-check `package.json` versions first.
5. Launch posts (I5–I9).

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

### Stage G: MCP components × Vue (after C + D) ✅ COMPLETE 2026-06-24
All 7 MCP components built as Vue 3 `defineComponent`s + render functions (`packages/vue/src/mcp/`), matching the repo convention (no `.vue` SFCs). Same `mcpe-*` CSS classes as React/Angular; consume the framework-free `@mcp-elements/core` utilities. Missing base components (Skeleton, Dialog sub-components) inlined as Angular does.
- [x] McpeMcpServerStatus, McpeMcpToolCall, McpeMcpToolForm, McpeMcpConsentDialog, McpeMcpScopeInspector, McpeMcpResourceBrowser, McpeMcpAppFrame
- [x] 4 composables (`packages/vue/src/composables/`): useMcpToolState, useMcpOAuth, useMcpAppBridge, useMcpSchemaForm. Reactivity bridge = core `subscribe()` → Vue `ref` + `onUnmounted` (ported from Angular's effect/cleanup shape)
- [x] Barrel export wired (`packages/vue/src/index.ts`)
- [x] **CLI Vue support**: `detect.ts` (detect `vue`), `init.ts` (Vue choice + correct path defaults), `add.ts` + `resolve.ts` (3-framework type), and `vue` paths on the 7 `mcp-*` registry entries. Verified end-to-end with `add --local`: files emit, core utils copied, `@mcp-elements/core` imports rewritten to local utils, `vue` imports untouched
- [x] Vue package builds with full `.d.ts`; full workspace build + 54 tests green

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
- [x] **All 38 component doc pages completed (2026-06-24)** — the remaining 16 stubs (accordion, avatar, chips, counter, drawer, dropdown-menu, loader, password-input, popover, progress, select, separator, switch, textarea, toast, tooltip) now have real props tables (extracted from React source) + live demos in `examples/web/src/components/demos/registry.tsx`. 38/38 documented, 38/38 with demos. Build generates all 51 pages.

#### Plan 3c: MCP React Components ✅ COMPLETE 2026-05-28
On branch `feat/mcp-react-components`, 9 commits. Build green. All 7 MCP components shipped + barrel export wired.
- [x] 7 components in `packages/react/src/mcp/` + CSS in `packages/css/components/mcp-*.css`
- [x] Uses `@mcp-elements/core` state machines (createToolState, parseScopes, schemaToFields, createAppBridge)

#### Plan 3d: MCP site pages + Playground + Themes ✅ COMPLETE 2026-05-28
On branch `feat/mcp-site-pages`, merged. All 3 routes static-rendered.
- [x] `/mcp` showcase page — hero, 4-step protocol flow (Connect/Authenticate/Execute/Render) linking to component docs, 7-MCP-component grid, quick start CodeBlock
- [x] `/playground` — 5 tabbed examples (Server Status, Tool Call, Tool Form, Scope Inspector, Consent Dialog) with copy button (Sandpack deferred — tabbed code playground works without it)
- [x] `/themes` — 4 OKLCH theme swatches (Dark, Midnight, Forest, Light) + CSS vars reference block

### Stage H+: Design + brand pass (2026-05-29) ✅ COMPLETE
Iterative visual transformation after Plan 3a-d shipped. User feedback drove each round:

**Round 1 — components weren't rendering at all**
- `@mcp-elements/css` package was workspaced but never imported into `examples/web` → fixed in `globals.css`
- ThemeToggle was *removing* `data-theme` for dark mode, which desynced `--site-*` (default dark) and `--color-*` (default light) tokens — components rendered with light-mode colors against a dark site. Fixed to always set the attribute explicitly.
- `next-env.d.ts` had been committed to git from a subagent's build → moved to .gitignore.
- Live demo registry (`src/components/demos/registry.tsx`) — 16 demos rendering the real components for /components/[slug] and /playground.
- Bug: `slug in DEMOS` check on server component silently failed because Next.js doesn't pass non-component values from `'use client'` modules. Moved the guard inside `<ComponentPreview>`.

**Round 2 — "still looks like a basic POC"**
- LiveHeroDemo (was fake framer-motion animation) replaced with real `McpToolCall + McpServerStatus` driven by `createToolState()` state machine cycling idle→running→done.
- FlagshipScene — fake browser-chromed "MCP Studio" workspace with 3-pane layout (resources / chat / scopes), continuous 4-step loop. Drops the cliché traffic-light dots; replaces with gradient "M" app icon + monospace "studio" label + glass-blurred address bar.
- BeforeAfterSection — 47 lines of boilerplate vs 6 lines with the component. Critical fix: code blocks were raw monochrome grey text — added server-rendered Shiki TSX highlighting on both sides.
- Component visibility fixes (CSS package):
  - `Switch`: thumb was `bg-background` = invisible against dark site bg. Now: white thumb in light + unchecked-dark; dark thumb on accent track.
  - `Skeleton`: `bg-primary/10` was nearly invisible in light mode. Now: muted-foreground at 18%/28% opacity per theme.
  - `Input/Textarea/Select`: were `bg-transparent` → invisible. Now have explicit `--color-background` fill.
  - `mcpe-select` class was used in HTML but only `.mcpe-select-trigger` was defined → added base styles with custom dropdown arrow.

**Round 3 — "borders look old / website looks old"**
- Replaced hard 1px solid borders with translucent (`oklch 1 / 0.07`) — read as light edges not rules.
- Added `--site-edge-highlight` gradient — every card has a `::before` top-edge sheen, like real light catching the surface.
- Bigger radii everywhere: cards 18px, panels 24px, big frames 32px (was 12-16px).
- New shadow scale: warmer, directional, with larger diffuse drops at md/lg (`shadow-lg` = `0 24px 48px`).
- New `.site-frame` utility — gradient-bordered glass panel (CSS mask technique), used by FlagshipScene.
- Replaced harsh section dividers with faded gradient hairlines (transparent → border → transparent).
- New `.site-btn-accent` — gradient pill with glow shadow + inset highlight.
- Tinted dark background (oklch 0.10 280) instead of pure near-black — adds depth.

**Round 4 — "blue color is AI slop color / or violet"**
- Swapped `--site-accent` from oklch(0.68 0.19 265) blue → oklch(0.71 0.22 5) hot pink.
- Swapped `--site-accent-2` from oklch(0.74 0.18 295) violet → oklch(0.76 0.18 35) coral.
- Hardcoded oklch(0.74 0.18 280) in HeroSection MCP gradient → uses var(--site-accent-2).
- Ambient orbs in section backgrounds: pink + coral instead of violet.
- All glow shadows, focus rings, accents: pink/coral.
- Light mode mirror: pink ~0.58 lightness, coral ~0.65 lightness.

**Round 5 — bento ComponentShowcase**
- Replaced uniform 3×3 grid of tiny components in huge empty cells with a real bento layout:
  - McpToolCall: hero tile (2 cols × 2 rows, animated)
  - McpServerStatus: tall tile (1 col × 2 rows, shows all 4 states)
  - Card, Input: span 2 cols (need width to read)
  - Other tiles 1×1
- Explicit `auto-rows-[160px]` keeps the rhythm.
- Pink + coral radial orbs in section background.

**Round 6 — logo**
- Periodic table tile design: atomic number 7 (the 7 MCP components — a nod), "Mcp" as the chemical symbol bold center, "ELEMENTS" mono caps below. Pink/coral border.
- `Logo.tsx` component (outline + filled variants), `Wordmark.tsx` (mark + text inline).
- Wired into SiteNav, SiteFooter, favicon (`/icon.svg`).

**Round 7 — "is this only MCP components?"**
- Site was over-pivoted on MCP. Repositioned to lead with the full library:
  - Headline: "38 copy-paste components. Multi-framework. MCP-native." (was "The UI layer for MCP.")
  - Subhead spells out the 3 groups: 31 base + 7 AI + 7 MCP.
  - New `CategoriesSection.tsx` right after the hero — 7 tiles showing each category with icon, count, blurb, and the first 4 component names. MCP tile gets the accent treatment.
  - `/components` page rebuilt — when "All" is selected, components are grouped into 7 sections (each with its icon + count + blurb + "Filter to X →" link); when filtered, flat grid. URL filtering via `?category=X` works on initial load and is shareable.
  - SiteFooter tagline + layout.tsx metadata updated to match.

### Stage I: Launch
- [x] **I1: Create `mcp-elements/mcp-elements` repo on GitHub** ✅ 2026-05-29 — https://github.com/mcp-elements/mcp-elements (public, 12 topics)
- [x] **I2: Update git remote** to `mcp-elements/mcp-elements`, push ✅ 2026-05-29 — 95 commits pushed, branch tracks origin
- [x] **I3: Write `README.md`** ✅ 2026-05-31 (repositioned to lead with the MCP kit 2026-06-25). Install/usage, per-framework MCP examples, quick start.
- [x] **I4: Confirm `LICENSE`** ✅ MIT.
- [x] **I5: Deploy site** ✅ live at `mcp-elements.wearesnx.studio` (Vercel; `mcp-elements.dev` DNS not yet wired). ⚠️ NO git auto-deploy — redeploy manually with `vercel --prod --yes` from `examples/web`; **the 2026-06-25 repositioning + doc changes are not yet redeployed.**
- [x] **I6: Publish v0.1.0** ✅ 2026-05-31 — all 6 packages live on npm.
- [ ] **I7: Launch blog post** — lead with the wedge: "The MCP-native UI kit — the only copy-paste, framework-agnostic MCP primitives (consent, scopes, tool-calls, tool-forms, MCP-Apps frame) for React, Angular & Vue."
- [ ] **I8: Show HN** post
- [ ] **I9: Submit to MCP-UI org showcase** (`mcpui.dev`)
- [ ] **I10: Distribution** — Twitter thread, dev.to article, r/LocalLLaMA, r/LangChain, r/nextjs
- [ ] **I11: Reach out to MCP server authors** (Cursor, Cloudflare, GitHub) for cross-promo

### Stage J: Phase 2 (post-launch)
- [x] ~~MCP components → Vue~~ — pulled forward, done 2026-06-24 (Stage G)
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
| 2026-05-29 | Visual + brand pass complete (7 rounds) | Iterative visual fix driven by user feedback. (1) wired @mcp-elements/css into web app, fixed theme-toggle desync, added live demos. (2) shipped FlagshipScene + BeforeAfter with Shiki + bigger hero. (3) replaced hard 1px borders with edge-highlight gradients, bigger radii, glass. (4) swapped blue+violet ('AI slop color') → hot pink + coral. (5) ComponentShowcase rebuilt as bento grid with McpToolCall as 2×2 hero tile. (6) Logo = periodic table tile (atomic #7 = the 7 MCP components). (7) Repositioned: 'The UI layer for MCP' → '38 copy-paste components. Multi-framework. MCP-native.' MCP is the differentiator, not the whole product. |
| 2026-05-29 | GitHub org `mcp-elements` created | Repo `mcp-elements/mcp-elements` still pending. Current `origin` points to old `snxstudio/snuxt-ui` — needs update during Stage I. |
| 2026-05-29 | Positioning: lead with components, MCP as differentiator | User asked 'is this only MCP components?' Site had over-pivoted. Now: hero claims '38 components', new CategoriesSection right after hero shows all 7 buckets (Form/Display/Overlay/Navigation/Feedback/AI/MCP) with counts + preview names. MCP gets the accent treatment but doesn't dominate. /components page rebuilt to group by category in default view, URL filtering (`?category=MCP`) works for shareable links. |
| 2026-06-18 | CLI registry: 7 MCP components registered + installable | Headline feature `npx mcp-elements add mcp-<x>` now works. registry.json got 7 `category:mcp` entries with per-framework files + core/coreDeps/internal dep wiring. transform.ts gained MCP core symbol map + `../`→`./` collapse (mcp components live in a subdir, copy flat). Fixed pre-existing `--local` bug (`__dirname` undefined in ESM + wrong path depth). 8 new CLI tests green. Verified end-to-end with `add --local` against a temp project: transitive deps (consent-dialog→dialog→use-dialog+dom, +button), dedup (types.ts copied once), and import rewriting all correct. Uncommitted. |
| 2026-05-29 | Accent palette locked: hot pink → coral | Blue+violet is the AI startup template cliché (OpenAI, Claude UI, every ChatGPT clone). Picked hot pink (`oklch(0.71 0.22 5)`) + coral (`oklch(0.76 0.18 35)`) — Linear/Vercel-magenta energy, distinctly not AI-template. Used on logo border, hero gradient text, primary CTA, FlagshipScene assistant avatar, all glow shadows + focus rings. |
| 2026-06-24 | All 38 component doc pages completed | Closed the doc gap (22→38). 16 stubs filled with real props (read from React source, not invented) + live demos. Surfaced + fixed 2 bugs: accordion core `getTriggerProps` typed `onKeyDown` with DOM `KeyboardEvent` (clashed with React handler types, never exercised) → relaxed to structural `{ key; preventDefault }` so it spreads with no cast cross-framework; and the `input` doc advertised `label`/`error`/`helperText` props that `Input` (bare `<input>`) never had → corrected. Web typechecks + builds all 51 pages. |
| 2026-06-25 | Fixed copy-paste DX blockers (readiness audit) | A real-world install audit found the headline `npx mcp-elements add` flow **broken end-to-end in a default project**: (1) [critical] copied components imported a bare `src/lib/utils/cn` specifier (transform used `config.aliases.utils` verbatim) which doesn't resolve without a tsconfig `baseUrl`/`paths` alias that `init` never wrote → `TS2307 Cannot find module`. Fixed `transform.ts` to emit a RELATIVE path between the components dir and utils dir (`../../lib/utils/cn`), resolving with zero project config (and matching what the README always claimed); tightened the `../`→`./` sibling-collapse regex with a negative lookahead so it no longer clobbers the deeper util imports. (2) [high] copied component CSS was orphaned (nothing imported it → unstyled) → `add.ts` now appends `@import './components/x.css'` to the global stylesheet. (3) css package had no `"."` export → added. (4) README documented the wrong transform output + stale "Vue MCP in progress" → corrected. Verified e2e: realistic Vite-React + Vue scaffolds, `add` then `tsc` → exit 0; 8/8 CLI tests pass (4 updated to assert the corrected relative output). NOT fixed (logged): `@mcp-elements/angular` ships raw TS (no build/`.d.ts`/exports); `workspace:*` is an npm-publish footgun (fine via `pnpm publish`). |
| 2026-06-25 | Repositioned to "the MCP-native UI kit" + per-framework docs + Angular build | Acted on the competitive verdict and finished the multi-framework story. (1) **Repositioning**: hero headline → "The MCP-native UI kit for any framework", subhead/badge/CTAs lead with the MCP primitives; updated layout metadata, OG/Twitter, JSON-LD, llms.txt, footer, README headline + About. Multi-framework + 38-components kept as supporting cast. (2) **Per-framework usage docs**: `ComponentDoc.usage` now `string | Partial<Record<framework,string>>`; the 7 MCP doc pages got React/Angular/Vue tabs (new `UsageTabs` client component toggling server-rendered Shiki blocks — Shiki supports `vue`). Source-grounded Angular (`McpeMcp*Component`, `mcpe-mcp-*` selectors, `on*` outputs) + Vue (`McpeMcp*`, `@event` emits) snippets. (3) **Fixed pre-existing React doc inaccuracies surfaced while doing this**: tool-call `state.start('search', {...})` → real `start({ tool, args })`; scope-inspector props were fictional (`{id,label,risk}`/`defaultExpanded`) → real `scopes: string|ScopeDescriptor[]` + `descriptions`; app-frame listed a non-existent required `title` + wrong `onMessage` type → real props (`AppMessageEnvelope`, `sandbox`, no title); tool-form `JSONSchema7`→`JsonSchema`. Also fixed the homepage `FrameworkSection` which had wrong Angular/Vue names (`McpToolCallComponent`/`mcp-tool-call`/`(retry)` → `McpeMcpToolCallComponent`/`mcpe-mcp-tool-call`/`(onRetry)`). (4) **`@mcp-elements/angular` now builds**: tsup ESM+DTS, real exports map, peerDeps (+forms), fixed a latent missing `output()` import in accordion, `@swc/core` for decorator metadata (JIT caveat documented; ng-packagr deferred — not installed). Verified: all packages build, web typechecks + builds all 51 pages (incl. Vue-highlighted tabs), 54 tests pass. |
| 2026-06-25 | Competitive verdict: narrow to "the MCP-native UI kit" | Honest 2026 landscape audit: the broad "38 components, multi-framework" pitch is the WEAK axis — AI/base components are a crowded React-dominated market (AI Elements ~2k, assistant-ui ~11k, CopilotKit ~35k) and CopilotKit already ships multi-framework + MCP. The ONE defensible wedge: no one ships a cohesive, framework-agnostic, host-side **MCP-domain** primitive kit (consent, scopes, tool-call cards, JSON-Schema tool-forms, server status, MCP-Apps renderer) — that sub-category is genuinely underserved mid-2026 and aligned with the now-standardized MCP Apps spec (SEP-1865). Best buyer: someone building an MCP host/inspector/admin/gateway UI, esp. off-React or wanting runtime-free code-ownership. Recommendation: lead the brand/site/README with "the MCP-native UI kit," keep AI/base as supporting cast. Wedge is real but time-limited (incumbents are adding MCP UI) — ship + claim it fast. |
| 2026-06-24 | Stage G done — Vue reaches MCP parity (issue #4) | 7 Vue MCP components + 4 composables, defineComponent/`h()` convention, same `mcpe-*` CSS, consuming the framework-free core. Inlined Skeleton + Dialog sub-components (Angular's approach) to avoid porting more base components. Net-new reactivity bridge: core `subscribe()` → Vue `ref` + `onUnmounted`. Chose **library + full CLI** scope: detect/init/add/resolve + 7 `vue` registry paths, so `npx mcp-elements add mcp-*` emits Vue files (verified e2e). Vue MCP components are self-contained (bridge inlined, no composable import) so CLI copy-paste stays clean; composables are npm-only exports. "Multi-framework. MCP-native." now true across React + Angular + Vue. Risks logged: no Vue test/example app. |
| 2026-07-01 | shadcn-restraint design pass (site-only) | After the v0.1.2 premium pass, an honest "is this shadcn-premium?" review found the marketing chrome was louder than the components it sold: gradient headline text, pink/coral ambient orbs + glow shadows, a purple-tinted bg, and low-contrast text — the "vibrant AI SaaS" tells shadcn deliberately avoids. Restraint pass: removed the gradient headline (→ solid accent word), removed ALL colored orbs/glows, flattened gradient CTAs + icon-chips to a single solid accent, neutralized the bg to match the components' own neutral surface, raised text contrast, crisper hairline borders, tighter radii, killed the glassy edge sheen + pink shadow-glow. Kept hot-pink as the single sparing accent (headline word + CTA + tiny badges). ALL changes in `examples/web` (preview site) — published packages untouched → NO npm republish, still v0.1.2. Committed `025835a`, redeployed to prod (live on `mcp-elements.wearesnx.studio`). Build green (51/51 pages). Guardrail for future passes: do NOT re-add gradient text / ambient orbs / glow shadows — the site now leads with restraint. |
| 2026-07-01 | Prod-readiness verification (clean-room + runtime) | Stress-tested "is it prod ready" beyond build/deploy. Clean-room installs of the **published** CLI in fresh React/Vue/Angular projects: transitive dep resolution, core-util copy, CSS auto-link (paths resolvable), `tsc --noEmit` exit 0 in all three. React **runtime** smoke-render (Vite) confirmed components mount + run: tool-state machine cycles idle→running→done, consent dialog Allow→approved→closes, 0 component runtime errors. Live-site QA post-restraint: 0 console errors across pages, light mode renders, no mobile page-overflow. Found + fixed a mobile headline spacing bug (`kitfor`, commit `e0d144b`, redeployed). Untested edges logged: Vue/Angular runtime render, cross-browser (Chromium only). |
| 2026-07-01 | A11y audit + dialog/switch fixes (v0.1.3 published, site redeploy pending) | Keyboard/ARIA/contrast pass. Strong baseline: semantic roles throughout, `aria-live=polite` on ServerStatus (addresses the WIP-flagged "streaming aria-live" gap), `aria-modal`+`aria-labelledby`+`aria-describedby` on dialog, `aria-expanded`/`aria-controls` scope inspector; WCAG contrast all pass AA (main 19:1, muted 9.4, subtle 5.1, accent 6.6 — restraint pass raised these); landmarks/heading-order/lang all clean. **Real bug fixed**: the shared Dialog never moved focus into itself on open → Escape didn't close (keydown handler bound to the never-focused content el), focus trap inert, no focus restore. Fixed across React (shared `Dialog`, used by consent), Vue (shared `McpeDialog` **and** inline `McpeMcpConsentDialog` — implementations had diverged: Vue Escape was on `document`, React/Angular on the content el), Angular (shared + inline consent, which had NO Escape at all): on open save `activeElement` + focus the content container (`tabindex=-1`); document-level keydown → Escape closes + Tab runs `trapFocus`; on close restore focus; css `.mcpe-dialog-content:focus { outline:none }`. **Switch** couldn't be given an accessible name (a wrapping `<label>` doesn't name a `<button>`): added `aria-label`/`aria-labelledby` (React), wired existing `label`→`aria-label` (Vue), `ariaLabel` input (Angular); labeled the 3 site demos. React fix **runtime-verified** on the locally-linked package; Vue/Angular build + typecheck + code-parity only. Committed `5ec133f`; react/vue/angular/css → 0.1.3 (core/cli unchanged at 0.1.2, since core API used already existed → avoids republishing the token-painful unscoped CLI). **Published to npm @ 0.1.3 (2026-07-01)**; site redeploy pending to make it live. |
