# Plan 2: MCP Core Utilities

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Implement framework-free MCP core utilities at `packages/core/src/mcp/` with full Vitest test coverage. Six modules, all pure TypeScript, no DOM or framework imports.

**Architecture:** One module per responsibility. Module → test file pair. All public APIs covered by tests written first (TDD). `packages/core/src/index.ts` re-exports the public surface.

**Tech Stack:** TypeScript 5.7+, Vitest 2.x (already configured in `packages/core/package.json`), tsup for build (already set up).

**Spec reference:** `docs/superpowers/specs/2026-05-21-mcp-elements-design.md` § 4.2.
**Protocol reference:** `docs/research/protocol-cheatsheet.md` — implementer agents MUST read this for exact type shapes. Do not invent type definitions.
**Conventions reference:** `docs/research/codebase-conventions.md` § 3 (Core conventions).

**Estimated effort (solo, 10-15 hrs/week):** 10-15 hours. Plan 2 is real implementation work — slower than Plan 1's mechanical rename.

---

## Pre-flight

- Confirm Plan 1 is merged to main: `git log --oneline -3` should show the rename commits.
- Create a feature branch: `git checkout -b feat/mcp-core-utilities`
- All Plan 2 work happens on this branch; merge to main after Task 9.

---

## File Structure

```
packages/core/
├── src/
│   ├── mcp/
│   │   ├── types.ts          # T2 — MCP descriptor types (re-export from spec shape)
│   │   ├── scope.ts          # T3 — OAuth scope string parser
│   │   ├── tool-state.ts     # T4 — Tool execution state machine
│   │   ├── schema-form.ts    # T5 — JSON Schema → form field descriptor
│   │   ├── oauth.ts          # T6 — OAuth 2.1 + PKCE state machine + helpers
│   │   ├── app-bridge.ts     # T7 — postMessage envelope for MCP Apps
│   │   └── index.ts          # T1 — barrel export of all mcp/ public API
│   └── index.ts              # T8 — add `export * from './mcp'`
└── test/
    └── mcp/
        ├── scope.test.ts
        ├── tool-state.test.ts
        ├── schema-form.test.ts
        ├── oauth.test.ts
        └── app-bridge.test.ts
```

types.ts has no runtime behavior so no dedicated test file — types are exercised by the other modules' tests.

---

## Task 1: Bootstrap `mcp/` directory + first test scaffold

**Files:**
- Create: `packages/core/src/mcp/index.ts` (empty barrel)
- Create: `packages/core/test/mcp/scope.test.ts` (failing test scaffold)
- Modify: `packages/core/package.json` if `test` script doesn't already include `test/` dir

- [ ] **Step 1: Confirm current Vitest config**

```bash
cat packages/core/package.json | grep -A2 '"test"'
ls packages/core/vitest.config* 2>/dev/null || echo "no vitest config — default discovery"
```

Vitest by default discovers `**/*.test.ts` in the package. No config change needed.

- [ ] **Step 2: Create `packages/core/src/mcp/index.ts`**

```typescript
// Barrel export for MCP core utilities.
// Populated as modules are implemented (Tasks 2-7).
export {};
```

- [ ] **Step 3: Create `packages/core/test/mcp/scope.test.ts` (placeholder failing test)**

```typescript
import { describe, it, expect } from 'vitest'

describe('mcp/scope (bootstrap)', () => {
  it('module is importable', async () => {
    const mod = await import('../../src/mcp/scope')
    expect(mod).toBeDefined()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

Expected: FAIL with "Cannot find module '../../src/mcp/scope'".

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/mcp/ packages/core/test/mcp/
git commit -m "feat(core): scaffold mcp/ directory with failing import test"
```

---

## Task 2: `types.ts` — MCP descriptor types

**Files:**
- Create: `packages/core/src/mcp/types.ts`
- Modify: `packages/core/src/mcp/index.ts` to re-export types

Source: `docs/research/protocol-cheatsheet.md` § 1.

- [ ] **Step 1: Read the protocol cheatsheet § 1 (MCP Core Types)**

Confirm shapes for: `Implementation`, `ServerCapabilities`, `ClientCapabilities`, `Tool`, `Resource`, `Prompt`, `CallToolResult`, content block variants.

- [ ] **Step 2: Create `packages/core/src/mcp/types.ts` with verbatim type definitions**

