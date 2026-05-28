'use client'

import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import { CopyButton } from './CopyButton'

export function InstallCommand({ componentName, animate = false }: { componentName: string; animate?: boolean }) {
  const command = `npx mcp-elements add ${componentName}`
  const [displayed, setDisplayed] = useState(animate ? '' : command)

  useEffect(() => {
    if (!animate) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(command.slice(0, i))
      if (i >= command.length) clearInterval(timer)
    }, 35)
    return () => clearInterval(timer)
  }, [command, animate])

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
    >
      <Terminal className="h-4 w-4 shrink-0" style={{ color: 'var(--site-accent)' }} />
      <code className="flex-1 font-mono text-sm" style={{ color: 'var(--site-text)' }}>
        <span style={{ color: 'var(--site-text-subtle)' }}>$ </span>
        {displayed}
        {animate && displayed.length < command.length && (
          <span
            className="ml-0.5 inline-block h-4 w-0.5 align-middle animate-pulse"
            style={{ backgroundColor: 'var(--site-accent)' }}
          />
        )}
      </code>
      <CopyButton text={command} />
    </div>
  )
}
