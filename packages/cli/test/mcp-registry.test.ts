import { describe, it, expect } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { registry, resolveComponentDeps, resolveCoreDeps } from '../src/registry/resolve'
import { transformImports } from '../src/utils/transform'
import type { SnxConfig } from '../src/utils/detect'

const PACKAGES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const MCP_COMPONENTS = [
  'mcp-server-status',
  'mcp-tool-call',
  'mcp-tool-form',
  'mcp-consent-dialog',
  'mcp-scope-inspector',
  'mcp-resource-browser',
  'mcp-app-frame',
]

const config: SnxConfig = {
  framework: 'react',
  typescript: true,
  tailwind: { css: 'src/styles/globals.css', baseColor: 'neutral' },
  aliases: { components: '@/components/ui', utils: '@/lib' },
}

function filesOf(name: string): string[] {
  const c = registry.components[name]
  const out: string[] = []
  if (c.files.css) out.push(c.files.css)
  if (c.files.core) out.push(c.files.core)
  for (const fw of ['react', 'angular'] as const) {
    const v = c.files[fw]
    if (Array.isArray(v)) out.push(...v)
    else if (v) out.push(v)
  }
  out.push(...(c.coreDeps ?? []))
  return out
}

describe('mcp registry entries', () => {
  it('registers all 7 MCP components, each tagged category=mcp', () => {
    for (const name of MCP_COMPONENTS) {
      const c = registry.components[name]
      expect(c, name).toBeDefined()
      expect(c.category, name).toBe('mcp')
    }
  })

  it('every referenced source file actually exists on disk', () => {
    for (const name of MCP_COMPONENTS) {
      for (const f of filesOf(name)) {
        expect(fs.existsSync(path.join(PACKAGES, f)), `${name}: ${f}`).toBe(true)
      }
    }
  })

  it('internal deps resolve to real registered components', () => {
    for (const name of MCP_COMPONENTS) {
      for (const dep of resolveComponentDeps(name)) {
        expect(registry.components[dep], `${name} -> ${dep}`).toBeDefined()
      }
    }
  })

  it('interactive MCP components carry cn.ts via resolveCoreDeps', () => {
    for (const name of MCP_COMPONENTS) {
      if (registry.components[name].type !== 'interactive') continue
      expect(resolveCoreDeps(name)).toContain('core/src/utils/cn.ts')
    }
  })
})

describe('transformImports rewrites MCP component imports', () => {
  it('leaves no @mcp-elements/core or parent-dir imports in any MCP React file', () => {
    for (const name of MCP_COMPONENTS) {
      const rel = registry.components[name].files.react as string
      const src = fs.readFileSync(path.join(PACKAGES, rel), 'utf-8')
      const out = transformImports(src, config)
      expect(out, `${name}: core import remains`).not.toContain('@mcp-elements/core')
      expect(out, `${name}: parent-dir import remains`).not.toMatch(/from ['"]\.\.\//)
    }
  })

  it('maps consent-dialog symbols to the right local files', () => {
    const rel = registry.components['mcp-consent-dialog'].files.react as string
    const out = transformImports(fs.readFileSync(path.join(PACKAGES, rel), 'utf-8'), config)
    expect(out).toContain("from '@/lib/cn'") // cn
    expect(out).toContain("from '@/lib/scope'") // parseScopes
    expect(out).toContain("from './dialog'") // ../dialog collapsed
    expect(out).toContain("from './button'") // ../button collapsed
  })

  it('maps tool-form schema symbols across schema-form.ts and types.ts', () => {
    const rel = registry.components['mcp-tool-form'].files.react as string
    const out = transformImports(fs.readFileSync(path.join(PACKAGES, rel), 'utf-8'), config)
    expect(out).toContain("from '@/lib/schema-form'") // schemaToFields, FieldDescriptor
    expect(out).toContain("from '@/lib/types'") // JsonSchema
  })

  it('maps tool-call ToolState symbols to tool-state.ts', () => {
    const rel = registry.components['mcp-tool-call'].files.react as string
    const out = transformImports(fs.readFileSync(path.join(PACKAGES, rel), 'utf-8'), config)
    expect(out).toContain("from '@/lib/tool-state'") // ToolStateApi, ToolStateSnapshot
  })
})
