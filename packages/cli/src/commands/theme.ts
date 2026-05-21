import { Command } from 'commander'
import pc from 'picocolors'
import path from 'node:path'
import { loadConfig } from '../utils/detect.js'
import { writeFile, ensureDir } from '../utils/fs.js'
import { fetchFile } from '../utils/fetch.js'

export const themeCommand = new Command('theme')
  .description('Manage themes')
  .argument('<theme>', 'Theme to add (dark, glass)')
  .option('--local', 'Read files from local monorepo (dev only)', false)
  .action(async (theme: string, options) => {
    const cwd = process.cwd()
    const config = loadConfig(cwd)

    if (!config) {
      console.log(pc.red('\n  mcp-elements.json not found. Run `npx mcp-elements init` first.\n'))
      return
    }

    if (theme === 'dark') {
      console.log(pc.bold('\n  Dark theme\n'))
      console.log('  Dark theme tokens are already included in your base CSS.')
      console.log('  To activate dark mode, add this to your HTML:')
      console.log(pc.cyan('\n    <html data-theme="dark">'))
      console.log('\n  Or toggle with JavaScript:')
      console.log(pc.cyan("    document.documentElement.setAttribute('data-theme', 'dark')"))
      console.log()
    } else if (theme === 'glass') {
      console.log(pc.bold('\n  Glass theme\n'))

      try {
        const glassContent = await fetchFile('css/themes/glass.css', options.local)
        const cssDir = path.join(cwd, path.dirname(config.tailwind.css))
        await ensureDir(cssDir)
        const destPath = path.join(cssDir, 'glass.css')
        await writeFile(destPath, glassContent)

        console.log(pc.green(`  Created: ${path.relative(cwd, destPath)}`))
        console.log('\n  Import it in your main CSS file:')
        console.log(pc.cyan(`\n    @import './glass.css';`))
        console.log('\n  Then activate by adding to your HTML:')
        console.log(pc.cyan('\n    <html data-theme="glass">'))
        console.log('\n  Or toggle with JavaScript:')
        console.log(pc.cyan("    document.documentElement.setAttribute('data-theme', 'glass')"))
        console.log()
      } catch (err) {
        console.log(pc.red(`  Failed to fetch glass theme: ${(err as Error).message}\n`))
      }
    } else {
      console.log(pc.yellow(`\n  Theme "${theme}" is not available.`))
      console.log(`  Available themes: ${pc.cyan('dark')}, ${pc.cyan('glass')}\n`)
    }
  })
