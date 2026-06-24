'use client'

import { useState } from 'react'
import { FileCode2 } from 'lucide-react'
import { CopyButton } from '@/components/site/CopyButton'

type Framework = 'react' | 'angular' | 'vue'

const CODE: Record<Framework, string> = {
  react: `import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()

export function App() {
  return (
    <McpToolCall
      toolName="search_files"
      args={{ path: '/src', pattern: '*.ts' }}
      state={state}
      onRetry={() => state.reset()}
    />
  )
}`,
  angular: `import { Component } from '@angular/core'
import { McpeMcpToolCallComponent } from '@mcp-elements/angular'
import { createToolState } from '@mcp-elements/core'

@Component({
  selector: 'app-root',
  imports: [McpeMcpToolCallComponent],
  template: \`
    <mcpe-mcp-tool-call
      toolName="search_files"
      [args]="args"
      [state]="state"
      (onRetry)="state.reset()"
    />
  \`,
})
export class AppComponent {
  args = { path: '/src', pattern: '*.ts' }
  state = createToolState()
}`,
  vue: `<script setup>
import { McpeMcpToolCall } from '@mcp-elements/vue'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
const args = { path: '/src', pattern: '*.ts' }
</script>

<template>
  <McpeMcpToolCall
    tool-name="search_files"
    :args="args"
    :state="state"
    @retry="state.reset()"
  />
</template>`,
}

const FILENAMES: Record<Framework, string> = {
  react: 'app.tsx',
  angular: 'app.component.ts',
  vue: 'App.vue',
}

const LANG_LABEL: Record<Framework, string> = {
  react: 'TSX',
  angular: 'TS',
  vue: 'Vue',
}

export function FrameworkSection() {
  const [active, setActive] = useState<Framework>('react')

  return (
    <section className="site-section site-section-divider">
      <div className="site-container">
        <div className="mb-10 text-center">
          <p className="site-eyebrow mb-3">One API · Three frameworks</p>
          <h2 className="site-h2">Your framework. Same components.</h2>
          <p className="site-body mt-3 mx-auto max-w-xl">
            React, Angular, and Vue — all supported at launch. Same state machine, same props,
            same accessibility behaviour.
          </p>
        </div>

        {/* Framework tabs */}
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label="Framework"
            className="inline-flex rounded-lg p-1 gap-1"
            style={{
              backgroundColor: 'var(--site-bg-elevated)',
              border: '1px solid var(--site-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {(['react', 'angular', 'vue'] as Framework[]).map((fw) => {
              const isActive = active === fw
              return (
                <button
                  key={fw}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(fw)}
                  className="rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150"
                  style={{
                    backgroundColor: isActive ? 'var(--site-bg)' : 'transparent',
                    color: isActive ? 'var(--site-text)' : 'var(--site-text-muted)',
                    boxShadow: isActive ? 'var(--shadow-xs)' : undefined,
                    border: isActive ? '1px solid var(--site-border)' : '1px solid transparent',
                  }}
                >
                  {fw}
                </button>
              )
            })}
          </div>
        </div>

        {/* Code block — manual to support live framework switching without a server-rendered Shiki call */}
        <div className="mx-auto max-w-2xl site-codeblock group">
          <div className="site-codeblock-header">
            <span className="site-codeblock-filename">
              <FileCode2 className="site-codeblock-filename-icon h-3.5 w-3.5" aria-hidden />
              <span>{FILENAMES[active]}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="site-codeblock-lang">{LANG_LABEL[active]}</span>
              <CopyButton text={CODE[active]} />
            </span>
          </div>
          <pre className="site-codeblock-body font-mono leading-relaxed site-text-muted">
            <code>{CODE[active]}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
