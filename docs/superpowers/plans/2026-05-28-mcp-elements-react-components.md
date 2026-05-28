# mcp-elements MCP React Components — Plan 3c

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 7 MCP React components in `packages/react/src/mcp/` using the `@mcp-elements/core/mcp` state machines, and their companion CSS in `packages/css/components/mcp-*.css`.

**Architecture:** Each component is a thin React shell over a `@mcp-elements/core/mcp` state machine. Components follow the `forwardRef` + `mcpe-*` CSS class pattern established by existing components. CSS-only components (McpServerStatus) need no state. Stateful components subscribe to their state machine via `useEffect` + `setState`.

**Tech Stack:** React 19, TypeScript 5.7+, `@mcp-elements/core` (workspace dep), Tailwind v4 `@apply` in CSS files, `cn()` from core for class merging.

---

## File Map

**Create:**
- `packages/css/components/mcp-server-status.css`
- `packages/css/components/mcp-tool-call.css`
- `packages/css/components/mcp-tool-form.css`
- `packages/css/components/mcp-consent-dialog.css`
- `packages/css/components/mcp-scope-inspector.css`
- `packages/css/components/mcp-resource-browser.css`
- `packages/css/components/mcp-app-frame.css`
- `packages/react/src/mcp/mcp-server-status.tsx`
- `packages/react/src/mcp/mcp-tool-call.tsx`
- `packages/react/src/mcp/mcp-tool-form.tsx`
- `packages/react/src/mcp/mcp-consent-dialog.tsx`
- `packages/react/src/mcp/mcp-scope-inspector.tsx`
- `packages/react/src/mcp/mcp-resource-browser.tsx`
- `packages/react/src/mcp/mcp-app-frame.tsx`
- `packages/react/src/mcp/index.ts`

**Modify:**
- `packages/react/src/index.ts` — add `export * from './mcp'`

---

### Task 1: McpServerStatus (CSS + React)

Simplest component — pure CSS badge showing connection state.

**Files:**
- Create: `packages/css/components/mcp-server-status.css`
- Create: `packages/react/src/mcp/mcp-server-status.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-server-status.css`**

```css
@layer components {
  .mcpe-mcp-server-status {
    @apply inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium;
    border: 1px solid transparent;
  }

  .mcpe-mcp-server-status-dot {
    @apply h-2 w-2 rounded-full shrink-0;
  }

  /* Connected */
  .mcpe-mcp-server-status-connected {
    background-color: oklch(0.72 0.17 145 / 0.12);
    border-color: oklch(0.72 0.17 145 / 0.3);
    color: oklch(0.72 0.17 145);
  }
  .mcpe-mcp-server-status-connected .mcpe-mcp-server-status-dot {
    background-color: oklch(0.72 0.17 145);
  }

  /* Connecting */
  .mcpe-mcp-server-status-connecting {
    background-color: oklch(0.82 0.18 85 / 0.12);
    border-color: oklch(0.82 0.18 85 / 0.3);
    color: oklch(0.82 0.18 85);
  }
  .mcpe-mcp-server-status-connecting .mcpe-mcp-server-status-dot {
    background-color: oklch(0.82 0.18 85);
    animation: mcpe-pulse 1.5s ease-in-out infinite;
  }

  /* Disconnected */
  .mcpe-mcp-server-status-disconnected {
    background-color: oklch(0.5 0 0 / 0.08);
    border-color: oklch(0.5 0 0 / 0.2);
    color: oklch(0.55 0.012 286);
  }
  .mcpe-mcp-server-status-disconnected .mcpe-mcp-server-status-dot {
    background-color: oklch(0.55 0.012 286);
  }

  /* Error */
  .mcpe-mcp-server-status-error {
    background-color: oklch(0.62 0.22 25 / 0.12);
    border-color: oklch(0.62 0.22 25 / 0.3);
    color: oklch(0.62 0.22 25);
  }
  .mcpe-mcp-server-status-error .mcpe-mcp-server-status-dot {
    background-color: oklch(0.62 0.22 25);
  }

  @keyframes mcpe-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
}
```

- [ ] **Step 2: Create `packages/react/src/mcp/mcp-server-status.tsx`**

```tsx
import { cn } from '@mcp-elements/core'

export type McpConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface McpServerStatusProps {
  status: McpConnectionStatus
  serverName?: string
  className?: string
}

const STATUS_LABELS: Record<McpConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
  error: 'Error',
}

export function McpServerStatus({ status, serverName, className }: McpServerStatusProps) {
  return (
    <span
      className={cn(
        'mcpe-mcp-server-status',
        `mcpe-mcp-server-status-${status}`,
        className,
      )}
      role="status"
      aria-label={serverName ? `${serverName}: ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
    >
      <span className="mcpe-mcp-server-status-dot" aria-hidden="true" />
      {serverName ? `${serverName} · ${STATUS_LABELS[status]}` : STATUS_LABELS[status]}
    </span>
  )
}
```

- [ ] **Step 3: Create `packages/react/src/mcp/index.ts` (start it)**

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'
```