```typescript
// MCP descriptor types. Sourced from MCP spec 2025-11-25.
// Reference: docs/research/protocol-cheatsheet.md § 1

export interface BaseMetadata {
  name: string
  title?: string
}

export interface Icons {
  icons?: Array<{
    src: string
    mimeType?: string
    sizes?: string[]
    theme?: 'light' | 'dark'
  }>
}

export interface Implementation extends BaseMetadata, Icons {
  version: string
  description?: string
  websiteUrl?: string
}

export interface ServerCapabilities {
  experimental?: Record<string, object>
  logging?: object
  completions?: object
  prompts?: { listChanged?: boolean }
  resources?: { subscribe?: boolean; listChanged?: boolean }
  tools?: { listChanged?: boolean }
  tasks?: {
    list?: object
    cancel?: object
    requests?: { tools?: { call?: object } }
  }
}

export interface JsonSchema {
  $schema?: string
  type: 'object' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'null'
  properties?: Record<string, JsonSchema>
  required?: string[]
  additionalProperties?: boolean
  description?: string
  title?: string
  format?: string
  enum?: unknown[]
  default?: unknown
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  items?: JsonSchema
}

export interface Tool extends BaseMetadata, Icons {
  description?: string
  inputSchema: JsonSchema & { type: 'object' }
  outputSchema?: JsonSchema & { type: 'object' }
  annotations?: {
    title?: string
    readOnlyHint?: boolean
    destructiveHint?: boolean
    idempotentHint?: boolean
    openWorldHint?: boolean
  }
}

export interface Resource extends BaseMetadata, Icons {
  uri: string
  mimeType?: string
  description?: string
  size?: number
}

export interface Prompt extends BaseMetadata, Icons {
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
}

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }
  | { type: 'audio'; data: string; mimeType: string }
  | { type: 'resource'; resource: Resource & { text?: string; blob?: string } }

export interface CallToolResult {
  content: ContentBlock[]
  isError?: boolean
  structuredContent?: Record<string, unknown>
}

// MCP App UI Resource (MCP Apps spec 2026-01-26)
export interface UiResource {
  uri: string
  mimeType: string
  content: string
  metadata?: Record<string, unknown>
}

// Tool call lifecycle status (used by ToolState machine)
export type ToolCallStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'done'
  | 'error'
  | 'cancelled'

// OAuth scope descriptor (used by Scope parser + Consent dialog)
export interface ScopeDescriptor {
  raw: string                    // original scope string e.g. "user.email:read"
  resource: string               // before the colon — "user.email"
  permissions: string[]          // after the colon, comma-split — ["read"]
  description?: string           // human-readable; set by callers
}
```

- [ ] **Step 3: Re-export from `mcp/index.ts`**

```typescript
export * from './types'
```

- [ ] **Step 4: Type-check**

```bash
pnpm --filter @mcp-elements/core build 2>&1 | tail -5
```

Expected: build succeeds, types emitted to `dist/`.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/mcp/
git commit -m "feat(core): add mcp/types.ts with MCP spec 2025-11-25 descriptor types"
```

---

## Task 3: `scope.ts` — OAuth scope parser

**Files:**
- Create: `packages/core/src/mcp/scope.ts`
- Create: `packages/core/test/mcp/scope.test.ts` (replaces bootstrap placeholder)
- Modify: `packages/core/src/mcp/index.ts`

Behavior: Parse OAuth scope strings into structured `ScopeDescriptor`. Format: `"resource:permission"` (most common) or `"resource:perm1,perm2"`. Bare strings (no colon) → permission `["access"]`.

- [ ] **Step 1: Replace bootstrap test with real tests (TDD: failing first)**

```typescript
// packages/core/test/mcp/scope.test.ts
import { describe, it, expect } from 'vitest'
import { parseScope, parseScopes } from '../../src/mcp/scope'

describe('parseScope', () => {
  it('parses resource:permission', () => {
    expect(parseScope('user.email:read')).toEqual({
      raw: 'user.email:read',
      resource: 'user.email',
      permissions: ['read'],
    })
  })

  it('parses comma-separated permissions', () => {
    expect(parseScope('repo:read,write')).toEqual({
      raw: 'repo:read,write',
      resource: 'repo',
      permissions: ['read', 'write'],
    })
  })

  it('treats bare strings as permission "access"', () => {
    expect(parseScope('admin')).toEqual({
      raw: 'admin',
      resource: 'admin',
      permissions: ['access'],
    })
  })

  it('trims whitespace in permissions', () => {
    expect(parseScope('repo:read, write , delete')).toEqual({
      raw: 'repo:read, write , delete',
      resource: 'repo',
      permissions: ['read', 'write', 'delete'],
    })
  })
})

