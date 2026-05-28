'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Sparkles,
  Search,
  Folder,
  FileText,
  GitBranch,
  Settings2,
  ArrowUp,
  User,
} from 'lucide-react'
import {
  McpServerStatus,
  McpToolCall,
  McpScopeInspector,
  McpResourceBrowser,
  type McpResource,
} from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const RESOURCES: McpResource[] = [
  { uri: 'mcp://github/repos/mcp-elements', name: 'mcp-elements/mcp-elements', mimeType: 'application/json' },
  { uri: 'mcp://github/issues/42', name: 'Issue #42 — Add Vue adapter', mimeType: 'text/markdown' },
  { uri: 'mcp://github/pulls/108', name: 'PR #108 — Refactor consent flow', mimeType: 'text/markdown' },
  { uri: 'mcp://github/file/readme', name: 'README.md', mimeType: 'text/markdown' },
]

const SCOPES_DESC = {
  'repo:read': 'Read access to your repositories — code, issues, pull requests.',
  'user.email:read': 'Read your verified email address.',
  'notifications:write': 'Create and manage notifications on your behalf.',
}

/**
 * FlagshipScene — the signature "wow" moment.
 *
 * A fake browser-chromed window showing what an MCP-powered app actually
 * looks like, built entirely from real @mcp-elements/react components.
 * Drives them through a continuous loop so the page never feels static.
 */
