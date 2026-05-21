import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { themeCommand } from './commands/theme.js'

const program = new Command()

program
  .name('mcp-elements')
  .description('Framework-agnostic UI components with shadcn-style CLI')
  .version('0.1.0')

program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(themeCommand)

// List command
program
  .command('list')
  .description('List all available components')
  .action(async () => {
    const { registry } = await import('./registry/resolve.js')
    const components = Object.keys(registry.components)
    console.log('\nAvailable components:\n')
    for (const name of components) {
      const comp = registry.components[name]
      const type = comp.type === 'css-only' ? '(CSS-only)' : '(interactive)'
      console.log(`  ${name} ${type}`)
    }
    console.log(`\nTotal: ${components.length} components\n`)
  })

program.parse()