- [ ] **Step 4: Commit**

```bash
git add packages/css/components/mcp-server-status.css \
        packages/react/src/mcp/mcp-server-status.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpServerStatus component + CSS"
```

---

### Task 2: McpToolCall (CSS + React)

Tool execution card. Subscribes to a `ToolStateApi` instance.

**Files:**
- Create: `packages/css/components/mcp-tool-call.css`
- Create: `packages/react/src/mcp/mcp-tool-call.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-tool-call.css`**

```css
@layer components {
  .mcpe-mcp-tool-call {
    @apply rounded-xl p-4 flex flex-col gap-3;
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    color: var(--color-card-foreground);
  }

  .mcpe-mcp-tool-call-header {
    @apply flex items-center justify-between;
  }

  .mcpe-mcp-tool-call-name {
    @apply flex items-center gap-2;
  }

  .mcpe-mcp-tool-call-icon {
    @apply flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-semibold;
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  }

  .mcpe-mcp-tool-call-title {
    @apply font-mono text-sm font-medium;
  }

  .mcpe-mcp-tool-call-args {
    @apply rounded-md p-3 font-mono text-xs;
    background-color: var(--color-muted);
    border: 1px solid var(--color-border);
    color: var(--color-muted-foreground);
    overflow-x: auto;
  }

  .mcpe-mcp-tool-call-progress {
    @apply overflow-hidden rounded-full;
    height: 3px;
    background-color: var(--color-muted);
  }

  .mcpe-mcp-tool-call-progress-bar {
    @apply h-full rounded-full transition-all duration-100;
    background-color: var(--color-primary);
  }

  .mcpe-mcp-tool-call-result {
    @apply rounded-md p-3 text-sm;
  }

  .mcpe-mcp-tool-call-result-done {
    background-color: oklch(0.72 0.17 145 / 0.08);
    border: 1px solid oklch(0.72 0.17 145 / 0.25);
    color: oklch(0.72 0.17 145);
  }

  .mcpe-mcp-tool-call-result-error {
    background-color: oklch(0.62 0.22 25 / 0.08);
    border: 1px solid oklch(0.62 0.22 25 / 0.25);
    color: oklch(0.62 0.22 25);
  }

  .mcpe-mcp-tool-call-footer {
    @apply flex items-center justify-between;
  }

  /* Status badges */
  .mcpe-mcp-tool-call-badge {
    @apply inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium;
  }

  .mcpe-mcp-tool-call-badge-idle {
    background-color: var(--color-muted);
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-tool-call-badge-pending,
  .mcpe-mcp-tool-call-badge-running {
    background-color: oklch(0.82 0.18 85 / 0.15);
    color: oklch(0.82 0.18 85);
  }

  .mcpe-mcp-tool-call-badge-done {
    background-color: oklch(0.72 0.17 145 / 0.15);
    color: oklch(0.72 0.17 145);
  }

  .mcpe-mcp-tool-call-badge-error {
    background-color: oklch(0.62 0.22 25 / 0.15);
    color: oklch(0.62 0.22 25);
  }

  .mcpe-mcp-tool-call-badge-cancelled {
    background-color: var(--color-muted);
    color: var(--color-muted-foreground);
  }
}
```

