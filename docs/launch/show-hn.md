# Show HN draft (I8) — refreshed 2026-08-26 for the SEP-1865 host wedge

HN text posts are plain text — no markdown, no code blocks. Paragraph breaks only.
Title is 64 chars (limit 80).

⛔ Still gated? Unblock first: email hn@ycombinator.com (real project, link the dev.to
post + repo) and build light comment karma daily. Post Tue–Thu 8–10am ET.

---

## Title

Show HN: UI primitives for building MCP hosts (SEP-1865 renderer)

## URL

https://mcp-elements.wearesnx.studio

## Text

Since January, MCP Apps (SEP-1865) is an official MCP extension — tools can return interactive UIs, and Claude, ChatGPT, Goose and VS Code all render them. But if you're building your own host — an inspector, an agent console, an internal chat tool — you have to implement the host side yourself: the sandboxed iframe, the CSP rules from the resource metadata, the ui/initialize handshake, proxying tools/call from the app back to your MCP client.

mcp-elements ships that as a component you copy into your project. McpAppFrame takes the raw HTML of a ui:// resource, injects the spec-mandated CSP, answers ui/initialize over JSON-RPC/postMessage, streams tool input and results to the app, auto-resizes on size-changed notifications, and proxies the app's tool calls to whatever MCP client you already use. Runtime-free — bring @modelcontextprotocol/sdk or mcp-use.

Around it are the other screens every MCP host rebuilds: a tool-call card with a real state machine (idle/pending/running/done/error/cancelled, with retry), JSON-Schema-to-form with validation, an OAuth consent dialog, a scope inspector, a resource browser, and a server-status badge. Plus 31 base and AI components (chat bubble, streaming text, prompt input) to build the rest of the surface.

Distribution is the shadcn model: npx mcp-elements add mcp-app-frame copies the source into your repo and rewrites imports to relative paths. No runtime dependency, MIT, you own the code. The state machines are plain TypeScript in a core package with thin React, Angular and Vue adapters on top — protocol work lands React-first, and all seven MCP components ship for all three frameworks today.

Details I spent real time on: dialog focus management (focus moves in on open, Escape closes, focus restores to the trigger), aria-live announcements on connection status, WCAG AA contrast in both themes, and the app-frame handshake queueing notifications until the app says it's initialized, as the spec requires.

The docs site runs every component live on the page, including a real MCP App doing the JSON-RPC handshake inside the frame: https://mcp-elements.wearesnx.studio/components/mcp-app-frame

If you've built an MCP host, I'd like to know what's missing from the set.
