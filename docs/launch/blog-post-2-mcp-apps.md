# Blog post 2 (anchor for relaunch) — publish on dev.to, cross-link from X/Reddit

Title: Render MCP Apps in your own host in 5 minutes
Tags: mcp, ai, webdev, javascript
Canonical: (dev.to native)

---

# Render MCP Apps in your own host in 5 minutes

In January, [MCP Apps (SEP-1865)](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) became the first official extension to the Model Context Protocol, co-authored by Anthropic and OpenAI. Tools can now return interactive UIs — dashboards, forms, viewers — and Claude, ChatGPT, Goose, and VS Code render them inline in the conversation.

That's great if your users live in Claude. But a lot of us are building our *own* hosts: internal agent consoles, MCP inspectors, vertical chat products, gateway UIs. And the moment a connected server declares a `ui://` resource, you're on the hook for the host side of the spec:

- fetch the resource and render its HTML in a **sandboxed iframe**
- construct and enforce the **CSP** the resource declared in `_meta.ui.csp`
- answer the app's **`ui/initialize`** request over JSON-RPC/postMessage, and hold all notifications until it confirms `ui/notifications/initialized`
- deliver **`ui/notifications/tool-input`** and **`tool-result`** at the right lifecycle moments
- **proxy `tools/call`** from the app back to your MCP client (respecting tool visibility)
- resize the iframe on **`ui/notifications/size-changed`**
- ask the app to wind down with **`ui/resource-teardown`** before you unmount it

None of it is hard. All of it is fiddly, and every host rebuilds it.

## The 5-minute version

`McpAppFrame` from [mcp-elements](https://mcp-elements.wearesnx.studio) is a copy-paste React component (shadcn model — the source lands in your repo) that implements the host side of SEP-1865:

```bash
npx mcp-elements add mcp-app-frame
```

```tsx
import { McpAppFrame } from '@/components/mcp-app-frame'

// 1. Your MCP client reads the ui:// resource the tool declares
const { contents } = await client.readResource({ uri: tool._meta.ui.resourceUri })
const resource = contents[0] // mimeType: text/html;profile=mcp-app

// 2. Render it
<McpAppFrame
  html={resource.text}
  resourceMeta={resource._meta?.ui}
  hostContext={{ theme: 'dark' }}
  callTool={(name, args) => client.callTool({ name, arguments: args })}
  toolInput={toolArgs}
  toolResult={result}
  openLink={(url) => window.open(url, '_blank', 'noopener')}
/>
```

That's a working SEP-1865 host surface. The frame:

1. renders the HTML via `srcdoc` with `sandbox="allow-scripts"` (no `allow-same-origin` — the app gets an opaque origin),
2. injects a `<meta http-equiv="Content-Security-Policy">` built from the resource's declared `connectDomains` / `resourceDomains` / `frameDomains`, falling back to the spec's restrictive default (no external access) when the metadata is absent,
3. answers `ui/initialize` with your `hostInfo`, capabilities derived from which delegates you passed, and `hostContext` (theme, container dimensions, locale),
4. queues `tool-input` / `tool-result` notifications until the app sends `ui/notifications/initialized` — the spec forbids sending anything earlier,
5. proxies the app's `tools/call` and `resources/read` requests to the delegates you provided, returning JSON-RPC errors when you didn't,
6. grows the iframe as the app reports `size-changed`, and
7. sends `ui/resource-teardown` on unmount and gives the app a moment to respond.

It's runtime-free — there is no MCP client inside. You bring `@modelcontextprotocol/sdk`, `mcp-use`, or your own; the component only asks for two functions.

If you'd rather own the protocol logic without React, the same state machine is a plain-TypeScript factory in `@mcp-elements/core`:

```ts
import { createAppHost } from '@mcp-elements/core'

const host = createAppHost({
  postMessage: (msg) => iframe.contentWindow.postMessage(msg, '*'),
  callTool: (name, args) => client.callTool({ name, arguments: args }),
})
window.addEventListener('message', (e) => {
  if (e.source === iframe.contentWindow) host.receive(e.data)
})
```

## What about @mcp-ui/client and the official SDK?

Use them! [`@mcp-ui/client`](https://mcpui.dev/) and the `ext-apps` App Bridge are excellent, and they're npm dependencies maintained by the community and the MCP org. mcp-elements takes the shadcn stance instead: the source is copied into your repo, so when you need to change how consent looks or where tool results render, you edit a file you own. It also comes with the rest of the host surface — the OAuth consent dialog, scope inspector, tool-call card, resource browser — which no SDK ships.

## Try it

- Live demo (a real app doing the handshake in the frame): https://mcp-elements.wearesnx.studio/components/mcp-app-frame
- Repo (MIT): https://github.com/mcp-elements/ui
- The full host kit: https://mcp-elements.wearesnx.studio

I'm building this in the open — if you're building an MCP host and something's missing from the set, open an issue and tell me what screen you had to hand-roll.
