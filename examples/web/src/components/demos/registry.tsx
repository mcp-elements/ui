'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Badge,
  Input,
  Alert,
  Skeleton,
  Switch,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  McpServerStatus,
  McpToolCall,
  McpToolForm,
  McpConsentDialog,
  McpScopeInspector,
  McpResourceBrowser,
  McpAppFrame,
  AiBadge,
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleTimestamp,
  SuggestionChips,
  SuggestionChip,
  SourceCards,
  SourceCard,
  StreamingText,
  Feedback,
  FeedbackButton,
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputActions,
  PromptInputCharCount,
} from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

type DemoFn = () => React.ReactNode

// ───────── Base components ─────────

const ButtonDemo: DemoFn = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </div>
)

const BadgeDemo: DemoFn = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
  </div>
)

const InputDemo: DemoFn = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    <Input placeholder="Search components…" />
    <Input type="email" placeholder="you@example.com" />
    <Input disabled placeholder="Disabled" />
  </div>
)

const CardDemo: DemoFn = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>github-mcp</CardTitle>
      <CardDescription>OAuth-secured MCP server with 12 tools</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Read repositories, search code, manage issues, and open pull requests through the GitHub MCP server.
      </p>
    </CardContent>
    <CardFooter className="flex gap-2">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button size="sm">Connect</Button>
    </CardFooter>
  </Card>
)

const AlertDemo: DemoFn = () => (
  <div className="flex w-full max-w-md flex-col gap-3">
    <Alert>Heads up — this server is in preview.</Alert>
    <Alert variant="success">Connected to github-mcp. 12 tools available.</Alert>
    <Alert variant="warning">Your token expires in 2 days.</Alert>
    <Alert variant="destructive">Connection lost. Reconnecting…</Alert>
  </div>
)

