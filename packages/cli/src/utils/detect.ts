import fs from 'node:fs'
import path from 'node:path'

export interface SnxConfig {
  $schema?: string
  framework: string
  typescript: boolean
  tailwind: {
    css: string
    baseColor: string
  }
  aliases: {
    components: string
    utils: string
  }
}

export function detectFramework(cwd: string): string | null {
  const pkgPath = path.join(cwd, 'package.json')

  if (!fs.existsSync(pkgPath)) return null

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }

    if (allDeps['@angular/core']) return 'angular'
    if (allDeps['react']) return 'react'
    if (allDeps['vue']) return 'vue'

    return null
  } catch {
    return null
  }
}

export function loadConfig(cwd: string): SnxConfig | null {
  const configPath = path.join(cwd, 'mcp-elements.json')

  if (!fs.existsSync(configPath)) return null

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as SnxConfig
  } catch {
    return null
  }
}
