# MCP + AG-UI Protocol Cheatsheet

Reference for implementation agents building MCP-native UI components. All types are
sourced from the authoritative specs listed per section. Do not invent shapes not
documented here.

Spec version pinned to: **MCP 2025-11-25**, **AG-UI (as of 2025-05)**

---

## 1. MCP Core Types

Source: https://github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts

### BaseMetadata (inherited by Tool, Resource, Prompt, Implementation)

```typescript
// Source: schema.ts lines 529–543
interface BaseMetadata {
  /** Programmatic identifier; used as display fallback if title absent. */
  name: string;
  /** Human-readable display name. For Tool, prefer annotations.title over name. */
  title?: string;
}

interface Icons {
  icons?: Array<{
    src: string;       // URL to icon
    mimeType?: string; // "image/png" | "image/svg+xml" | "image/webp" etc.
    sizes?: string[];  // ["48x48"] or ["any"]
    theme?: "light" | "dark";
  }>;
}
```

### Implementation (Server / Client descriptor)

```typescript
// Source: schema.ts line 551; spec lifecycle page
interface Implementation extends BaseMetadata, Icons {
  version: string;
  description?: string;
  /** @format uri */
  websiteUrl?: string;
}
```

Used in `initialize` request (`clientInfo`) and response (`serverInfo`).

### ServerCapabilities

```typescript
// Source: schema.ts line 387
interface ServerCapabilities {
  experimental?: { [key: string]: object };
  logging?: object;
  completions?: object;
  prompts?: {
    listChanged?: boolean; // server sends notifications/prompts/list_changed
  };
  resources?: {
    subscribe?: boolean;   // client can subscribe to individual resources
    listChanged?: boolean; // server sends notifications/resources/list_changed
  };
  tools?: {
    listChanged?: boolean; // server sends notifications/tools/list_changed
  };
  tasks?: {
    list?: object;
    cancel?: object;
    requests?: { tools?: { call?: object } };
  };
}
```

### ClientCapabilities

```typescript
// Source: schema.ts line 311
interface ClientCapabilities {
  experimental?: { [key: string]: object };
  roots?: { listChanged?: boolean };
  sampling?: {
    context?: object;
    tools?: object;
  };
  elicitation?: {
    form?: object;
    url?: object;
  };
  tasks?: {
    list?: object;
    cancel?: object;
    requests?: {
      sampling?: { createMessage?: object };
      elicitation?: { create?: object };
    };
  };
}
```

### Tool

```typescript
// Source: schema.ts line 1250
interface Tool extends BaseMetadata, Icons {
  description?: string;
  /** JSON Schema 2020-12 (default) or draft-07 if $schema specified. MUST be type:"object". */
  inputSchema: {
    $schema?: string;
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
    additionalProperties?: boolean;
  };
  outputSchema?: {
    $schema?: string;
    type: "object";
    properties?: { [key: string]: object };
    required?: string[];
  };
  annotations?: ToolAnnotations;
  execution?: {
    taskSupport?: "forbidden" | "optional" | "required"; // default: "forbidden"
  };
  _meta?: { [key: string]: unknown };
}

// Source: schema.ts line 1181
interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;     // true = tool does not modify environment
  destructiveHint?: boolean;  // true = may perform destructive updates (default: true when readOnlyHint=false)
  idempotentHint?: boolean;   // true = repeated calls with same args have no additional effect
  openWorldHint?: boolean;    // true = tool interacts with external/unpredictable entities
}
```

Tool names: 1–128 chars, `[A-Za-z0-9_\-.]` only, no spaces or commas, case-sensitive.

MCP Apps extension: tool may include `_meta.ui.resourceUri` (e.g. `"ui://charts/interactive"`) to
link to a UI resource. Source: https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/

### Resource

