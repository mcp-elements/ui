import registryData from './registry.json' with { type: 'json' }

export interface ComponentEntry {
  name: string
  type: 'css-only' | 'interactive'
  category?: string
  tags?: string[]
  files: {
    css?: string
    core?: string
    react?: string | string[]
    angular?: string | string[]
    vue?: string | string[]
  }
  coreDeps?: string[]
  dependencies: {
    internal: string[]
    npm: Record<string, string[]>
  }
}

export interface RegistryMeta {
  baseUrl: string
  sharedCoreDeps: string[]
}

export interface Registry {
  meta: RegistryMeta
  components: Record<string, ComponentEntry>
}

export const registry = registryData as unknown as Registry

export function resolveComponentDeps(name: string, resolved = new Set<string>()): string[] {
  const component = registry.components[name]
  if (!component) return []

  for (const dep of component.dependencies.internal) {
    if (!resolved.has(dep)) {
      resolved.add(dep)
      resolveComponentDeps(dep, resolved)
    }
  }

  return Array.from(resolved)
}

export function resolveCoreDeps(name: string): string[] {
  const component = registry.components[name]
  if (!component) return []

  const deps = new Set<string>(registry.meta.sharedCoreDeps)

  if (component.coreDeps) {
    for (const dep of component.coreDeps) {
      deps.add(dep)
    }
  }

  return Array.from(deps)
}

export function getComponent(name: string): ComponentEntry | undefined {
  return registry.components[name]
}

export function listComponents(): string[] {
  return Object.keys(registry.components)
}
