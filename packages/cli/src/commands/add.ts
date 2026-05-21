import { Command } from 'commander'
import pc from 'picocolors'
import path from 'node:path'
import fs from 'node:fs'
import prompts from 'prompts'
import { registry, resolveComponentDeps, resolveCoreDeps } from '../registry/resolve.js'
import { loadConfig } from '../utils/detect.js'
import { writeFile, ensureDir } from '../utils/fs.js'
import { transformImports } from '../utils/transform.js'
import { fetchFile } from '../utils/fetch.js'

export const addCommand = new Command('add')
  .description('Add components to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation', false)
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .option('--local', 'Read files from local monorepo (dev only)', false)
  .action(async (componentNames: string[], options) => {
    const cwd = process.cwd()
    const config = loadConfig(cwd)

    if (!config) {
      console.log(pc.red('\n  mcp-elements.json not found. Run `npx mcp-elements init` first.\n'))
      return
    }

    // Interactive picker when no args provided
    if (!componentNames || componentNames.length === 0) {
      const allComponents = Object.keys(registry.components)
      const response = await prompts({
        type: 'multiselect',
        name: 'selected',
        message: 'Which components would you like to add?',
        choices: allComponents.map(name => {
          const comp = registry.components[name]
          return {
            title: `${name} ${comp.type === 'css-only' ? pc.dim('(CSS)') : pc.cyan('(interactive)')}`,
            value: name,
          }
        }),
        hint: '- Space to select, Enter to confirm',
      })

      if (!response.selected || response.selected.length === 0) {
        console.log(pc.yellow('\n  No components selected.\n'))
        return
      }

      componentNames = response.selected
    }

    // Validate component names
    const invalid = componentNames.filter(name => !registry.components[name])
    if (invalid.length > 0) {
      console.log(pc.red(`\n  Unknown components: ${invalid.join(', ')}`))
      console.log(`  Run ${pc.cyan('npx mcp-elements list')} to see available components.\n`)
      return
    }

    // Resolve all dependencies
    const allComponents = new Set<string>()
    for (const name of componentNames) {
      const deps = resolveComponentDeps(name)
      for (const dep of deps) {
        allComponents.add(dep)
      }
      allComponents.add(name)
    }

    console.log(pc.bold(`\n  Adding ${allComponents.size} component(s):\n`))

    const isLocal = options.local

    // Track which coreDeps we've already copied
    const copiedCoreDeps = new Set<string>()

    for (const name of allComponents) {
      const component = registry.components[name]
      if (!component) continue

      console.log(`  ${pc.cyan(name)} ${component.type === 'css-only' ? '(CSS)' : '(interactive)'}`)

      const framework = config.framework as 'react' | 'angular'
      const componentDir = path.join(cwd, config.aliases.components)
      await ensureDir(componentDir)

      // Get the files to copy for this framework
      const files = component.files[framework]
      const cssFile = component.files.css
      const coreFile = component.files.core

      if (!files) {
        console.log(pc.yellow(`    Skipped: no ${framework} adapter`))
        continue
      }

      // Copy framework-specific files
      const filesToCopy = Array.isArray(files) ? files : [files]
      for (const file of filesToCopy) {
        const fileName = path.basename(file)
        const destPath = path.join(componentDir, fileName)

        if (fs.existsSync(destPath) && !options.overwrite) {
          console.log(pc.yellow(`    Skipped: ${fileName} (already exists, use --overwrite)`))
          continue
        }

        try {
          let content = await fetchFile(file, isLocal)
          content = transformImports(content, config)
          await writeFile(destPath, content)
          console.log(pc.green(`    Created: ${config.aliases.components}/${fileName}`))
        } catch (err) {
          console.log(pc.red(`    Failed: ${fileName} — ${(err as Error).message}`))
        }
      }

      // Copy core logic file if interactive
      if (coreFile && component.type === 'interactive') {
        const utilsDir = path.join(cwd, config.aliases.utils)
        await ensureDir(utilsDir)
        const coreFileName = path.basename(coreFile)
        const coreDest = path.join(utilsDir, coreFileName)

        if (!fs.existsSync(coreDest) || options.overwrite) {
          try {
            const coreContent = await fetchFile(coreFile, isLocal)
            await writeFile(coreDest, coreContent)
            console.log(pc.green(`    Created: ${config.aliases.utils}/${coreFileName}`))
          } catch (err) {
            console.log(pc.red(`    Failed: ${coreFileName} — ${(err as Error).message}`))
          }
        }

        // Copy coreDeps (dom.ts, keyboard.ts, etc.)
        const coreDeps = resolveCoreDeps(name)
        for (const dep of coreDeps) {
          if (copiedCoreDeps.has(dep)) continue
          copiedCoreDeps.add(dep)

          const depFileName = path.basename(dep)
          const depDest = path.join(utilsDir, depFileName)

          if (fs.existsSync(depDest) && !options.overwrite) continue

          try {
            const depContent = await fetchFile(dep, isLocal)
            await writeFile(depDest, depContent)
            console.log(pc.green(`    Created: ${config.aliases.utils}/${depFileName}`))
          } catch (err) {
            console.log(pc.red(`    Failed: ${depFileName} — ${(err as Error).message}`))
          }
        }
      }

      // Always copy shared coreDeps (cn.ts) for any component
      if (component.type === 'css-only') {
        const utilsDir = path.join(cwd, config.aliases.utils)
        await ensureDir(utilsDir)

        for (const dep of registry.meta.sharedCoreDeps) {
          if (copiedCoreDeps.has(dep)) continue
          copiedCoreDeps.add(dep)

          const depFileName = path.basename(dep)
          const depDest = path.join(utilsDir, depFileName)

          if (fs.existsSync(depDest) && !options.overwrite) continue

          try {
            const depContent = await fetchFile(dep, isLocal)
            await writeFile(depDest, depContent)
            console.log(pc.green(`    Created: ${config.aliases.utils}/${depFileName}`))
          } catch (err) {
            console.log(pc.red(`    Failed: ${depFileName} — ${(err as Error).message}`))
          }
        }
      }

      // Copy CSS file
      if (cssFile) {
        const cssDir = path.join(cwd, path.dirname(config.tailwind.css))
        const cssComponentsDir = path.join(cssDir, 'components')
        await ensureDir(cssComponentsDir)
        const cssFileName = path.basename(cssFile)
        const cssDest = path.join(cssComponentsDir, cssFileName)

        if (!fs.existsSync(cssDest) || options.overwrite) {
          try {
            const cssContent = await fetchFile(cssFile, isLocal)
            await writeFile(cssDest, cssContent)
            console.log(pc.green(`    Created: components/${cssFileName}`))
          } catch (err) {
            console.log(pc.red(`    Failed: ${cssFileName} — ${(err as Error).message}`))
          }
        }
      }
    }

    console.log(pc.bold(pc.green('\n  Done!\n')))
  })