```typescript
// Source: schema.ts line 803
interface Resource extends BaseMetadata, Icons {
  /** @format uri */
  uri: string;
  description?: string;
  mimeType?: string;
  annotations?: Annotations;
  size?: number; // bytes, before base64 encoding
  _meta?: { [key: string]: unknown };
}

// Text resource contents
interface TextResourceContents {
  uri: string;
  mimeType?: string;
  text: string;
}

// Binary resource contents
interface BlobResourceContents {
  uri: string;
  mimeType?: string;
  /** base64-encoded */
  blob: string;
}
```

Common URI schemes: `https://`, `file://`, `git://`, `ui://` (MCP Apps), custom RFC3986.

### ResourceTemplate

```typescript
// Source: resources spec page (resources/templates/list response)
interface ResourceTemplate extends BaseMetadata, Icons {
  /** RFC 6570 URI template, e.g. "file:///{path}" */
  uriTemplate: string;
  description?: string;
  mimeType?: string;
}
```

### Prompt

```typescript
// Source: schema.ts line 985
interface Prompt extends BaseMetadata, Icons {
  description?: string;
  arguments?: PromptArgument[];
  _meta?: { [key: string]: unknown };
}

interface PromptArgument extends BaseMetadata {
  description?: string;
  required?: boolean;
}

// prompts/get result
interface GetPromptResult {
  description?: string;
  messages: PromptMessage[];
}

interface PromptMessage {
  role: "user" | "assistant";
  content: TextContent | ImageContent | AudioContent | EmbeddedResource;
}
```

### Content Types (for tool results and prompt messages)

```typescript
// Source: schema.ts lines 1741–1830+
type ContentBlock =
  | TextContent
  | ImageContent
  | AudioContent
  | ResourceLink
  | EmbeddedResource;

interface TextContent {
  type: "text";
  text: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

interface ImageContent {
  type: "image";
  data: string;   // base64-encoded
  mimeType: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

interface AudioContent {
  type: "audio";
  data: string;   // base64-encoded
  mimeType: string;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

/** Link to a resource; URI can be subscribed to or fetched. */
interface ResourceLink extends Resource {
  type: "resource_link";
}

/** Inline resource content embedded in a result. */
interface EmbeddedResource {
  type: "resource";
  resource: TextResourceContents | BlobResourceContents;
  annotations?: Annotations;
  _meta?: { [key: string]: unknown };
}

interface Annotations {
  audience?: Array<"user" | "assistant">;
  priority?: number;     // 0.0 (optional) to 1.0 (required)
  lastModified?: string; // ISO 8601
}
```

### Tool Call Request / Result

```typescript
// Source: schema.ts lines 1105+
interface CallToolRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: "tools/call";
  params: {
    name: string;
    arguments?: { [key: string]: unknown };
    _meta?: { progressToken?: string | number; [key: string]: unknown };
    task?: TaskMetadata; // only if taskSupport negotiated
  };
}

interface CallToolResult {
  content: ContentBlock[];
  structuredContent?: { [key: string]: unknown };
  isError?: boolean; // defaults false; set true for tool-execution errors
}
```

Error reporting: tool-execution errors use `isError: true` in result (LLM can self-correct).
Protocol errors use JSON-RPC error object (code, message, data). See Section 3 for full lifecycle.

---

## 2. OAuth 2.1 + PKCE Flow for MCP

Source: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
Base spec: draft-ietf-oauth-v2-1-13, RFC8414, RFC9728, RFC7591

Authorization applies to **HTTP transports only**. STDIO should use environment credentials.

### Step-by-step sequence

1. Client sends unauthenticated MCP request.
2. Server responds `HTTP 401 Unauthorized` with:
   ```
   WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource",
                            scope="files:read"
   ```
3. Client extracts `resource_metadata` URL from `WWW-Authenticate` header.
4. Client fetches Protected Resource Metadata document from that URL.
   - Fallback if header has no `resource_metadata`: probe
     `/.well-known/oauth-protected-resource/<path>` then `/.well-known/oauth-protected-resource`
