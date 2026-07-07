# Launch blog post draft (I7)

Target: dev.to / hashnode (markdown). Also works as the source for the I10 article.
Voice check: first person, concrete, no filler. Read it out loud before posting;
cut anything you wouldn't say to a colleague.

---

# Every MCP client rebuilds the same seven screens

MCP went from 2M to 97M monthly SDK downloads in a year. There are over 9,400 servers in the registry. A lot of people are suddenly building MCP clients — and if you've built one, you already know where this is going, because you've built these screens:

- A card that shows a tool call: name, arguments, a spinner, then a result or an error with a retry button.
- A consent dialog that lists OAuth scopes in language a human can approve.
- A form generated from a tool's JSON Schema, with validation.
- A scope inspector for "what exactly can this server touch?"
- A resource browser for whatever the server exposes.
- A connection status badge.
- And if you're on the MCP Apps spec: a sandboxed iframe with a postMessage bridge.

None of these are hard the first time you describe them. All of them are annoying the third time you build them. The tool-call card alone is a state machine with six states (idle, pending, running, done, error, cancelled), retry logic, theme tokens, and accessibility work — call it a week if you do it properly, which is exactly why most clients don't.

The chat side of this stack is well served. Vercel's AI Elements, assistant-ui, CopilotKit — good projects. But they're React-only (CopilotKit also does Angular), and none of them ship the MCP-specific pieces. The one multi-framework option, Deep Chat, is a single monolithic widget, not primitives you can compose. When I went looking for a consent dialog I could copy into an Angular app, there wasn't one. So I built the set.

## What mcp-elements is

38 components you copy into your project with a CLI:

```bash
npx mcp-elements add mcp-tool-call
```

That drops the component source, its CSS, and the core state machine it uses into your repo, with imports rewritten to relative paths. There is no runtime dependency to upgrade or get broken by. If you want to change how the retry button works, you edit the file. It's the shadcn model, applied to MCP.

Seven components are MCP-specific — the list above. The other 31 are the base and AI pieces you need around them: chat bubble, streaming text, prompt input, source card, buttons, dialogs, the usual.

Here's a full MCP flow in three components:

```tsx
import { McpServerStatus, McpToolCall, McpConsentDialog } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

// 1. Connection state
<McpServerStatus status="connected" serverName="github-mcp" />

// 2. OAuth consent
<McpConsentDialog
  open={showConsent}
  serverName="GitHub MCP"
  scopes={['repo:read', 'user.email:read']}
  onApprove={handleApprove}
  onDeny={handleDeny}
/>

// 3. Tool execution
const toolState = createToolState()
toolState.start({ tool: 'search_repos', args: { query: 'mcp-elements' } })

<McpToolCall state={toolState} onRetry={() => toolState.reset()} />
```

## Why it works in React, Angular, and Vue

The architecture is three layers, and the layering is the whole trick:

1. **CSS** — plain stylesheets with OKLCH design tokens. No CSS-in-JS, no build coupling. Override the tokens, get a theme.
2. **Core** — plain TypeScript state machines: tool lifecycle, consent flow, JSON-Schema-to-form. No framework imports anywhere in the package.
3. **Adapters** — thin React, Angular, and Vue components that subscribe to the core machines and apply the CSS classes.

Because the state machine and the stylesheet are shared, the React and Angular versions of `McpToolCall` don't just look the same — they *behave* the same, transition for transition. When I fixed a focus-management bug in the dialog last week, the fix was the same fix in all three frameworks, because the bug lived in one place.

This is also my answer to a complaint I kept seeing in issue trackers: the Svelte request on vercel/ai-elements has been open since September 2025. Framework-agnostic core plus thin adapters means adding a framework is a bounded amount of work, not a rewrite. Svelte and Lit adapters are on the roadmap.

## The unglamorous parts

Things that took longer than the happy path, and that you get for free by copying:

- **Focus management.** The dialog moves focus into itself on open, traps Tab, closes on Escape, and restores focus to the trigger on close. Most hand-rolled dialogs get at least one of those wrong; mine did too, for a while.
- **Screen readers during streaming.** Connection status uses `aria-live` so state changes are announced. Almost no AI component library handles this.
- **Contrast.** Both themes pass WCAG AA. The dark theme's muted text is 9.4:1.
- **The six states.** Tool calls fail, get cancelled, and get retried. The card renders all of it, not just the demo path.

## What it isn't

It's not an MCP client SDK — you bring your own connection and wire its events into the state machines. It's not a chat framework; there's no runtime, no provider, no cloud anything. And it's v0.1: all seven MCP components ship for all three frameworks, the base set is complete in React and Angular, and Vue has ten of the base components so far, with the rest in progress.

The MCP Apps frame tracks the spec as published in January 2026. The spec is young. If it moves, the component moves — and since you own the copy in your repo, you decide when to take that update.

## Try it

The docs site renders every component live on the page — the playground demos are the actual components running, not screenshots:

- Docs and playground: https://mcp-elements.wearesnx.studio
- GitHub: https://github.com/mcp-elements/ui
- `npx mcp-elements add mcp-tool-call`

MIT licensed. If you've built an MCP client and something you needed isn't in the set, open an issue — the next batch of components gets picked from real gaps, not my guesses.
