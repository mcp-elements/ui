'use client'

import { useEffect, useState } from 'react'
import { TerminalSquare } from 'lucide-react'
import { CopyButton } from './CopyButton'

interface InstallCommandProps {
  /** Component name passed straight to the CLI, e.g. "mcp-tool-call". */
  componentName?: string
  /** Slug — same idea as componentName but accepted from doc pages. */
  slug?: string
  /** Type out the command character-by-character on mount. */
  animate?: boolean
  /** Force a literal command, ignoring slug/componentName. */
  command?: string
  /** Compact variant — no header, single-row layout. */
  compact?: boolean
}

export function InstallCommand({
  componentName,
  slug,
  animate = false,
  command: overrideCommand,
  compact = false,
}: InstallCommandProps) {
  const command =
    overrideCommand ??
    (slug
      ? `npx mcp-elements add ${slug}`
      : componentName
        ? `npx mcp-elements add ${componentName}`
        : 'npm install @mcp-elements/react')

  const [displayed, setDisplayed] = useState(animate ? '' : command)

  useEffect(() => {
    if (!animate) {
      setDisplayed(command)
      return
    }
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(command.slice(0, i))
      if (i >= command.length) clearInterval(timer)
    }, 35)
    return () => clearInterval(timer)
  }, [command, animate])

  if (compact) {
    return (
      <div
        className="site-codeblock group flex items-center gap-3"
        style={{ padding: '0.625rem 0.75rem 0.625rem 1rem' }}
      >
        <code className="flex-1 truncate font-mono text-sm site-text">
          <span className="site-text-subtle">$ </span>
          {displayed}
          {animate && displayed.length < command.length && (
            <span
              className="ml-0.5 inline-block h-3.5 w-0.5 align-middle"
              style={{ backgroundColor: 'var(--site-accent)', animation: 'pulse 1s steps(2) infinite' }}
            />
          )}
        </code>
        <CopyButton text={command} />
      </div>
    )
  }

  return (
    <div className="site-codeblock group">
      <div className="site-codeblock-header">
        <span className="site-codeblock-filename">
          <TerminalSquare className="site-codeblock-filename-icon h-3.5 w-3.5" aria-hidden />
          <span>Terminal</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="site-codeblock-lang">Bash</span>
          <CopyButton text={command} />
        </span>
      </div>
      <div
        className="site-codeblock-body font-mono"
        style={{ paddingBlock: '0.875rem' }}
      >
        <code className="block whitespace-pre-wrap break-all site-text">
          <span className="site-text-subtle" aria-hidden>{'$ '}</span>
          {displayed}
          {animate && displayed.length < command.length && (
            <span
              className="ml-0.5 inline-block h-4 w-[2px] -mb-0.5 align-middle"
              style={{ backgroundColor: 'var(--site-accent)', animation: 'pulse 1s steps(2) infinite' }}
            />
          )}
        </code>
      </div>
    </div>
  )
}