5. Client reads `authorization_servers` array from the metadata document to find the Authorization Server (AS) URL.
6. Client discovers AS metadata by trying (in priority order for URLs with path components):
   - `https://auth.example.com/.well-known/oauth-authorization-server/tenant1`
   - `https://auth.example.com/.well-known/openid-configuration/tenant1`
   - `https://auth.example.com/tenant1/.well-known/openid-configuration`
   For URLs without path components:
   - `https://auth.example.com/.well-known/oauth-authorization-server`
   - `https://auth.example.com/.well-known/openid-configuration`
7. Client verifies `code_challenge_methods_supported` includes `S256` in AS metadata.
   If absent, client **MUST** refuse to proceed.
8. Client registers (choose priority order):
   - Pre-registered `client_id` if available
   - Client ID Metadata Document (if AS advertises `client_id_metadata_document_supported: true`)
   - Dynamic registration via `registration_endpoint` (RFC7591 fallback)
9. Client generates PKCE parameters (see below).
10. Client opens browser to authorization URL with all required parameters.
11. User authenticates and approves scopes on AS.
12. AS redirects to `redirect_uri` with `code` and `state`.
13. Client verifies `state` matches what was sent.
14. Client POSTs to token endpoint with `code` + `code_verifier` + `resource`.
15. AS returns `access_token` (and optionally `refresh_token`).
16. Client attaches `Authorization: Bearer <access_token>` to every MCP request.

### PKCE: code_verifier / code_challenge

Source: draft-ietf-oauth-v2-1-13 Section 4.1.1 / 7.5.2

```
code_verifier:
  - Charset: A-Z a-z 0-9 - . _ ~   (unreserved characters per RFC3986)
  - Length:  43–128 characters (inclusive)
  - Generate with a CSPRNG

code_challenge (S256 method — REQUIRED for MCP):
  code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
  (no padding; use URL-safe base64 alphabet)
```

### Authorization request URL parameters

```
GET https://auth.example.com/authorize?
  response_type=code
  &client_id=<client_id>
  &redirect_uri=<redirect_uri>           // REQUIRED if multiple registered
  &scope=<scope>                         // space-separated; from WWW-Authenticate or scopes_supported
  &state=<random_opaque_value>           // RECOMMENDED; CSRF protection
  &code_challenge=<base64url_sha256>
  &code_challenge_method=S256            // MUST be S256 for MCP
  &resource=https%3A%2F%2Fmcp.example.com  // REQUIRED per RFC8707
```

### Token exchange request body (application/x-www-form-urlencoded)

```
POST https://auth.example.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<authorization_code>
&redirect_uri=<same_redirect_uri>
&client_id=<client_id>
&code_verifier=<original_code_verifier>
&resource=https%3A%2F%2Fmcp.example.com
```

### Refresh token request body

```
grant_type=refresh_token
&refresh_token=<refresh_token>
&client_id=<client_id>
&resource=https%3A%2F%2Fmcp.example.com
```

Note: For public clients, AS **MUST** rotate refresh tokens (OAuth 2.1 §4.3.1).

### State parameter

Client generates an opaque random value before the redirect. After callback, client
**MUST** verify the returned `state` matches. Discard response if mismatch.

### Scope selection strategy

1. Use `scope` from `WWW-Authenticate` header if present (authoritative for the request).
2. If absent, use all scopes in `scopes_supported` from Protected Resource Metadata.
3. If `scopes_supported` undefined, omit `scope` parameter entirely.

### Insufficient scope (runtime step-up)

Server returns `HTTP 403` with:
```
WWW-Authenticate: Bearer error="insufficient_scope",
                         scope="files:read files:write",
                         resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"
```
Client re-initiates authorization with the new scope set, then retries the request
(implement retry limits to avoid infinite loops).

### Access token usage

```
Authorization: Bearer <access_token>
```
On **every** HTTP request. Never in query string. Token must be audience-bound to the MCP
server (via `resource` parameter); MCP servers must reject tokens not issued for them.

---

## 3. MCP Tool Call Lifecycle

Source: https://modelcontextprotocol.io/specification/2025-11-25/server/tools.md

### Full sequence: "user clicks Run Tool" → "result rendered"