- [ ] **Step 2: Create `packages/react/src/mcp/mcp-tool-call.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { cn } from '@mcp-elements/core'
import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core/mcp'

export interface McpToolCallProps {
  state: ToolStateApi
  toolName?: string
  args?: Record<string, unknown>
  onRetry?: () => void
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  idle: 'idle',
  pending: 'pending',
  running: 'running',
  done: 'done',
  error: 'error',
  cancelled: 'cancelled',
}

export function McpToolCall({ state, toolName, args, onRetry, className }: McpToolCallProps) {
  const [snap, setSnap] = useState<ToolStateSnapshot>({
    status: state.status,
    tool: state.tool,
    args: state.args,
    result: state.result,
    error: state.error,
  })

  useEffect(() => {
    // Sync with current state
    setSnap({
      status: state.status,
      tool: state.tool,
      args: state.args,
      result: state.result,
      error: state.error,
    })
    // Subscribe to future changes
    return state.subscribe((s) => setSnap({ ...s }))
  }, [state])

  const displayName = snap.tool ?? toolName ?? 'unknown'
  const displayArgs = snap.args ?? args

  return (
    <div className={cn('mcpe-mcp-tool-call', className)}>
      {/* Header */}
      <div className="mcpe-mcp-tool-call-header">
        <div className="mcpe-mcp-tool-call-name">
          <span className="mcpe-mcp-tool-call-icon" aria-hidden="true">fn</span>
          <span className="mcpe-mcp-tool-call-title">{displayName}</span>
        </div>
        <span className={cn('mcpe-mcp-tool-call-badge', `mcpe-mcp-tool-call-badge-${snap.status}`)}>
          {snap.status === 'running' && (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {STATUS_LABELS[snap.status]}
        </span>
      </div>

      {/* Args */}
      {displayArgs && (
        <pre className="mcpe-mcp-tool-call-args">
          {JSON.stringify(displayArgs, null, 2)}
        </pre>
      )}

      {/* Progress bar (running) */}
      {snap.status === 'running' && (
        <div className="mcpe-mcp-tool-call-progress" role="progressbar" aria-label="Tool running">
          <div className="mcpe-mcp-tool-call-progress-bar" style={{ width: '60%' }} />
        </div>
      )}

      {/* Result (done) */}
      {snap.status === 'done' && snap.result && (
        <div className="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-done">
          {snap.result.content
            .filter((c) => c.type === 'text')
            .map((c, i) => (
              <p key={i} className="whitespace-pre-wrap text-sm">{c.text}</p>
            ))}
        </div>
      )}

      {/* Error */}
      {snap.status === 'error' && snap.error && (
        <div className="mcpe-mcp-tool-call-result mcpe-mcp-tool-call-result-error">
          <p className="text-sm">{snap.error.message}</p>
          {onRetry && (
            <div className="mcpe-mcp-tool-call-footer mt-2">
              <button
                onClick={onRetry}
                className="text-xs underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Update `packages/react/src/mcp/index.ts`**

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'

export { McpToolCall } from './mcp-tool-call'
export type { McpToolCallProps } from './mcp-tool-call'
```

- [ ] **Step 4: Commit**

```bash
git add packages/css/components/mcp-tool-call.css \
        packages/react/src/mcp/mcp-tool-call.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpToolCall component + CSS"
```

---

### Task 3: McpToolForm (CSS + React)

Dynamic form from JSON Schema. Uses `schemaToFields()` from core.

**Files:**
- Create: `packages/css/components/mcp-tool-form.css`
- Create: `packages/react/src/mcp/mcp-tool-form.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-tool-form.css`**

```css
@layer components {
  .mcpe-mcp-tool-form {
    @apply flex flex-col gap-4;
  }

  .mcpe-mcp-tool-form-field {
    @apply flex flex-col gap-1.5;
  }

  .mcpe-mcp-tool-form-label {
    @apply text-sm font-medium;
    color: var(--color-foreground);
  }

  .mcpe-mcp-tool-form-label-required::after {
    content: ' *';
    color: var(--color-destructive);
  }

  .mcpe-mcp-tool-form-help {
    @apply text-xs;
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-tool-form-submit {
    @apply mt-2;
  }
}
```

- [ ] **Step 2: Create `packages/react/src/mcp/mcp-tool-form.tsx`**