const TabsDemo: DemoFn = () => {
  const items = [
    { value: 'tools', label: 'Tools' },
    { value: 'resources', label: 'Resources' },
    { value: 'prompts', label: 'Prompts' },
  ]
  return (
    <Tabs items={items} defaultValue="tools" className="w-full max-w-md">
      {(api) => (
        <>
          <TabsList>
            {items.map((t) => (
              <TabsTrigger
                key={t.value}
                isActive={api.value === t.value}
                onClick={() => api.setValue(t.value)}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent>
            {api.value === 'tools' && <p className="text-sm">12 tools exposed by this server.</p>}
            {api.value === 'resources' && <p className="text-sm">3 resources you can browse.</p>}
            {api.value === 'prompts' && <p className="text-sm">5 prompt templates ready to use.</p>}
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}

const SkeletonDemo: DemoFn = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
  </div>
)

const SwitchDemo: DemoFn = () => {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={a} onCheckedChange={setA} />
        Auto-approve safe tool calls
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={b} onCheckedChange={setB} />
        Stream partial results
      </label>
    </div>
  )
}

const DialogDemo: DemoFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Reset all tool history?</DialogTitle>
          <DialogDescription>
            This permanently clears every tool call and result on this server. You can&rsquo;t undo it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>Reset</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

// ───────── MCP components ─────────

const McpServerStatusDemo: DemoFn = () => (
  <div className="flex flex-wrap gap-3">
    <McpServerStatus status="connected" serverName="github-mcp" />
    <McpServerStatus status="connecting" serverName="linear-mcp" />
    <McpServerStatus status="disconnected" />
    <McpServerStatus status="error" serverName="jira-mcp" />
  </div>
)

const McpToolCallDemo: DemoFn = () => {
  const state = useMemo(() => createToolState(), [])

  useEffect(() => {
    let cancelled = false
    const t: ReturnType<typeof setTimeout>[] = []
    function s(fn: () => void, ms: number) { t.push(setTimeout(() => { if (!cancelled) fn() }, ms)) }
    function loop() {
      s(() => state.start({ tool: 'search_files', args: { path: '/src', pattern: '*.ts' } }), 400)
      s(() => state.markRunning(), 900)
      s(() => state.markDone({ content: [{ type: 'text', text: 'Found 47 TypeScript files' }] }), 2800)
      s(() => { state.reset(); if (!cancelled) loop() }, 6000)
    }
    loop()
    return () => { cancelled = true; t.forEach(clearTimeout) }
  }, [state])

  return (
    <div className="w-full max-w-md">
      <McpToolCall state={state} onRetry={() => state.reset()} />
    </div>
  )
}

const McpToolFormDemo: DemoFn = () => {
  const schema = {
    type: 'object' as const,
    properties: {
      query: { type: 'string' as const, title: 'Search query', minLength: 1 },
      language: { type: 'string' as const, title: 'Language', enum: ['TypeScript', 'Python', 'Go', 'Rust'] },
      limit: { type: 'number' as const, title: 'Max results', minimum: 1, maximum: 100, default: 10 },
    },
    required: ['query'],
  }
  const [result, setResult] = useState<string>()
  return (
    <div className="w-full max-w-md">
      <McpToolForm
        schema={schema}
        onSubmit={(args) => setResult(JSON.stringify(args, null, 2))}
        submitLabel="Run tool"
      />
      {result && (
        <pre className="mt-3 rounded-md p-3 font-mono text-xs"
          style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)', color: 'var(--site-text-muted)' }}>
          {result}
        </pre>
      )}
    </div>
  )
}

const McpConsentDialogDemo: DemoFn = () => {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<string>()
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => setOpen(true)}>Show consent dialog</Button>
      {result && (
        <p className="text-sm font-mono" style={{ color: 'var(--site-text-muted)' }}>
          Result: <span style={{ color: 'var(--site-accent)' }}>{result}</span>
        </p>
      )}
      <McpConsentDialog
        open={open}
        serverName="GitHub MCP"
        scopes={['repo:read', 'user.email:read', 'notifications:write']}
        onApprove={() => { setOpen(false); setResult('approved') }}
        onDeny={() => { setOpen(false); setResult('denied') }}
      />
    </div>
  )
}

const McpScopeInspectorDemo: DemoFn = () => (
  <div className="w-full max-w-md">
    <McpScopeInspector
      scopes="repo:read user.email:read notifications:write"
      descriptions={{
        'repo:read': 'Read access to your repositories, including code, issues, and pull requests.',
        'user.email:read': 'Access your verified email address to identify your account.',
        'notifications:write': 'Create and manage notifications on your behalf.',
      }}
    />
  </div>
)

const McpResourceBrowserDemo: DemoFn = () => {
  const [selected, setSelected] = useState<string>()
  return (
    <div className="w-full max-w-md">
      <McpResourceBrowser
        resources={[
          { uri: 'mcp://github/repos/mcp-elements', name: 'mcp-elements/ui', mimeType: 'application/json' },
          { uri: 'mcp://github/issues/42', name: 'Issue #42: Add Vue adapter', mimeType: 'text/markdown' },
          { uri: 'mcp://github/pulls/108', name: 'PR #108: Refactor consent flow', mimeType: 'text/markdown' },
          { uri: 'mcp://github/file/README.md', name: 'README.md', mimeType: 'text/markdown' },
        ]}
        selectedUri={selected}
        onSelect={(r) => setSelected(r.uri)}
      />
    </div>
  )
}

const McpAppFrameDemo: DemoFn = () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;font:14px ui-sans-serif,system-ui,-apple-system;background:#0a0a0a;color:#e5e5e5;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:8px}
    .dot{width:8px;height:8px;border-radius:50%;background:#3b82f6;animation:p 1.4s infinite}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
    code{background:#1a1a1a;padding:2px 6px;border-radius:4px;font-size:11px;color:#a3a3a3}
  </style></head><body>
    <div class="dot"></div>
    <p>Sandboxed MCP App</p>
    <code>postMessage bridge active</code>
  </body></html>`
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  return (
    <div className="w-full max-w-md">
      <McpAppFrame src={dataUrl} height={200} />
    </div>
  )
}

// ───────── AI components ─────────

const AiBadgeDemo: DemoFn = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AiBadge>AI</AiBadge>
    <AiBadge variant="prominent">AI Generated</AiBadge>
    <AiBadge variant="subtle" showIcon={false}>Beta</AiBadge>
  </div>
)
const ChatBubbleDemo: DemoFn = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <ChatBubble variant="user">
      <ChatBubbleContent>How do I add a component?</ChatBubbleContent>
      <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
    </ChatBubble>
    <ChatBubble variant="ai">
      <ChatBubbleAvatar src="" alt="Assistant" />
      <ChatBubbleContent>Run `npx mcp-elements add button` and it copies into your project.</ChatBubbleContent>
      <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
    </ChatBubble>
  </div>
)
const SuggestionChipsDemo: DemoFn = () => (
  <SuggestionChips>
    <SuggestionChip>Summarize this</SuggestionChip>
    <SuggestionChip variant="primary">Write tests</SuggestionChip>
    <SuggestionChip variant="outline">Explain the error</SuggestionChip>
  </SuggestionChips>
)
const SourceCardDemo: DemoFn = () => (
  <SourceCards className="w-full max-w-md">
    <SourceCard index={1} title="Model Context Protocol" domain="modelcontextprotocol.io" href="https://modelcontextprotocol.io" />
    <SourceCard index={2} title="mcp-elements docs" domain="mcp-elements.dev" href="https://mcp-elements.dev" />
  </SourceCards>
)
const StreamingTextDemo: DemoFn = () => (
  <div className="w-full max-w-md">
    <StreamingText>Streaming a response token by token, just like an LLM would render it in real time.</StreamingText>
  </div>
)
const FeedbackDemo: DemoFn = () => {
  const [sel, setSel] = useState<'up' | 'down' | null>(null)
  return (
    <Feedback>
      <FeedbackButton type="up" selected={sel === 'up'} onClick={() => setSel('up')} aria-label="Thumbs up" />
      <FeedbackButton type="down" selected={sel === 'down'} onClick={() => setSel('down')} aria-label="Thumbs down" />
    </Feedback>
  )
}
const PromptInputDemo: DemoFn = () => {
  const [value, setValue] = useState('')
  return (
    <div className="w-full max-w-md">
      <PromptInput>
        <PromptInputTextarea placeholder="Ask anything…" value={value} onChange={(e) => setValue(e.target.value)} rows={2} />
        <PromptInputFooter>
          <PromptInputCharCount count={value.length} max={2000} />
          <PromptInputActions>
            <Button size="sm" disabled={!value.trim()}>Send</Button>
          </PromptInputActions>
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}

// ───────── Registry ─────────

export const DEMOS: Record<string, DemoFn> = {
  button: ButtonDemo,
  badge: BadgeDemo,
  input: InputDemo,
  card: CardDemo,
  alert: AlertDemo,
  tabs: TabsDemo,
  skeleton: SkeletonDemo,
  switch: SwitchDemo,
  dialog: DialogDemo,
  'mcp-server-status': McpServerStatusDemo,
  'mcp-tool-call': McpToolCallDemo,
  'mcp-tool-form': McpToolFormDemo,
  'mcp-consent-dialog': McpConsentDialogDemo,
  'mcp-scope-inspector': McpScopeInspectorDemo,
  'mcp-resource-browser': McpResourceBrowserDemo,
  'mcp-app-frame': McpAppFrameDemo,
  'ai-badge': AiBadgeDemo,
  'chat-bubble': ChatBubbleDemo,
  'suggestion-chips': SuggestionChipsDemo,
  'source-card': SourceCardDemo,
  'streaming-text': StreamingTextDemo,
  feedback: FeedbackDemo,
  'prompt-input': PromptInputDemo,
}

export function ComponentPreview({ slug }: { slug: string }) {
  const Demo = DEMOS[slug]
  if (!Demo) return null
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--site-border)' }}>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'var(--site-bg-elevated)', borderBottom: '1px solid var(--site-border)' }}>
        <span className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--site-text-subtle)' }}>
          Live preview
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono"
          style={{ color: 'var(--site-text-subtle)' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-success)' }} />
          real component
        </span>
      </div>
      <div className="flex min-h-[200px] items-center justify-center p-8"
        style={{ background: 'var(--site-bg)' }}>
        <Demo />
      </div>
    </div>
  )
}