```
1. [UI]    User submits form / clicks Run.
2. [Client → Server]  tools/call request:
     { jsonrpc:"2.0", id:2, method:"tools/call",
       params: { name:"get_weather", arguments:{ location:"NY" },
                 _meta:{ progressToken:"tok-001" } } }

3. [Server → Client]  (optional, zero or more) progress notifications:
     { jsonrpc:"2.0", method:"notifications/progress",
       params:{ progressToken:"tok-001", progress:30, total:100,
                message:"Fetching data..." } }
     UI: update progress bar to 30%

4. [Server → Client]  tools/call response:
     { jsonrpc:"2.0", id:2,
       result:{
         content:[{ type:"text", text:"72°F, Partly cloudy" }],
         isError: false
       }
     }

5. [UI]    Render content array. If isError:true, render error state.
```

### Progress notifications

- Include `_meta.progressToken` in the `tools/call` request to opt in.
- Server sends `notifications/progress` with `progressToken`, `progress`, optional `total`, optional `message`.
- `progress` MUST increase monotonically. `total` may be absent.
- Implementations SHOULD rate-limit; SHOULD reset timeout on receipt.

### Cancellation

```typescript
// Sent by client to cancel an in-progress request
{
  jsonrpc: "2.0",
  method: "notifications/cancelled",
  params: {
    requestId: "2",          // must match the tools/call id
    reason?: "User cancelled" // optional, loggable
  }
}
```

- Server SHOULD stop processing and free resources.
- Server MUST NOT send a response for a cancelled request.
- Race condition: cancellation may arrive after completion; both sides handle gracefully.
- For task-augmented requests, use `tasks/cancel` instead of `notifications/cancelled`.

### Error shapes

**Protocol error** (tool not found, malformed request):
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: bad_tool_name"
  }
}
```
Standard JSON-RPC error codes: `-32700` parse error, `-32600` invalid request,
`-32601` method not found, `-32602` invalid params, `-32603` internal error.

**Tool execution error** (business logic failure; LLM can self-correct):
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [{ "type": "text", "text": "Invalid date: must be in the future." }],
    "isError": true
  }
}
```

---

## 4. MCP Apps Protocol (iframe)

Source: https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/
Source: https://mcpui.dev/ (AppRenderer / createUIResource APIs — @mcp-ui/client, @mcp-ui/server)

### How a server returns an MCP App resource

Tools advertise a UI resource via `_meta.ui.resourceUri` in their descriptor:

```json
{
  "name": "visualize_data",
  "description": "Visualize data as an interactive chart",
  "inputSchema": { "type": "object" },
  "_meta": {
    "ui": {
      "resourceUri": "ui://charts/interactive"
    }
  }
}
```

The `ui://` scheme resource contains bundled HTML/JS. Fetched via `resources/read`:

```json
{
  "contents": [{
    "uri": "ui://charts/interactive",
    "mimeType": "text/html",
    "text": "<!DOCTYPE html>..."
  }]
}
```

### createUIResource (server-side, @mcp-ui/server)

```typescript
const { resource } = createUIResource({
  uri: "ui://my-server/widget",
  content: {
    type: "rawHtml",
    htmlString: "<html>...</html>"
  },
  encoding: "text"
});
// Returns { resource: { uri: "ui://my-server/widget" } }
// Register tool with _meta.ui.resourceUri = resource.uri
```

### AppRenderer (client-side React, @mcp-ui/client)

```typescript
<AppRenderer
  client={mcpClient}
  toolName="visualize_data"
  sandbox={{ url: "https://sandbox.example.com" }}
  toolInput={{ dataset: "sales-2025" }}
  toolResult={callToolResult}
  onOpenLink={(url: string) => { /* validate + open */ }}
  onMessage={(msg: unknown) => { /* handle app→host messages */ }}
/>
```

### Iframe sandboxing requirements

The iframe MUST run with a restrictive `sandbox` attribute. Based on the spec's stated
security model (pre-declared templates, auditable JSON-RPC, restricted permissions):

```html
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms"
  src="..."
  csp="default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
></iframe>
```