```tsx
import { useState } from 'react'
import { cn, schemaToFields } from '@mcp-elements/core'
import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core/mcp'

export interface McpToolFormProps {
  schema: JsonSchema
  onSubmit: (args: Record<string, unknown>) => void
  loading?: boolean
  submitLabel?: string
  className?: string
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor
  value: unknown
  onChange: (v: unknown) => void
}) {
  const str = typeof value === 'string' ? value : value == null ? '' : String(value)

  switch (field.kind) {
    case 'switch':
      return (
        <input
          type="checkbox"
          id={field.key}
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mcpe-switch"
          aria-label={field.label}
        />
      )

    case 'select':
      return (
        <select
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-select"
          required={field.required}
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )

    case 'multiselect':
      return (
        <select
          id={field.key}
          multiple
          value={Array.isArray(value) ? value.map(String) : []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
            onChange(selected)
          }}
          className="mcpe-select"
          required={field.required}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )

    case 'textarea':
      return (
        <textarea
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-textarea"
          required={field.required}
          minLength={field.minLength}
          maxLength={field.maxLength}
          rows={4}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="mcpe-input"
          required={field.required}
          min={field.min}
          max={field.max}
        />
      )

    default:
      return (
        <input
          type={field.kind === 'email' ? 'email' : field.kind === 'url' ? 'url' : field.kind === 'date' ? 'date' : 'text'}
          id={field.key}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="mcpe-input"
          required={field.required}
          pattern={field.pattern}
          minLength={field.minLength}
          maxLength={field.maxLength}
        />
      )
  }
}

export function McpToolForm({
  schema,
  onSubmit,
  loading = false,
  submitLabel = 'Run',
  className,
}: McpToolFormProps) {
  const fields = schemaToFields(schema)
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {}
    for (const f of fields) {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue
    }
    return defaults
  })

  function setValue(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  if (fields.length === 0) {
    return (
      <form onSubmit={handleSubmit} className={cn('mcpe-mcp-tool-form', className)}>
        <p className="text-sm text-muted-foreground">This tool takes no inputs.</p>
        <div className="mcpe-mcp-tool-form-submit">
          <button type="submit" className="mcpe-btn mcpe-btn-primary mcpe-btn-sm" disabled={loading}>
            {loading ? 'Running…' : submitLabel}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('mcpe-mcp-tool-form', className)}>
      {fields.map((field) => (
        <div key={field.key} className="mcpe-mcp-tool-form-field">
          <label
            htmlFor={field.key}
            className={cn('mcpe-mcp-tool-form-label', field.required && 'mcpe-mcp-tool-form-label-required')}
          >
            {field.label}
          </label>
          <FieldInput field={field} value={values[field.key]} onChange={(v) => setValue(field.key, v)} />
          {field.help && <p className="mcpe-mcp-tool-form-help">{field.help}</p>}
        </div>
      ))}
      <div className="mcpe-mcp-tool-form-submit">
        <button type="submit" className="mcpe-btn mcpe-btn-primary mcpe-btn-sm" disabled={loading}>
          {loading ? 'Running…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Update `packages/react/src/mcp/index.ts`**

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'

export { McpToolCall } from './mcp-tool-call'
export type { McpToolCallProps } from './mcp-tool-call'

export { McpToolForm } from './mcp-tool-form'
export type { McpToolFormProps } from './mcp-tool-form'
```

- [ ] **Step 4: Commit**

```bash
git add packages/css/components/mcp-tool-form.css \
        packages/react/src/mcp/mcp-tool-form.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpToolForm component + CSS"
```

---

### Task 4: McpConsentDialog (CSS + React)

OAuth consent modal. Composes existing Dialog + Button.

**Files:**
- Create: `packages/css/components/mcp-consent-dialog.css`
- Create: `packages/react/src/mcp/mcp-consent-dialog.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-consent-dialog.css`**

```css
@layer components {
  .mcpe-mcp-consent-dialog-server {
    @apply flex items-center gap-3 pb-4;
    border-bottom: 1px solid var(--color-border);
  }

  .mcpe-mcp-consent-dialog-icon {
    @apply h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center text-lg font-bold shrink-0;
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  }

  .mcpe-mcp-consent-dialog-server-name {
    @apply font-semibold text-base;
  }

  .mcpe-mcp-consent-dialog-server-meta {
    @apply text-xs;
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-consent-dialog-scopes {
    @apply flex flex-col gap-2 py-3;
  }

  .mcpe-mcp-consent-dialog-scope-item {
    @apply flex items-start gap-2 rounded-lg p-3;
    background-color: var(--color-muted);
    border: 1px solid var(--color-border);
  }

  .mcpe-mcp-consent-dialog-scope-resource {
    @apply font-mono text-xs font-semibold;
    color: var(--color-primary);
  }

  .mcpe-mcp-consent-dialog-scope-perms {
    @apply flex flex-wrap gap-1 mt-0.5;
  }

  .mcpe-mcp-consent-dialog-scope-perm {
    @apply rounded px-1.5 py-0.5 text-[10px] font-medium font-mono uppercase;
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
  }

  .mcpe-mcp-consent-dialog-actions {
    @apply flex gap-2 pt-2;
    border-top: 1px solid var(--color-border);
  }
}
```

- [ ] **Step 2: Create `packages/react/src/mcp/mcp-consent-dialog.tsx`**