export function FlagshipScene() {
  const toolState = useMemo(() => createToolState(), [])
  const [selectedUri, setSelectedUri] = useState<string>(RESOURCES[0].uri)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'user', text: 'Find recent TypeScript files changed this week.' },
  ])

  useEffect(() => {
    let cancelled = false
    const t: ReturnType<typeof setTimeout>[] = []
    const wait = (fn: () => void, ms: number) => t.push(setTimeout(() => { if (!cancelled) fn() }, ms))

    function loop() {
      // Step 0 — reset
      setActiveStep(0)
      setMessages([{ role: 'user', text: 'Find recent TypeScript files changed this week.' }])
      toolState.reset()

      // Step 1 — assistant decides to call a tool
      wait(() => {
        setActiveStep(1)
        toolState.start({
          tool: 'search_files',
          args: { language: 'typescript', changedWithin: '7d', sort: 'recent' },
        })
      }, 1400)

      // Step 2 — tool is running
      wait(() => {
        setActiveStep(2)
        toolState.markRunning()
      }, 2400)

      // Step 3 — tool finishes
      wait(() => {
        setActiveStep(3)
        toolState.markDone({
          content: [{ type: 'text', text: 'Found 12 files. Top changes: src/mcp/tool-state.ts (+187), packages/react/src/mcp/mcp-tool-call.tsx (+109), packages/vue/src/dialog.ts (+111).' }],
        })
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text: 'Found 12 TypeScript files changed this week. The biggest diffs are in `tool-state.ts`, `mcp-tool-call.tsx`, and `dialog.ts` — want me to summarize the changes?',
          },
        ])
        setSelectedUri(RESOURCES[(Math.floor(Math.random() * RESOURCES.length))].uri)
      }, 5200)

      // Restart
      wait(() => { if (!cancelled) loop() }, 9500)
    }
    loop()
    return () => { cancelled = true; t.forEach(clearTimeout) }
  }, [toolState])

  return (
    <section className="site-section-tight relative overflow-hidden" style={{ background: 'var(--site-bg)' }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{
          background: 'radial-gradient(ellipse 70% 100% at 50% 0%, var(--site-accent-glow), transparent 70%)',
        }}
      />

      <div className="site-container relative">
        {/* Section header */}
        <div className="mb-10 max-w-2xl">
          <p className="site-eyebrow site-eyebrow-accent mb-3">In production</p>
          <h2 className="site-h2">
            What an MCP app looks like{' '}
            <span className="site-text-muted">when you stop reinventing it.</span>
          </h2>
          <p className="site-lede mt-4">
            Every visible pixel below is a real{' '}
            <code className="font-mono text-sm site-text-accent">@mcp-elements/react</code>{' '}
            component. No screenshots, no Figma.
          </p>
        </div>

        {/* Fake browser frame */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            border: '1px solid var(--site-border-strong)',
            background: 'var(--site-bg-elevated)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid var(--site-border)', background: 'var(--site-bg-subtle)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--site-error)', opacity: 0.7 }} />
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--site-warning)', opacity: 0.7 }} />
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--site-success)', opacity: 0.7 }} />
            </div>
            <div
              className="flex flex-1 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono site-text-subtle"
              style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
            >
              <span style={{ color: 'var(--site-success)' }}>●</span>
              mcp-studio.app
              <span className="site-text-subtle">/workspace</span>
            </div>
            <div className="hidden sm:flex">
              <McpServerStatus status="connected" serverName="github-mcp" />
            </div>
          </div>

          {/* App body */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px]" style={{ minHeight: '520px' }}>
            {/* Left rail — Resource browser */}
            <aside
              className="hidden lg:flex flex-col gap-4 p-4"
              style={{ borderRight: '1px solid var(--site-border)', background: 'var(--site-bg-elevated)' }}
            >
              <div className="flex items-center justify-between">
                <p className="site-eyebrow">Resources</p>
                <Search className="h-3.5 w-3.5 site-text-subtle" />
              </div>
              <McpResourceBrowser
                resources={RESOURCES}
                selectedUri={selectedUri}
                onSelect={(r) => setSelectedUri(r.uri)}
              />
              <div className="mt-auto flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-mono site-text-subtle"
                style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
                <GitBranch className="h-3 w-3" />
                <span>main · clean</span>
              </div>
            </aside>

            {/* Main — chat with tool call */}
            <main className="flex flex-col" style={{ background: 'var(--site-bg)' }}>
              {/* Conversation */}
              <div className="flex-1 overflow-hidden p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  {messages.map((m, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                        style={{
                          background: m.role === 'user' ? 'var(--site-bg-elevated)' : 'var(--site-accent-glow)',
                          color: m.role === 'user' ? 'var(--site-text)' : 'var(--site-accent)',
                          border: `1px solid ${m.role === 'user' ? 'var(--site-border)' : 'var(--site-accent)'}`,
                        }}
                      >
                        {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono uppercase tracking-widest site-text-subtle mb-1">
                          {m.role === 'user' ? 'You' : 'Assistant'}
                        </p>
                        <p className="text-sm leading-relaxed site-text">{m.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Tool call panel — only when active */}
                  {activeStep >= 1 && (
                    <div className="ml-10">
                      <McpToolCall state={toolState} onRetry={() => toolState.reset()} />
                    </div>
                  )}
                </div>
              </div>

              {/* Composer (decorative) */}
              <div
                className="flex items-end gap-2 p-4"
                style={{ borderTop: '1px solid var(--site-border)', background: 'var(--site-bg-elevated)' }}
              >
                <div
                  className="flex-1 rounded-lg px-3 py-2.5 text-sm site-text-subtle"
                  style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}
                >
                  Ask anything about your codebase…
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: 'var(--site-accent)', color: 'var(--site-bg)' }}
                  aria-label="Send"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </main>

            {/* Right rail — scopes + activity */}
            <aside
              className="hidden lg:flex flex-col gap-5 p-4"
              style={{ borderLeft: '1px solid var(--site-border)', background: 'var(--site-bg-elevated)' }}
            >
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="site-eyebrow">Scopes</p>
                  <Settings2 className="h-3.5 w-3.5 site-text-subtle" />
                </div>
                <McpScopeInspector
                  scopes="repo:read user.email:read notifications:write"
                  descriptions={SCOPES_DESC}
                />
              </div>

              {/* Activity meter (decorative — adds life) */}
              <div className="mt-auto rounded-lg p-3" style={{ background: 'var(--site-bg)', border: '1px solid var(--site-border)' }}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="site-eyebrow">Activity</p>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-success)', boxShadow: '0 0 8px var(--site-success)' }} />
                </div>
                <div className="grid grid-cols-12 gap-0.5">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const h = Math.max(2, Math.round(Math.sin((i + activeStep * 4) / 2) * 5 + 6))
                    return (
                      <span
                        key={i}
                        className="rounded-sm"
                        style={{
                          background: i <= 12 + activeStep ? 'var(--site-accent)' : 'var(--site-border-strong)',
                          opacity: i <= 12 + activeStep ? 0.55 + (i / 30) : 0.3,
                          height: `${h}px`,
                          alignSelf: 'flex-end',
                          transition: 'all 220ms var(--ease-out-soft)',
                        }}
                      />
                    )
                  })}
                </div>
                <p className="mt-2 text-[10px] font-mono site-text-subtle">12 tool calls · 1.2s avg</p>
              </div>
            </aside>
          </div>

          {/* Subtle "now playing" indicator */}
          <div
            className="absolute right-4 top-16 hidden sm:flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
            style={{
              background: 'var(--site-bg-overlay)',
              border: '1px solid var(--site-border-strong)',
              color: 'var(--site-text-subtle)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-success)' }} />
            Live · step {activeStep + 1} of 4
          </div>
        </div>

        {/* Component callouts below the frame */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'McpServerStatus', loc: 'Top right' },
            { name: 'McpResourceBrowser', loc: 'Left rail' },
            { name: 'McpToolCall', loc: 'Conversation' },
            { name: 'McpScopeInspector', loc: 'Right rail' },
          ].map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs"
              style={{ background: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--site-accent)' }} />
              <code className="font-mono font-semibold site-text">{c.name}</code>
              <span className="ml-auto site-text-subtle">{c.loc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