**IMPORTANT**: The spec announcement describes "sandboxed iframes with restricted
permissions" but does not enumerate the exact `sandbox` attribute tokens or CSP policy.
The above is the minimum recommended by the MCP-UI library. Implementation agents should
consult the @mcp-ui/client source for the exact iframe attrs used in AppRenderer.
(Flagged as unstable — see Section 8.)

### postMessage envelope schema

Communication is via `window.postMessage` carrying JSON-RPC 2.0 messages. The MCP-UI
SDK (`@mcp-ui/server` App class) provides the app-side abstraction:

```typescript
// App-side SDK (@mcp-ui/server or equivalent)
const app = new App();
await app.connect();  // establishes postMessage channel with host

// App calls a tool on the MCP server (via host relay)
const result = await app.callServerTool({
  name: "fetch_details",
  arguments: { id: "123" }
});

// App updates the model context (appends to conversation)
await app.updateModelContext({
  content: [{ type: "text", text: "User selected item 42" }]
});

// App receives tool results pushed by the host
app.ontoolresult = (result: CallToolResult) => { /* render */ };
```

Underlying envelope (JSON-RPC 2.0 over postMessage, inferred from spec):
```typescript
// Host → App
{ jsonrpc: "2.0", id?: string|number, method: string, params?: unknown }
| { jsonrpc: "2.0", id: string|number, result: unknown }
| { jsonrpc: "2.0", id?: string|number, error: { code: number; message: string } }

// App → Host (same envelope)
```

**NOTE**: The exact postMessage message type strings (e.g. `"mcp:toolResult"`,
`"mcp:callTool"`) are not published in the blog announcement. The @mcp-ui/client and
@mcp-ui/server packages implement this internally. Implementation agents must inspect
the npm package source. (Flagged as unstable — see Section 8.)

### Bidirectional flow

```
Host → App:
  - Tool call results (server response relayed to iframe)
  - Model context updates from outside the app
  - Initialization / capability handshake

App → Host:
  - Tool call requests (app asks host to invoke an MCP tool)
  - Model context updates (app appends to conversation)
  - Event logging / analytics
  - UI state signals (e.g., resize request)
```

### Security boundaries

- All app code executes in the sandboxed iframe; no direct DOM access to the host page.
- Tool calls initiated by the app require host-level relay (and optionally user consent).
- Messages are loggable JSON-RPC: hosts can audit every exchange.
- Pre-declared tool templates allow hosts to review/block unexpected tool calls before rendering.
- Users must consent to tool-initiated calls from the app context.
- Hosts SHOULD validate the `origin` on every `postMessage` event.

---

## 5. JSON Schema → Form Field Mapping

Standard mapping for McpToolForm. Source: JSON Schema draft 2020-12 + common form conventions.

| JSON Schema | Form element | Notes |
|---|---|---|
| `type: "string"` | `<input type="text">` | Default |
| `type: "string", format: "email"` | `<input type="email">` | |
| `type: "string", format: "uri"` | `<input type="url">` | |
| `type: "string", format: "date"` | `<input type="date">` | |
| `type: "string", format: "date-time"` | `<input type="datetime-local">` | |
| `type: "string", format: "password"` | `<input type="password">` | |
| `type: "string", minLength/maxLength` | `<input>` with `minlength`/`maxlength` | |
| `type: "string", enum: [...]` | `<select>` | Single-choice dropdown |
| `type: "number"` or `"integer"` | `<input type="number">` | |
| `type: "number", minimum/maximum` | `<input type="number" min max>` | |
| `type: "boolean"` | `<input type="checkbox">` or Switch | |
| `type: "array", items: { type: "string" }` | Multi-select chips or tag input | |
| `type: "array", items: { enum: [...] }` | Multi-select chips (fixed options) | |
| `type: "object"` | `<fieldset>` group with nested fields | Recurse into `properties` |
| `required: ["field"]` | `required` attribute on field | |
| `description` | Help text / tooltip below field | |
| `title` | Field label | Fall back to property key if absent |
| `default` | Pre-fill input value | |
| `readOnly: true` | `disabled` input | |
| `oneOf` / `anyOf` | Radio group or tab-switch to show matching subschema | |
| `const: value` | Hidden input or read-only display | |