```tsx
import { cn, parseScopes } from '@mcp-elements/core'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../dialog'
import { Button } from '../button'

export interface McpConsentDialogProps {
  open: boolean
  serverName: string
  serverIcon?: string
  scopes: string[]
  onApprove: () => void
  onDeny: () => void
  className?: string
}

export function McpConsentDialog({
  open,
  serverName,
  serverIcon,
  scopes,
  onApprove,
  onDeny,
  className,
}: McpConsentDialogProps) {
  const parsed = parseScopes(scopes.join(' '))

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onDeny() }}>
      <div className={cn(className)}>
        <DialogHeader>
          <div className="mcpe-mcp-consent-dialog-server">
            <div className="mcpe-mcp-consent-dialog-icon" aria-hidden="true">
              {serverIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={serverIcon} alt="" className="h-full w-full object-cover" />
              ) : (
                serverName[0]?.toUpperCase() ?? '?'
              )}
            </div>
            <div>
              <p className="mcpe-mcp-consent-dialog-server-name">{serverName}</p>
              <p className="mcpe-mcp-consent-dialog-server-meta">is requesting access to</p>
            </div>
          </div>
          <DialogTitle className="sr-only">Allow {serverName}?</DialogTitle>
          <DialogDescription className="sr-only">
            Review the permissions this server is requesting before approving.
          </DialogDescription>
        </DialogHeader>

        <div className="mcpe-mcp-consent-dialog-scopes" role="list" aria-label="Requested permissions">
          {parsed.map((s) => (
            <div key={s.raw} className="mcpe-mcp-consent-dialog-scope-item" role="listitem">
              <div className="flex-1 min-w-0">
                <p className="mcpe-mcp-consent-dialog-scope-resource">{s.resource}</p>
                <div className="mcpe-mcp-consent-dialog-scope-perms">
                  {s.permissions.map((p) => (
                    <span key={p} className="mcpe-mcp-consent-dialog-scope-perm">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <div className="mcpe-mcp-consent-dialog-actions">
            <Button variant="outline" onClick={onDeny} className="flex-1">
              Deny
            </Button>
            <Button variant="primary" onClick={onApprove} className="flex-1">
              Allow
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  )
}
```

**Note:** `Dialog` in the existing codebase wraps its children directly (no `<DialogContent>` sub-component). Check `packages/react/src/dialog.tsx` to confirm the actual export names before writing this. If `DialogHeader`, `DialogFooter` etc. don't exist, replace them with plain `<div>` elements.

- [ ] **Step 3: Check existing Dialog exports**

```bash
grep "^export" packages/react/src/dialog.tsx
```

Expected output will show what's exported. If `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` are NOT exported, rewrite McpConsentDialog to use plain divs instead.

- [ ] **Step 4: Update `packages/react/src/mcp/index.ts`**

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'

export { McpToolCall } from './mcp-tool-call'
export type { McpToolCallProps } from './mcp-tool-call'

export { McpToolForm } from './mcp-tool-form'
export type { McpToolFormProps } from './mcp-tool-form'

export { McpConsentDialog } from './mcp-consent-dialog'
export type { McpConsentDialogProps } from './mcp-consent-dialog'
```

- [ ] **Step 5: Commit**

```bash
git add packages/css/components/mcp-consent-dialog.css \
        packages/react/src/mcp/mcp-consent-dialog.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpConsentDialog component + CSS"