describe('parseScopes (space-delimited list)', () => {
  it('parses space-separated scope list', () => {
    const scopes = parseScopes('user.email:read repo:read,write')
    expect(scopes).toHaveLength(2)
    expect(scopes[0].resource).toBe('user.email')
    expect(scopes[1].resource).toBe('repo')
  })

  it('returns empty array for empty input', () => {
    expect(parseScopes('')).toEqual([])
    expect(parseScopes('  ')).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

Expected: FAIL — `parseScope is not a function` or import error.

- [ ] **Step 3: Implement `scope.ts`**

```typescript
// packages/core/src/mcp/scope.ts
import type { ScopeDescriptor } from './types'

export function parseScope(raw: string): ScopeDescriptor {
  const trimmed = raw.trim()
  if (!trimmed.includes(':')) {
    return { raw, resource: trimmed, permissions: ['access'] }
  }
  const [resource, permsStr] = trimmed.split(':', 2) as [string, string]
  const permissions = permsStr.split(',').map((p) => p.trim()).filter(Boolean)
  return { raw, resource, permissions }
}

export function parseScopes(scopeString: string): ScopeDescriptor[] {
  return scopeString
    .split(/\s+/)
    .filter(Boolean)
    .map(parseScope)
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

Expected: PASS — 6 tests passing.

- [ ] **Step 5: Re-export**

Update `packages/core/src/mcp/index.ts`:

```typescript
export * from './types'
export * from './scope'
```

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/mcp/ packages/core/test/mcp/
git commit -m "feat(core): add mcp/scope.ts OAuth scope parser with tests"
```

---

## Task 4: `tool-state.ts` — Tool execution state machine

**Files:**
- Create: `packages/core/src/mcp/tool-state.ts`
- Create: `packages/core/test/mcp/tool-state.test.ts`
- Modify: `packages/core/src/mcp/index.ts`

Behavior: Pure state machine. Transitions:
- `idle → pending` (via `start()`)
- `pending → running` (via `markRunning()`)
- `running → done` (via `markDone(result)`)
- `running → error` (via `markError(err)`)
- `pending | running → cancelled` (via `cancel()`)
- `done | error | cancelled → idle` (via `reset()`)

Invalid transitions throw.

- [ ] **Step 1: Write failing tests**

```typescript
// packages/core/test/mcp/tool-state.test.ts
import { describe, it, expect } from 'vitest'
import { createToolState } from '../../src/mcp/tool-state'

describe('createToolState', () => {
  it('starts in idle state', () => {
    const s = createToolState()
    expect(s.status).toBe('idle')
  })

  it('transitions idle → pending → running → done', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    expect(s.status).toBe('pending')
    expect(s.tool).toBe('foo')
    s.markRunning()
    expect(s.status).toBe('running')
    s.markDone({ content: [{ type: 'text', text: 'ok' }] })
    expect(s.status).toBe('done')
    expect(s.result).toBeDefined()
  })

  it('transitions running → error', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markError(new Error('boom'))
    expect(s.status).toBe('error')
    expect(s.error?.message).toBe('boom')
  })

  it('allows cancel from pending or running', () => {
    const s1 = createToolState()
    s1.start({ tool: 'foo', args: {} })
    s1.cancel()
    expect(s1.status).toBe('cancelled')

    const s2 = createToolState()
    s2.start({ tool: 'foo', args: {} })
    s2.markRunning()
    s2.cancel()
    expect(s2.status).toBe('cancelled')
  })

  it('reset returns to idle from terminal states', () => {
    const s = createToolState()
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markError(new Error('x'))
    s.reset()
    expect(s.status).toBe('idle')
    expect(s.tool).toBeUndefined()
    expect(s.result).toBeUndefined()
    expect(s.error).toBeUndefined()
  })

  it('throws on invalid transitions', () => {
    const s = createToolState()
    expect(() => s.markRunning()).toThrow()
    expect(() => s.markDone({ content: [] })).toThrow()
  })

  it('subscribers receive state updates', () => {
    const s = createToolState()
    const updates: string[] = []
    s.subscribe((state) => updates.push(state.status))
    s.start({ tool: 'foo', args: {} })
    s.markRunning()
    s.markDone({ content: [] })
    expect(updates).toEqual(['pending', 'running', 'done'])
  })
})
```

- [ ] **Step 2: Verify tests fail**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

- [ ] **Step 3: Implement `tool-state.ts`**

```typescript
// packages/core/src/mcp/tool-state.ts
import type { CallToolResult, ToolCallStatus } from './types'

export interface ToolStateSnapshot {
  status: ToolCallStatus
  tool?: string
  args?: Record<string, unknown>
  result?: CallToolResult
  error?: Error
  startedAt?: number
  endedAt?: number
}

export interface ToolStateApi extends ToolStateSnapshot {
  start(input: { tool: string; args: Record<string, unknown> }): void
  markRunning(): void
  markDone(result: CallToolResult): void
  markError(error: Error): void
  cancel(): void
  reset(): void
  subscribe(fn: (snapshot: ToolStateSnapshot) => void): () => void
}

const VALID_TRANSITIONS: Record<ToolCallStatus, ToolCallStatus[]> = {
  idle: ['pending'],
  pending: ['running', 'cancelled'],
  running: ['done', 'error', 'cancelled'],
  done: ['idle'],
  error: ['idle'],
  cancelled: ['idle'],
}

export function createToolState(): ToolStateApi {
  let snapshot: ToolStateSnapshot = { status: 'idle' }
  const listeners = new Set<(s: ToolStateSnapshot) => void>()

  function transition(to: ToolCallStatus, patch: Partial<ToolStateSnapshot> = {}) {
    const allowed = VALID_TRANSITIONS[snapshot.status]
    if (!allowed.includes(to)) {
      throw new Error(`Invalid tool-state transition: ${snapshot.status} → ${to}`)
    }
    snapshot = { ...snapshot, ...patch, status: to }
    for (const fn of listeners) fn(snapshot)
  }

  return {
    get status() { return snapshot.status },
    get tool() { return snapshot.tool },
    get args() { return snapshot.args },
    get result() { return snapshot.result },
    get error() { return snapshot.error },
    get startedAt() { return snapshot.startedAt },
    get endedAt() { return snapshot.endedAt },
    start({ tool, args }) {
      transition('pending', { tool, args, startedAt: Date.now() })
    },
    markRunning() {
      transition('running')
    },
    markDone(result) {
      transition('done', { result, endedAt: Date.now() })
    },
    markError(error) {
      transition('error', { error, endedAt: Date.now() })
    },
    cancel() {
      transition('cancelled', { endedAt: Date.now() })
    },
    reset() {
      snapshot = { status: 'idle' }
      for (const fn of listeners) fn(snapshot)
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
```

- [ ] **Step 4: Verify tests pass**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

- [ ] **Step 5: Re-export + commit**

Update `mcp/index.ts` to include `export * from './tool-state'`.

```bash
git add packages/core/src/mcp/ packages/core/test/mcp/
git commit -m "feat(core): add mcp/tool-state.ts state machine with tests"
```

---

## Task 5: `schema-form.ts` — JSON Schema → form field descriptor

**Files:**
- Create: `packages/core/src/mcp/schema-form.ts`
- Create: `packages/core/test/mcp/schema-form.test.ts`

Behavior: Map a JSON Schema (one tool's inputSchema) into an array of UI form field descriptors. Implementer agents will render these via React/Angular/Vue.

Mapping rules per `docs/research/protocol-cheatsheet.md` § 5:
- `string` → text input. `format: email|uri|date` → specialized
- `number|integer` → numeric input with `min`/`max` from `minimum`/`maximum`
- `boolean` → switch
- `enum` → select with options from `enum` array
- `array of strings` → multi-select chips
- `object` (nested) → fieldset (recursive — Phase 1 supports 1 level deep only)
- `required` array → field marked required
- `description` → help text on field

- [ ] **Step 1: Write failing tests**

```typescript
// packages/core/test/mcp/schema-form.test.ts
import { describe, it, expect } from 'vitest'
import { schemaToFields } from '../../src/mcp/schema-form'

describe('schemaToFields', () => {
  it('maps string property to text field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { name: { type: 'string', description: 'Your name' } },
    })
    expect(fields).toHaveLength(1)
    expect(fields[0]).toMatchObject({
      key: 'name',
      kind: 'text',
      label: 'name',
      help: 'Your name',
      required: false,
    })
  })

  it('marks required fields', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    })
    expect(fields[0].required).toBe(true)
  })

  it('maps string with format:email to email field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { email: { type: 'string', format: 'email' } },
    })
    expect(fields[0].kind).toBe('email')
  })

  it('maps number with bounds to number field', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { age: { type: 'integer', minimum: 0, maximum: 120 } },
    })
    expect(fields[0]).toMatchObject({
      kind: 'number',
      min: 0,
      max: 120,
    })
  })

  it('maps boolean to switch', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { enabled: { type: 'boolean' } },
    })
    expect(fields[0].kind).toBe('switch')
  })

  it('maps enum to select with options', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { role: { type: 'string', enum: ['admin', 'user', 'guest'] } },
    })
    expect(fields[0]).toMatchObject({
      kind: 'select',
      options: [
        { value: 'admin', label: 'admin' },
        { value: 'user', label: 'user' },
        { value: 'guest', label: 'guest' },
      ],
    })
  })

  it('maps array of strings to multiselect', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
      },
    })
    expect(fields[0].kind).toBe('multiselect')
  })

  it('uses title over property name when present', () => {
    const fields = schemaToFields({
      type: 'object',
      properties: { fullName: { type: 'string', title: 'Full Name' } },
    })
    expect(fields[0].label).toBe('Full Name')
  })

  it('returns empty array for schema without properties', () => {
    expect(schemaToFields({ type: 'object' })).toEqual([])
  })
})
```

- [ ] **Step 2: Verify failing**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
```

- [ ] **Step 3: Implement `schema-form.ts`**

```typescript
// packages/core/src/mcp/schema-form.ts
import type { JsonSchema } from './types'

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'date'
  | 'number'
  | 'switch'
  | 'select'
  | 'multiselect'
  | 'unknown'

export interface FieldDescriptor {
  key: string
  kind: FieldKind
  label: string
  help?: string
  required: boolean
  defaultValue?: unknown
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

export function schemaToFields(schema: JsonSchema): FieldDescriptor[] {
  if (schema.type !== 'object' || !schema.properties) return []
  const required = new Set(schema.required ?? [])
  const fields: FieldDescriptor[] = []
  for (const [key, propSchema] of Object.entries(schema.properties)) {
    fields.push(fieldFromProperty(key, propSchema, required.has(key)))
  }
  return fields
}

function fieldFromProperty(key: string, schema: JsonSchema, required: boolean): FieldDescriptor {
  const base = {
    key,
    label: schema.title ?? key,
    help: schema.description,
    required,
    defaultValue: schema.default,
  }

  if (schema.enum && schema.enum.length > 0) {
    return {
      ...base,
      kind: 'select',
      options: schema.enum.map((v) => ({ value: String(v), label: String(v) })),
    }
  }

  switch (schema.type) {
    case 'string': {
      if (schema.format === 'email') return { ...base, kind: 'email' }
      if (schema.format === 'uri' || schema.format === 'url') return { ...base, kind: 'url' }
      if (schema.format === 'date' || schema.format === 'date-time') return { ...base, kind: 'date' }
      if ((schema.maxLength ?? 0) > 200) return { ...base, kind: 'textarea', maxLength: schema.maxLength }
      return {
        ...base,
        kind: 'text',
        minLength: schema.minLength,
        maxLength: schema.maxLength,
        pattern: schema.pattern,
      }
    }
    case 'number':
    case 'integer':
      return { ...base, kind: 'number', min: schema.minimum, max: schema.maximum }
    case 'boolean':
      return { ...base, kind: 'switch' }
    case 'array':
      if (schema.items?.type === 'string') return { ...base, kind: 'multiselect' }
      return { ...base, kind: 'unknown' }
    default:
      return { ...base, kind: 'unknown' }
  }
}
```

- [ ] **Step 4: Verify passing + commit**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
# Update mcp/index.ts: export * from './schema-form'
git add -A
git commit -m "feat(core): add mcp/schema-form.ts JSON-Schema-to-field mapper with tests"
```

---

## Task 6: `oauth.ts` — OAuth 2.1 + PKCE state machine + helpers

**Files:**
- Create: `packages/core/src/mcp/oauth.ts`
- Create: `packages/core/test/mcp/oauth.test.ts`

Source: `docs/research/protocol-cheatsheet.md` § 2.

Behavior:
- Generate `code_verifier` (43-128 char URL-safe random) and `code_challenge` (SHA-256 of verifier, base64url-encoded).
- Build authorization URL with required params.
- Build token exchange request body.
- State machine: `idle → authorizing → authorized | denied | error`.

Implementation note: this module uses `crypto.subtle` for SHA-256. To stay framework-free but cross-environment, use the WebCrypto API which works in browsers, Node 18+, and Deno. Use `globalThis.crypto.subtle`.

- [ ] **Step 1: Write failing tests**

```typescript
// packages/core/test/mcp/oauth.test.ts
import { describe, it, expect } from 'vitest'
import { generatePkcePair, buildAuthUrl, buildTokenExchangeBody, createOAuthFlow } from '../../src/mcp/oauth'

describe('generatePkcePair', () => {
  it('returns a 43-128 char URL-safe verifier', async () => {
    const pair = await generatePkcePair()
    expect(pair.codeVerifier.length).toBeGreaterThanOrEqual(43)
    expect(pair.codeVerifier.length).toBeLessThanOrEqual(128)
    expect(pair.codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('returns a base64url-encoded SHA-256 challenge', async () => {
    const pair = await generatePkcePair()
    expect(pair.codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(pair.codeChallenge).not.toContain('=')
    expect(pair.codeChallengeMethod).toBe('S256')
  })

  it('different calls produce different verifiers', async () => {
    const a = await generatePkcePair()
    const b = await generatePkcePair()
    expect(a.codeVerifier).not.toBe(b.codeVerifier)
  })
})

describe('buildAuthUrl', () => {
  it('includes all required params', () => {
    const url = buildAuthUrl({
      authorizationEndpoint: 'https://example.com/authorize',
      clientId: 'abc',
      redirectUri: 'https://app.example.com/cb',
      scope: 'user:read repo:write',
      codeChallenge: 'CHAL',
      state: 'STATE',
    })
    const u = new URL(url)
    expect(u.origin + u.pathname).toBe('https://example.com/authorize')
    expect(u.searchParams.get('response_type')).toBe('code')
    expect(u.searchParams.get('client_id')).toBe('abc')
    expect(u.searchParams.get('redirect_uri')).toBe('https://app.example.com/cb')
    expect(u.searchParams.get('scope')).toBe('user:read repo:write')
    expect(u.searchParams.get('code_challenge')).toBe('CHAL')
    expect(u.searchParams.get('code_challenge_method')).toBe('S256')
    expect(u.searchParams.get('state')).toBe('STATE')
  })
})

describe('buildTokenExchangeBody', () => {
  it('returns URL-encoded body', () => {
    const body = buildTokenExchangeBody({
      clientId: 'abc',
      code: 'AUTH_CODE',
      redirectUri: 'https://app.example.com/cb',
      codeVerifier: 'V',
    })
    const params = new URLSearchParams(body)
    expect(params.get('grant_type')).toBe('authorization_code')
    expect(params.get('client_id')).toBe('abc')
    expect(params.get('code')).toBe('AUTH_CODE')
    expect(params.get('redirect_uri')).toBe('https://app.example.com/cb')
    expect(params.get('code_verifier')).toBe('V')
  })
})

describe('createOAuthFlow', () => {
  it('starts in idle', () => {
    const f = createOAuthFlow()
    expect(f.status).toBe('idle')
  })

  it('transitions idle → authorizing → authorized', () => {
    const f = createOAuthFlow()
    f.start({ verifier: 'V', state: 'S' })
    expect(f.status).toBe('authorizing')
    f.markAuthorized({ accessToken: 'T', tokenType: 'Bearer' })
    expect(f.status).toBe('authorized')
    expect(f.tokens?.accessToken).toBe('T')
  })

  it('transitions authorizing → denied', () => {
    const f = createOAuthFlow()
    f.start({ verifier: 'V', state: 'S' })
    f.markDenied('user_denied')
    expect(f.status).toBe('denied')
  })

  it('throws on invalid transitions', () => {
    const f = createOAuthFlow()
    expect(() => f.markAuthorized({ accessToken: 'x', tokenType: 'Bearer' })).toThrow()
  })
})
```

- [ ] **Step 2: Verify failing**

- [ ] **Step 3: Implement `oauth.ts`**

```typescript
// packages/core/src/mcp/oauth.ts

export interface PkcePair {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: 'S256'
}

function randomBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n)
  globalThis.crypto.getRandomValues(arr)
  return arr
}

function base64urlEncode(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function generatePkcePair(): Promise<PkcePair> {
  const verifierBytes = randomBytes(64) // 64 bytes → 86 chars base64url, within 43-128 range
  const codeVerifier = base64urlEncode(verifierBytes)
  const verifierBuf = new TextEncoder().encode(codeVerifier)
  const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', verifierBuf)
  const codeChallenge = base64urlEncode(new Uint8Array(hashBuf))
  return { codeVerifier, codeChallenge, codeChallengeMethod: 'S256' }
}

export interface AuthUrlInput {
  authorizationEndpoint: string
  clientId: string
  redirectUri: string
  scope: string
  codeChallenge: string
  state: string
  resource?: string  // RFC 8707 — MCP-required for token binding
}

export function buildAuthUrl(input: AuthUrlInput): string {
  const u = new URL(input.authorizationEndpoint)
  u.searchParams.set('response_type', 'code')
  u.searchParams.set('client_id', input.clientId)
  u.searchParams.set('redirect_uri', input.redirectUri)
  u.searchParams.set('scope', input.scope)
  u.searchParams.set('code_challenge', input.codeChallenge)
  u.searchParams.set('code_challenge_method', 'S256')
  u.searchParams.set('state', input.state)
  if (input.resource) u.searchParams.set('resource', input.resource)
  return u.toString()
}

export interface TokenExchangeInput {
  clientId: string
  code: string
  redirectUri: string
  codeVerifier: string
}

export function buildTokenExchangeBody(input: TokenExchangeInput): string {
  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('client_id', input.clientId)
  body.set('code', input.code)
  body.set('redirect_uri', input.redirectUri)
  body.set('code_verifier', input.codeVerifier)
  return body.toString()
}

export type OAuthStatus = 'idle' | 'authorizing' | 'authorized' | 'denied' | 'error'

export interface OAuthTokens {
  accessToken: string
  tokenType: string
  expiresIn?: number
  refreshToken?: string
  scope?: string
}

export interface OAuthFlowSnapshot {
  status: OAuthStatus
  verifier?: string
  state?: string
  tokens?: OAuthTokens
  error?: { code: string; message?: string }
}

export interface OAuthFlowApi extends OAuthFlowSnapshot {
  start(input: { verifier: string; state: string }): void
  markAuthorized(tokens: OAuthTokens): void
  markDenied(code: string, message?: string): void
  markError(error: Error): void
  reset(): void
  subscribe(fn: (s: OAuthFlowSnapshot) => void): () => void
}

const OAUTH_TRANSITIONS: Record<OAuthStatus, OAuthStatus[]> = {
  idle: ['authorizing'],
  authorizing: ['authorized', 'denied', 'error'],
  authorized: ['idle'],
  denied: ['idle'],
  error: ['idle'],
}

export function createOAuthFlow(): OAuthFlowApi {
  let snap: OAuthFlowSnapshot = { status: 'idle' }
  const listeners = new Set<(s: OAuthFlowSnapshot) => void>()
  function transition(to: OAuthStatus, patch: Partial<OAuthFlowSnapshot> = {}) {
    const allowed = OAUTH_TRANSITIONS[snap.status]
    if (!allowed.includes(to)) {
      throw new Error(`Invalid oauth transition: ${snap.status} → ${to}`)
    }
    snap = { ...snap, ...patch, status: to }
    for (const fn of listeners) fn(snap)
  }
  return {
    get status() { return snap.status },
    get verifier() { return snap.verifier },
    get state() { return snap.state },
    get tokens() { return snap.tokens },
    get error() { return snap.error },
    start({ verifier, state }) { transition('authorizing', { verifier, state }) },
    markAuthorized(tokens) { transition('authorized', { tokens }) },
    markDenied(code, message) { transition('denied', { error: { code, message } }) },
    markError(error) { transition('error', { error: { code: 'unknown', message: error.message } }) },
    reset() { snap = { status: 'idle' }; for (const fn of listeners) fn(snap) },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
  }
}
```

- [ ] **Step 4: Verify passing + commit**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
# Update mcp/index.ts: export * from './oauth'
git add -A
git commit -m "feat(core): add mcp/oauth.ts PKCE + state machine with tests"
```

---

## Task 7: `app-bridge.ts` — postMessage envelope for MCP Apps

**Files:**
- Create: `packages/core/src/mcp/app-bridge.ts`
- Create: `packages/core/test/mcp/app-bridge.test.ts`

Source: `docs/research/protocol-cheatsheet.md` § 4.

Behavior:
- Encode/decode the MCP Apps message envelope: `{ id, type, payload }`.
- Provide a thin "bridge" object that wraps `postMessage` to/from a target frame.
- Pure logic only — no DOM. The bridge accepts an injected `postMessage`-like function so it can be tested without a real iframe.

- [ ] **Step 1: Write failing tests**

```typescript
// packages/core/test/mcp/app-bridge.test.ts
import { describe, it, expect, vi } from 'vitest'
import { encodeEnvelope, decodeEnvelope, createAppBridge } from '../../src/mcp/app-bridge'

describe('encodeEnvelope', () => {
  it('produces a string-keyed envelope with id, type, payload', () => {
    const env = encodeEnvelope({ id: '1', type: 'host:notify', payload: { foo: 'bar' } })
    expect(env).toEqual({ id: '1', type: 'host:notify', payload: { foo: 'bar' } })
  })
})

describe('decodeEnvelope', () => {
  it('returns the envelope if shape is valid', () => {
    expect(decodeEnvelope({ id: 'x', type: 'app:event', payload: {} })).toEqual({
      id: 'x',
      type: 'app:event',
      payload: {},
    })
  })

  it('returns null for invalid payloads', () => {
    expect(decodeEnvelope(null)).toBeNull()
    expect(decodeEnvelope({ id: 1 })).toBeNull() // id must be string
    expect(decodeEnvelope({ id: 'x', type: 123 })).toBeNull()
    expect(decodeEnvelope('not-an-object')).toBeNull()
  })
})

describe('createAppBridge', () => {
  it('calls injected postMessage with encoded envelope on send()', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    bridge.send({ id: 'm1', type: 'host:notify', payload: { ok: true } })
    expect(post).toHaveBeenCalledWith({ id: 'm1', type: 'host:notify', payload: { ok: true } })
  })

  it('dispatches to listeners on incoming valid envelope', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    const received: any[] = []
    bridge.onMessage((env) => received.push(env))
    bridge.receive({ id: '1', type: 'app:event', payload: { x: 1 } })
    expect(received).toEqual([{ id: '1', type: 'app:event', payload: { x: 1 } }])
  })

  it('ignores invalid incoming payloads', () => {
    const post = vi.fn()
    const bridge = createAppBridge({ postMessage: post })
    const received: any[] = []
    bridge.onMessage((env) => received.push(env))
    bridge.receive('garbage')
    bridge.receive({ id: 1 })
    expect(received).toEqual([])
  })

  it('onMessage unsubscribe stops dispatch', () => {
    const bridge = createAppBridge({ postMessage: vi.fn() })
    const received: any[] = []
    const unsub = bridge.onMessage((env) => received.push(env))
    bridge.receive({ id: '1', type: 'app:event', payload: {} })
    unsub()
    bridge.receive({ id: '2', type: 'app:event', payload: {} })
    expect(received).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Verify failing**

- [ ] **Step 3: Implement `app-bridge.ts`**

```typescript
// packages/core/src/mcp/app-bridge.ts

export interface AppMessageEnvelope {
  id: string
  type: string
  payload: unknown
}

export function encodeEnvelope(env: AppMessageEnvelope): AppMessageEnvelope {
  return { id: env.id, type: env.type, payload: env.payload }
}

export function decodeEnvelope(raw: unknown): AppMessageEnvelope | null {
  if (raw === null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string') return null
  if (typeof o.type !== 'string') return null
  return { id: o.id, type: o.type, payload: o.payload ?? {} }
}

export interface AppBridgeConfig {
  postMessage: (env: AppMessageEnvelope) => void
}

export interface AppBridge {
  send(env: AppMessageEnvelope): void
  receive(raw: unknown): void
  onMessage(fn: (env: AppMessageEnvelope) => void): () => void
}

export function createAppBridge(config: AppBridgeConfig): AppBridge {
  const listeners = new Set<(env: AppMessageEnvelope) => void>()
  return {
    send(env) {
      config.postMessage(encodeEnvelope(env))
    },
    receive(raw) {
      const env = decodeEnvelope(raw)
      if (!env) return
      for (const fn of listeners) fn(env)
    },
    onMessage(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
```

- [ ] **Step 4: Verify passing + commit**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -10
# Update mcp/index.ts: export * from './app-bridge'
git add -A
git commit -m "feat(core): add mcp/app-bridge.ts postMessage envelope helpers with tests"
```

---

## Task 8: Re-export from `packages/core/src/index.ts`

**Files:**
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: Read current `index.ts`**

```bash
cat packages/core/src/index.ts
```

- [ ] **Step 2: Add re-export**

Append at the bottom (preserve existing exports for dialog, tabs, accordion, etc.):

```typescript
export * from './mcp'
```

- [ ] **Step 3: Type-check the build**

```bash
pnpm --filter @mcp-elements/core build 2>&1 | tail -5
```

Expected: build succeeds, no type errors.

- [ ] **Step 4: Smoke test the public API**

Create `/tmp/mcp-smoke.ts`:

```typescript
// /tmp/mcp-smoke.ts
import {
  parseScope,
  createToolState,
  schemaToFields,
  generatePkcePair,
  buildAuthUrl,
  createOAuthFlow,
  createAppBridge,
  type Tool,
  type ToolCallStatus,
  type ScopeDescriptor,
} from '@mcp-elements/core'

console.log(parseScope('user:read'))
console.log(createToolState().status)
console.log(schemaToFields({ type: 'object', properties: {} }))
```

Run it via the workspace:

```bash
cd /tmp && pnpx tsx mcp-smoke.ts
```

(If `tsx` isn't available, skip — the type-check from Step 3 is the primary verification.)

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/index.ts
git commit -m "feat(core): export mcp/* from package root"
```

---

## Task 9: Final test + coverage + commit

**Files:** none modified — verification only.

- [ ] **Step 1: Run full test suite**

```bash
pnpm --filter @mcp-elements/core test 2>&1 | tail -20
```

Expected: all tests pass. Count: ~40 tests across 5 test files (scope: 6, tool-state: 7, schema-form: 9, oauth: 9, app-bridge: 6).

- [ ] **Step 2: Run full pnpm build**

```bash
pnpm build 2>&1 | tail -5
```

Expected: 7/7 successful (other packages unaffected).

- [ ] **Step 3: Confirm public exports are consumable**

```bash
ls packages/core/dist/
grep -E "^export" packages/core/dist/index.d.ts | head -20
```

Expected: see export lines for mcp types and functions in the .d.ts.

- [ ] **Step 4: Update WIP.md to mark Stage D complete**

Edit `WIP.md` § Stage D, check off D1-D7. Add a Decision Log entry.

```bash
git add WIP.md
git commit -m "docs: mark Stage D (MCP core utilities) complete in WIP pipeline"
```

- [ ] **Step 5: Merge to main**

```bash
git checkout main
git merge --ff-only feat/mcp-core-utilities
git branch -d feat/mcp-core-utilities
git log --oneline -10
```

Expected: ~9 new commits on main.

---

## Recovery / Rollback Notes

- If a test fails after implementation: read the failure carefully — usually it's a mismatched property name in the test vs implementation. Fix and re-run before committing.
- If `pnpm build` fails type-checking: usually a type narrowing issue in the state machine `transition()` calls. Add explicit type annotations where TS can't infer.
- If `globalThis.crypto.subtle` is undefined (older Node): bump to Node 20+. The package.json's `engines` field likely already requires Node 20+.

---

## Next plan

After Plan 2 completes, draft **Plan 3: MCP × React** — implement the 7 React components + 4 hooks, using `@mcp-elements/core/mcp/*` as the underlying state engine. Spec reference: § 5.