Rules:
- Render top-level `type: "object"` as a flat form (one field per `properties` key).
- `required` array at object level marks individual fields as required.
- Nested objects get collapsible `<fieldset>` with legend = title or key name.
- `additionalProperties: false` means no freeform key entry.
- `$schema` field in inputSchema should be ignored for UI rendering.

---

## 6. AG-UI Event Types

Source: https://docs.ag-ui.com/concepts/events

All events share a base shape:
```typescript
type BaseEvent = {
  type: string;        // one of EventType values below
  timestamp?: number;  // Unix ms
  rawEvent?: unknown;  // original source event if transformed
}
```

### Lifecycle Events

| Event | Shape additions | UI response |
|---|---|---|
| `RunStarted` | `threadId, runId, parentRunId?, input?` | Show loading indicator, initialize run context |
| `RunFinished` | `outcome?: { type, interrupts? }, result?` | Dismiss loading, show completion state |
| `RunError` | `message, code?` | Show error banner, offer retry |
| `StepStarted` | `stepName` | Update step progress indicator |
| `StepFinished` | `stepName` | Mark step complete, animate |

### Text Message Events

| Event | Shape additions | UI response |
|---|---|---|
| `TextMessageStart` | `messageId, role` | Create message bubble |
| `TextMessageContent` | `messageId, delta` | Append delta text to bubble (streaming) |
| `TextMessageEnd` | `messageId` | Finalize bubble, enable reply controls |
| `TextMessageChunk` | `messageId?, role?, delta?` | Convenience: auto-expands to Start→Content→End |

### Tool Call Events

| Event | Shape additions | UI response |
|---|---|---|
| `ToolCallStart` | `toolCallId, toolCallName, parentMessageId?` | Show tool invocation card |
| `ToolCallArgs` | `toolCallId, delta` | Stream argument JSON into card |
| `ToolCallEnd` | `toolCallId` | Mark args complete |
| `ToolCallResult` | `messageId, toolCallId, content, role?` | Display result in tool card |
| `ToolCallChunk` | `toolCallId?, toolCallName?, parentMessageId?, delta?` | Auto-expands to Start→Args→End |

### State Management Events

| Event | Shape additions | UI response |
|---|---|---|
| `StateSnapshot` | `snapshot` | Full UI state replacement (sync recovery) |
| `StateDelta` | `delta` | Apply RFC 6902 JSON Patch operations incrementally |
| `MessagesSnapshot` | `messages` | Restore full conversation history |

### Activity Events

| Event | Shape additions | UI response |
|---|---|---|
| `ActivitySnapshot` | `messageId, activityType, content, replace?` | Create/replace activity message (e.g. PLAN, SEARCH) |
| `ActivityDelta` | `messageId, activityType, patch` | Update activity via JSON Patch |

### Reasoning Events

| Event | Shape additions | UI response |
|---|---|---|
| `ReasoningStart` | `messageId` | Initialize reasoning context |
| `ReasoningMessageStart` | `messageId, role` | Create reasoning bubble (collapsible) |
| `ReasoningMessageContent` | `messageId, delta` | Stream chain-of-thought text |
| `ReasoningMessageEnd` | `messageId` | Close reasoning section |
| `ReasoningMessageChunk` | `messageId, delta?` | Auto-expands to Start→Content→End |
| `ReasoningEnd` | `messageId` | Close reasoning context |
| `ReasoningEncryptedValue` | `subtype, entityId, encryptedValue` | Preserve encrypted reasoning across turns (no UI render) |

### Special Events

| Event | Shape additions | UI response |
|---|---|---|
| `Raw` | `event, source?` | Pass through to external system handlers |
| `Custom` | `name, value` | Application-defined; route by `name` |
| `MetaEvent` | `metaType, payload` | User feedback, annotations (draft) |

