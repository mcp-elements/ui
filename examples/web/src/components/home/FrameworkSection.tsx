'use client'

import { useState } from 'react'

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
import { McpToolCallComponent } from '@mcp-elements/angular'
import { createToolState } from '@mcp-elements/core'

@Component({
  selector: 'app-root',
  imports: [McpToolCallComponent],
  template: \`
    <mcp-tool-call
      toolName="search_files"
      [args]="args"
      [state]="state"
      (retry)="state.reset()"
    />
  \`,
})
export class AppComponent {
  args = { path: '/src', pattern: '*.ts' }
  state = createToolState()
}`,
  vue: `<script setup>
import { McpToolCall } from '@mcp-elements/vue'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
const args = { path: '/src', pattern: '*.ts' }
</script>

<template>
  <McpToolCall
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

export function FrameworkSection() {
  const [active, setActive] = useState<Framework>('react')

  return (
    <section className="py-24">
      <div className="site-container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--site-text)', letterSpacing: '-0.02em' }}>
            Your framework. Same components.
          </h2>
          <p className="mt-3 text-base" style={{ color: 'var(--site-text-muted)' }}>
            React, Angular, and Vue — all supported at launch.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg p-1 gap-1"
            style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
            {(['react', 'angular', 'vue'] as Framework[]).map((fw) => (
              <button key={fw} onClick={() => setActive(fw)}
                className="rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150"
                style={{
                  backgroundColor: active === fw ? 'var(--site-accent)' : 'transparent',
                  color: active === fw ? 'oklch(1 0 0)' : 'var(--site-text-muted)',
                }}>
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl"
          style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}>
          <div className="flex items-center gap-1.5 px-4 py-3"
            style={{ borderBottom: '1px solid var(--site-border)' }}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-error)' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-warning)' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--site-success)' }} />
            <span className="ml-2 font-mono text-xs" style={{ color: 'var(--site-text-subtle)' }}>
              {FILENAMES[active]}
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed"
            style={{ color: 'var(--site-text-muted)' }}>
            <code>{CODE[active]}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