```

---

### Task 5: McpScopeInspector (CSS + React)

Expandable list of OAuth scopes. Uses `parseScopes()` + accordion pattern.

**Files:**
- Create: `packages/css/components/mcp-scope-inspector.css`
- Create: `packages/react/src/mcp/mcp-scope-inspector.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-scope-inspector.css`**

```css
@layer components {
  .mcpe-mcp-scope-inspector {
    @apply flex flex-col gap-1;
  }

  .mcpe-mcp-scope-inspector-item {
    @apply rounded-lg overflow-hidden;
    border: 1px solid var(--color-border);
  }

  .mcpe-mcp-scope-inspector-trigger {
    @apply flex w-full items-center justify-between px-4 py-3 text-left;
    background-color: var(--color-card);
  }

  .mcpe-mcp-scope-inspector-trigger:hover {
    background-color: var(--color-accent);
  }

  .mcpe-mcp-scope-inspector-resource {
    @apply font-mono text-sm font-medium;
  }

  .mcpe-mcp-scope-inspector-perms {
    @apply flex items-center gap-1;
  }

  .mcpe-mcp-scope-inspector-perm {
    @apply rounded px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase;
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
  }

  .mcpe-mcp-scope-inspector-chevron {
    @apply h-4 w-4 shrink-0 transition-transform duration-200;
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-scope-inspector-chevron-open {
    transform: rotate(180deg);
  }

  .mcpe-mcp-scope-inspector-body {
    @apply px-4 py-3 text-sm;
    background-color: var(--color-muted);
    color: var(--color-muted-foreground);
    border-top: 1px solid var(--color-border);
  }
}
```

- [ ] **Step 2: Create `packages/react/src/mcp/mcp-scope-inspector.tsx`**

```tsx
import { useState } from 'react'
import { cn, parseScopes } from '@mcp-elements/core'
import type { ScopeDescriptor } from '@mcp-elements/core/mcp'

export interface McpScopeInspectorProps {
  /** Space-separated scope string (e.g. "repo:read user.email:read") OR pre-parsed array */
  scopes: string | ScopeDescriptor[]
  /** Optional human-readable descriptions keyed by scope raw string or resource */
  descriptions?: Record<string, string>
  className?: string
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('mcpe-mcp-scope-inspector-chevron', className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function McpScopeInspector({ scopes, descriptions = {}, className }: McpScopeInspectorProps) {
  const parsed: ScopeDescriptor[] = typeof scopes === 'string' ? parseScopes(scopes) : scopes
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className={cn('mcpe-mcp-scope-inspector', className)} role="list">
      {parsed.map((s) => {
        const isOpen = openKeys.has(s.raw)
        const description = descriptions[s.raw] ?? descriptions[s.resource]
        const triggerId = `scope-trigger-${s.raw.replace(/[^a-zA-Z0-9]/g, '-')}`
        const bodyId = `scope-body-${s.raw.replace(/[^a-zA-Z0-9]/g, '-')}`

        return (
          <div key={s.raw} className="mcpe-mcp-scope-inspector-item" role="listitem">
            <button
              id={triggerId}
              className="mcpe-mcp-scope-inspector-trigger"
              aria-expanded={isOpen}
              aria-controls={bodyId}
              onClick={() => toggle(s.raw)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="mcpe-mcp-scope-inspector-resource">{s.resource}</span>
                <div className="mcpe-mcp-scope-inspector-perms">
                  {s.permissions.map((p) => (
                    <span key={p} className="mcpe-mcp-scope-inspector-perm">{p}</span>
                  ))}
                </div>
              </div>
              <ChevronIcon className={isOpen ? 'mcpe-mcp-scope-inspector-chevron-open' : undefined} />
            </button>

            {isOpen && description && (
              <div
                id={bodyId}
                role="region"
                aria-labelledby={triggerId}
                className="mcpe-mcp-scope-inspector-body"
              >
                {description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Update `packages/react/src/mcp/index.ts`**

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'

export { McpToolCall } from './mcp-tool-call'
export type { McpToolCallProps } from './mcp-tool-call'

export { McpToolForm } from './mcp-tool-form'
export type { McpToolFormProps } from './mcp-tool-form'

export { McpConsentDialog } from './mcp-consent-dialog'
export type { McpConsentDialogProps } from './mcp-consent-dialog'

export { McpScopeInspector } from './mcp-scope-inspector'
export type { McpScopeInspectorProps } from './mcp-scope-inspector'
```

- [ ] **Step 4: Commit**

```bash
git add packages/css/components/mcp-scope-inspector.css \
        packages/react/src/mcp/mcp-scope-inspector.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpScopeInspector component + CSS"
```

---

### Task 6: McpResourceBrowser + McpAppFrame (CSS + React)

Two smaller components in one task.

**Files:**
- Create: `packages/css/components/mcp-resource-browser.css`
- Create: `packages/css/components/mcp-app-frame.css`
- Create: `packages/react/src/mcp/mcp-resource-browser.tsx`
- Create: `packages/react/src/mcp/mcp-app-frame.tsx`

- [ ] **Step 1: Create `packages/css/components/mcp-resource-browser.css`**

```css
@layer components {
  .mcpe-mcp-resource-browser {
    @apply flex flex-col gap-1;
  }

  .mcpe-mcp-resource-browser-item {
    @apply flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors;
    border: 1px solid transparent;
  }

  .mcpe-mcp-resource-browser-item:hover {
    background-color: var(--color-accent);
    border-color: var(--color-border);
  }

  .mcpe-mcp-resource-browser-item-selected {
    background-color: var(--color-accent);
    border-color: var(--color-ring);
  }

  .mcpe-mcp-resource-browser-icon {
    @apply h-8 w-8 rounded-md flex items-center justify-center text-xs font-mono shrink-0;
    background-color: var(--color-muted);
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-resource-browser-name {
    @apply text-sm font-medium truncate;
    flex: 1;
    min-width: 0;
  }

  .mcpe-mcp-resource-browser-type {
    @apply text-xs font-mono shrink-0;
    color: var(--color-muted-foreground);
  }

  .mcpe-mcp-resource-browser-empty {
    @apply py-8 text-center text-sm;
    color: var(--color-muted-foreground);
  }
}
```

- [ ] **Step 2: Create `packages/css/components/mcp-app-frame.css`**

```css
@layer components {
  .mcpe-mcp-app-frame {
    @apply block w-full rounded-xl overflow-hidden;
    border: 1px solid var(--color-border);
    background-color: var(--color-card);
  }

  .mcpe-mcp-app-frame iframe {
    @apply block w-full;
    border: none;
  }
}
```

- [ ] **Step 3: Create `packages/react/src/mcp/mcp-resource-browser.tsx`**

```tsx
import { cn } from '@mcp-elements/core'
import { Skeleton } from '../skeleton'

export interface McpResource {
  uri: string
  name: string
  mimeType?: string
  description?: string
}

export interface McpResourceBrowserProps {
  resources: McpResource[]
  selectedUri?: string
  onSelect?: (resource: McpResource) => void
  loading?: boolean
  className?: string
}

function mimeTypeLabel(mimeType?: string): string {
  if (!mimeType) return 'res'
  if (mimeType.includes('json')) return 'json'
  if (mimeType.includes('text')) return 'txt'
  if (mimeType.includes('image')) return 'img'
  if (mimeType.includes('pdf')) return 'pdf'
  return mimeType.split('/')[1]?.slice(0, 4) ?? 'res'
}

export function McpResourceBrowser({
  resources,
  selectedUri,
  onSelect,
  loading = false,
  className,
}: McpResourceBrowserProps) {
  if (loading) {
    return (
      <div className={cn('mcpe-mcp-resource-browser', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className={cn('mcpe-mcp-resource-browser', className)}>
        <p className="mcpe-mcp-resource-browser-empty">No resources available</p>
      </div>
    )
  }

  return (
    <div className={cn('mcpe-mcp-resource-browser', className)} role="list">
      {resources.map((r) => (
        <button
          key={r.uri}
          type="button"
          role="listitem"
          className={cn(
            'mcpe-mcp-resource-browser-item w-full text-left',
            selectedUri === r.uri && 'mcpe-mcp-resource-browser-item-selected',
          )}
          onClick={() => onSelect?.(r)}
          aria-selected={selectedUri === r.uri}
          aria-label={r.name}
        >
          <span className="mcpe-mcp-resource-browser-icon" aria-hidden="true">
            {mimeTypeLabel(r.mimeType)}
          </span>
          <span className="mcpe-mcp-resource-browser-name">{r.name}</span>
          {r.mimeType && (
            <span className="mcpe-mcp-resource-browser-type">{r.mimeType.split('/')[0]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `packages/react/src/mcp/mcp-app-frame.tsx`**

```tsx
import { useEffect, useRef, useCallback } from 'react'
import { cn, createAppBridge } from '@mcp-elements/core'
import type { AppMessageEnvelope } from '@mcp-elements/core/mcp'

export interface McpAppFrameProps {
  /** URL of the MCP App to load */
  src: string
  /** Called when the app sends a message via postMessage */
  onMessage?: (envelope: AppMessageEnvelope) => void
  /** Height of the iframe in pixels */
  height?: number
  /** Additional iframe sandbox flags. Default: allow-scripts allow-same-origin */
  sandbox?: string
  className?: string
}

export function McpAppFrame({
  src,
  onMessage,
  height = 480,
  sandbox = 'allow-scripts allow-same-origin',
  className,
}: McpAppFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  const postToFrame = useCallback((msg: unknown) => {
    frameRef.current?.contentWindow?.postMessage(msg, '*')
  }, [])

  useEffect(() => {
    if (!onMessage) return

    const bridge = createAppBridge({
      postMessage: postToFrame,
      onMessage,
    })

    const handler = (e: MessageEvent) => {
      bridge.receive(e.data)
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onMessage, postToFrame])

  return (
    <div className={cn('mcpe-mcp-app-frame', className)}>
      <iframe
        ref={frameRef}
        src={src}
        sandbox={sandbox}
        style={{ height }}
        title="MCP App"
        aria-label="MCP App frame"
      />
    </div>
  )
}
```

- [ ] **Step 5: Update `packages/react/src/mcp/index.ts`** (final version)

```typescript
export { McpServerStatus } from './mcp-server-status'
export type { McpServerStatusProps, McpConnectionStatus } from './mcp-server-status'

export { McpToolCall } from './mcp-tool-call'
export type { McpToolCallProps } from './mcp-tool-call'

export { McpToolForm } from './mcp-tool-form'
export type { McpToolFormProps } from './mcp-tool-form'

export { McpConsentDialog } from './mcp-consent-dialog'
export type { McpConsentDialogProps } from './mcp-consent-dialog'

export { McpScopeInspector } from './mcp-scope-inspector'
export type { McpScopeInspectorProps } from './mcp-scope-inspector'

export { McpResourceBrowser } from './mcp-resource-browser'
export type { McpResourceBrowserProps, McpResource } from './mcp-resource-browser'

export { McpAppFrame } from './mcp-app-frame'
export type { McpAppFrameProps } from './mcp-app-frame'
```

- [ ] **Step 6: Commit**

```bash
git add packages/css/components/mcp-resource-browser.css \
        packages/css/components/mcp-app-frame.css \
        packages/react/src/mcp/mcp-resource-browser.tsx \
        packages/react/src/mcp/mcp-app-frame.tsx \
        packages/react/src/mcp/index.ts
git commit -m "feat(react/mcp): McpResourceBrowser, McpAppFrame components + CSS"
```

---

### Task 7: Wire up exports + build verification

**Files:**
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Check current end of `packages/react/src/index.ts`**

```bash
tail -5 packages/react/src/index.ts
```

- [ ] **Step 2: Add MCP barrel export to `packages/react/src/index.ts`**

Append at the end of the file:
```typescript
// MCP components
export * from './mcp'
```

- [ ] **Step 3: Check that `@mcp-elements/core` exports the mcp sub-path**

```bash
cat packages/core/package.json | grep -A5 '"exports"'
```

The core package exports `"."` only. The React components import from `'@mcp-elements/core/mcp'` — this needs a sub-path export. 

**If `"./mcp"` sub-path is missing from `packages/core/package.json`**, add it:
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./mcp": {
      "types": "./dist/mcp/index.d.ts",
      "import": "./dist/mcp/index.js"
    }
  }
}
```

**However**, since `packages/core/src/index.ts` already re-exports everything from `./mcp`, you can simply import from `'@mcp-elements/core'` instead of `'@mcp-elements/core/mcp'`. Fix all React MCP component files to use `import { ... } from '@mcp-elements/core'` (no sub-path).

Specifically, update these imports in each mcp component:
- `import type { ToolStateApi, ToolStateSnapshot } from '@mcp-elements/core/mcp'` → `from '@mcp-elements/core'`
- `import type { JsonSchema, FieldDescriptor } from '@mcp-elements/core/mcp'` → `from '@mcp-elements/core'`
- `import type { ScopeDescriptor } from '@mcp-elements/core/mcp'` → `from '@mcp-elements/core'`
- `import type { AppMessageEnvelope } from '@mcp-elements/core/mcp'` → `from '@mcp-elements/core'`
- `import { ..., schemaToFields } from '@mcp-elements/core'` — already correct, just keep

After updating imports, run:
```bash
cd packages/core && pnpm build
cd ../react && pnpm build
```

Expected: Both exit 0, no TypeScript errors.

- [ ] **Step 4: Fix any TypeScript errors**

Common issues:
- `McpConsentDialog` may fail if Dialog sub-components don't exist. Check `grep "^export" packages/react/src/dialog.tsx`. If `DialogHeader`/`DialogFooter`/`DialogTitle`/`DialogDescription` are missing, rewrite the component using plain `<div>` elements with appropriate class names.
- `createAppBridge` config may have different interface — check `packages/core/src/mcp/app-bridge.ts` for the `AppBridgeConfig` interface.

After all fixes, re-run: `cd packages/react && pnpm build`

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/index.ts packages/react/src/mcp/ packages/core/package.json
git commit -m "feat(react/mcp): wire up MCP barrel export, build verified"
```

---

## Self-Review

**Spec coverage:**
- ✅ `McpServerStatus` — 4 states (connected/connecting/disconnected/error), CSS pulse animation for connecting
- ✅ `McpToolCall` — subscribes to `ToolStateApi`, shows idle/pending/running/done/error states, retry button
- ✅ `McpToolForm` — `schemaToFields()` drives form, renders all FieldKind types
- ✅ `McpConsentDialog` — `parseScopes()` parses scope strings, uses Dialog + Button, onApprove/onDeny
- ✅ `McpScopeInspector` — accordion-style expandable scopes, `parseScopes()` or pre-parsed input, descriptions
- ✅ `McpResourceBrowser` — list with type icons, loading skeleton, selected state, empty state
- ✅ `McpAppFrame` — iframe with sandbox, `createAppBridge()` for postMessage

**Type consistency:**
- `ToolStateApi` imported from `@mcp-elements/core` — matches what `createToolState()` returns ✓
- `JsonSchema` from `@mcp-elements/core` — matches `schemaToFields()` parameter type ✓
- `ScopeDescriptor` from `@mcp-elements/core` — matches `parseScopes()` return type ✓
- `AppMessageEnvelope` from `@mcp-elements/core` — matches `createAppBridge` onMessage callback ✓
- `FieldDescriptor` from `@mcp-elements/core` — matches `schemaToFields()` return type ✓

**Critical check for Task 4 (McpConsentDialog):** The existing `Dialog` component in `packages/react/src/dialog.tsx` must be checked for its actual sub-component exports before finalizing the implementation. Task 4 Step 3 explicitly requires this check and provides a fallback.

**Critical check for Task 7 (imports):** All `'@mcp-elements/core/mcp'` imports must be changed to `'@mcp-elements/core'` since the core package only exports from `.` (root). This is flagged in Task 7 Step 3.