Events MUST be processed in received order. Grouped events share a common ID field
(e.g. `messageId` or `toolCallId`).

---

## 7. Status → Color / Icon Mapping

For McpToolCall, McpServerStatus, and similar status-bearing components.

| Status | Semantic | Color convention | Icon suggestion |
|---|---|---|---|
| `idle` | Not started / waiting | Gray (`neutral-400`) | Circle outline |
| `pending` | Queued, not yet running | Gray + subtle pulse | Clock / hourglass |
| `running` | Actively executing | Blue (`blue-500`) + spinner | Spinner / activity |
| `success` | Completed successfully | Green (`green-500`) | Checkmark circle |
| `error` | Failed with error | Red (`red-500`) | X circle / exclamation |
| `cancelled` | Stopped by user | Amber (`amber-500`) | Ban / stop circle |
| `timed-out` | Exceeded time limit | Orange (`orange-500`) | Clock with X |

These status values are not formally enumerated in the MCP spec itself (MCP uses
`isError: boolean` on results). The status model above maps to typical UI conventions
for async operations. The MCP `notifications/progress` notification implies a
`running` state while active.

For `McpServerStatus` connection states, MCP uses these implicit states:
- Before `initialize` handshake: `connecting`
- After `initialized` notification sent: `connected`
- After disconnect / error: `disconnected` / `error`

---

## 8. Open Questions / Unstable Areas

Implementation agents must be aware of these gaps before writing code.

### MCP Apps postMessage envelope — UNSTABLE

The blog announcement (Jan 2026) describes the MCP Apps concept and the `@mcp-ui/server`
App SDK API surface, but **does not publish the raw postMessage message type strings**.
The exact envelope format (field names, method names for `callServerTool`,
`updateModelContext`, `ontoolresult`) lives in the npm package internals and may change
without a spec-level version bump.

**Mitigation**: Pin to a specific version of `@mcp-ui/client` + `@mcp-ui/server`. Inspect
the package source for message type constants before implementing McpAppFrame.

Source: https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/ (announcement only; no
low-level protocol doc found at time of writing)

### MCP Apps iframe sandbox attributes — UNSTABLE

The spec says "sandboxed iframes with restricted permissions" but does not enumerate
exact `sandbox` tokens or a CSP policy. The AppRenderer in `@mcp-ui/client` implements
a specific policy; implementation agents must read that source.

### OAuth 2.1 draft status

MCP authorization references `draft-ietf-oauth-v2-1-13`, which is still an IETF draft
(not an RFC). Pin to the draft version the MCP spec references. The draft number may
advance and introduce breaking changes.

### AG-UI event TypeScript interfaces — PARTIAL

The `docs.ag-ui.com/concepts/events` page provides event shapes as prose + tables but
not a published TypeScript `@ag-ui/core` package with exported types. The shapes in
Section 6 are reconstructed from the documentation. Implementation agents should check
the `@ag-ui/core` npm package for canonical interface definitions.

### MCP spec version pinning

The canonical schema is `schema/2025-11-25/schema.ts`. A newer schema version may exist
by the time components are built. The `LATEST_PROTOCOL_VERSION` constant in schema.ts
reflects the pinned version. Always check `initialize` response `protocolVersion` at
runtime.

### Task-augmented execution — DRAFT FEATURE

The `tasks` capability (task-augmented `tools/call`, `tasks/list`, `tasks/cancel`,
`tasks/result`) is present in the 2025-11-25 schema but is described as an optional
negotiated capability. Behavior for `taskSupport: "optional"` and `"required"` tools
is still maturing. Do not depend on this for the initial McpToolCall component unless
the target server explicitly advertises the `tasks` capability.

### MCP Apps `mcp-ui` library status

`@mcp-ui/client` and `@mcp-ui/server` are community/early-stage packages. The
`mcpui.dev` docs page is minimal. Treat these as beta-quality dependencies.

---

*Cheatsheet compiled 2026-05-21. Sources fetched directly from spec URLs listed above.*
