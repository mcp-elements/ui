# Distribution drafts (I10) — refreshed 2026-08-26 for the SEP-1865 host wedge

X thread + per-subreddit variants. Post the thread the same day as the dev.to
"Render MCP Apps in your own host" post (blog-post-2-mcp-apps.md).
Adapt freely — these are starting points, not scripts.

---

## X/Twitter thread (7 tweets)

**1/**
MCP Apps (SEP-1865) is official — Claude, ChatGPT, Goose and VS Code all render interactive tool UIs now.

Building your own MCP host? You get to implement the host side yourself.

Or copy-paste it: mcp-elements. MIT, React + Angular + Vue.

https://mcp-elements.wearesnx.studio

**2/**
McpAppFrame is the host side of SEP-1865 in one component:

- sandboxed iframe + spec CSP injection
- ui/initialize handshake (JSON-RPC over postMessage)
- tool input/results streamed to the app
- app's tools/call proxied to YOUR MCP client
- auto-resize, teardown

Runtime-free. Bring your own client.

**2b/**
And the rest of the screens every host rebuilds:

- tool-call card (6 states + retry)
- JSON Schema → form
- OAuth consent dialog
- scope inspector
- resource browser
- server status badge

Chat UI kits ship none of these.

**3/**
Distribution is the shadcn model:

npx mcp-elements add mcp-tool-call

The CLI copies the source into your repo, rewrites imports to relative paths, links the CSS. No runtime dependency. You want to change the retry logic? Edit the file.

**4/**
Why it works in three frameworks: the state machines live in a plain-TypeScript core package, the styles are plain CSS with OKLCH tokens, and the React/Angular/Vue components are thin adapters over both.

Same machine, same stylesheet → same behavior, transition for transition.

**5/**
The unglamorous parts are done properly:

- dialog focus: enters on open, Escape closes, restores to trigger
- aria-live on connection status
- WCAG AA contrast in both themes
- tool calls that fail, cancel, and retry — not just the demo path

**6/**
Every demo on the docs site is the real component running on the page. No screenshots, no Figma exports.

Playground: https://mcp-elements.wearesnx.studio/playground

**7/**
v0.1, MIT, honest caveats in the repo. All 7 MCP components in all 3 frameworks; Vue base set still filling out.

Blog: <DEV.TO URL>
Discussing on HN today: <HN THREAD URL>

If you've built an MCP client — what's missing from the set?

---

## r/mcp (POST FIRST — this is the home crowd)

**Title:** McpAppFrame — a copy-paste SEP-1865 host renderer (render MCP Apps in your own host)

**Body:**

MCP Apps is official and the big hosts all render them — but if you're building your own host (inspector, agent console, internal chat tool), the host side of the spec is on you: sandboxed iframe, CSP from the resource metadata, the ui/initialize handshake, proxying tools/call back to your client, size-changed resizing, teardown.

I shipped that as a copy-paste component (shadcn model): `npx mcp-elements add mcp-app-frame` drops the source in your repo. It's runtime-free — you pass it `callTool`/`readResource` from whatever MCP client you already use (@modelcontextprotocol/sdk, mcp-use). The state machine is plain TypeScript in a core package if you'd rather wire it without React.

It ships with the other screens every host rebuilds: tool-call card with a real 6-state machine, OAuth consent dialog, scope inspector, JSON-Schema→form, resource browser, server status badge. React, Angular and Vue, MIT.

Live demo — a real app doing the JSON-RPC handshake inside the frame: https://mcp-elements.wearesnx.studio/components/mcp-app-frame
GitHub: https://github.com/mcp-elements/ui

Author here. If you've built a host: what screen did you have to hand-roll that isn't in this list?

---

## r/LocalLLaMA

**Title:** mcp-elements — copy-paste UI components for MCP clients (no cloud, no runtime dep, you own the code)

**Body:**

I kept rebuilding the same screens for MCP clients — tool-call cards, OAuth consent, scope inspectors — so I turned them into a copy-paste component set. 38 components, 7 of them MCP-specific, for React, Angular and Vue.

The part this sub might care about: there's no runtime dependency and no cloud anything. A CLI copies the component source into your repo (shadcn model), the state machines are plain TypeScript, and the styling is plain CSS tokens. MIT. If you're wiring a local model into MCP servers, the approval/consent UI is the piece nobody ships — that's the gap this fills.

Docs run every component live on the page: https://mcp-elements.wearesnx.studio
GitHub: https://github.com/mcp-elements/ui

Author here, happy to answer anything. v0.1 caveats are in the README.

---

## r/vuejs

**Title:** All the AI/MCP UI kits are React-only, so I shipped one with a Vue adapter

**Body:**

Vercel AI Elements, assistant-ui, Tambo — React only. The Svelte/Vue issues on those repos sit unanswered. Meanwhile "AI-focused React libraries are 3-4x larger than Vue's" keeps being true.

mcp-elements puts the state machines (tool-call lifecycle, consent flow, JSON-Schema-to-form) in a framework-free TypeScript core, with thin adapters on top — so the Vue components are real Vue 3 (defineComponent + h()), not a React port in a trenchcoat. All 7 MCP-specific components ship for Vue today, plus 4 composables (useMcpToolState etc.) and 10 of the base components, with the rest of the base set in progress.

Copy-paste distribution: npx mcp-elements add mcp-tool-call drops the source in your repo. MIT, no runtime dep.

Docs: https://mcp-elements.wearesnx.studio — author here, feedback welcome, especially on the composables API.

---

## r/Angular2

**Title:** MCP/AI UI components that actually ship for Angular (standalone components, not a wrapper)

**Body:**

Every AI component library is React-first; Angular gets a wrapper or nothing. mcp-elements ships real Angular standalone components — 38 of them, including the 7 MCP-specific ones (tool-call card, OAuth consent dialog, scope inspector, JSON-Schema-to-form, resource browser, server status, MCP-Apps frame).

The trick is the architecture: framework-free TypeScript state machines + plain CSS tokens, with the Angular components as thin adapters. Same behavior as the React and Vue versions because it's literally the same state machine.

Distribution is copy-paste via CLI (shadcn model) — source lands in your repo, no runtime dependency, MIT.

Docs with live demos: https://mcp-elements.wearesnx.studio — author here.

---

## r/nextjs / r/LangChain (check sidebar self-promo rules first)

**Title:** Copy-paste UI for the MCP parts of your app (tool calls, consent, scopes) — shadcn-style

**Body:**

If your app talks to MCP servers, the chat part is solved but the MCP surface isn't: tool-call cards with real state (idle/pending/running/done/error/cancelled), OAuth consent dialogs, scope inspectors, JSON-Schema-generated forms. mcp-elements is that set, distributed the shadcn way — npx mcp-elements add mcp-tool-call copies the source into your project.

React (works fine in Next.js — the docs site itself is Next 15), plus Angular and Vue from the same framework-free core. MIT, no runtime dep.

Live playground: https://mcp-elements.wearesnx.studio/playground — author here, v0.1, feedback wanted.

---

## Posting notes

- One subreddit per day; don't cross-post the identical text (mods and users notice).
- Always comment-reply as the author; disclose it's your project in the body (done above).
- Fill in <DEV.TO URL> and <HN THREAD URL> in tweet 7 before posting.
- r/nextjs and r/LangChain restrict self-promo some weeks — check the sidebar; if restricted, use their weekly showcase thread instead of a top-level post.
