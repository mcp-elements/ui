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
    const pc = (await import('picocolors')).default
    const { registry } = await import('./registry/resolve.js')
    const allNames = Object.keys(registry.components)

    // Split into MCP-native (category/tag = 'mcp') vs extras
    const mcpNames = allNames.filter((name) => {
      const comp = registry.components[name]
      return (
        (comp as { category?: string }).category === 'mcp' ||
        ((comp as { tags?: string[] }).tags ?? []).includes('mcp') ||
        name.startsWith('mcp-')
      )
    })
    const extraNames = allNames.filter((name) => !mcpNames.includes(name))

    function printGroup(names: string[]) {
      for (const name of names) {
        const comp = registry.components[name]
        const type = comp.type === 'css-only' ? pc.dim('(CSS-only)') : pc.cyan('(interactive)')
        console.log(`  ${pc.bold(name)} ${type}`)
      }
    }

    if (mcpNames.length > 0) {
      console.log('\n' + pc.bold(pc.magenta('MCP-native')) + '\n')
      printGroup(mcpNames)
    }

    if (extraNames.length > 0) {
      console.log('\n' + pc.bold('Extras') + pc.dim(' — base UI primitives') + '\n')
      printGroup(extraNames)
    }

    console.log(`\nTotal: ${allNames.length} component${allNames.length !== 1 ? 's' : ''}`)
    if (mcpNames.length > 0) {
      console.log(pc.dim(`  ${mcpNames.length} MCP-native  ·  ${extraNames.length} extras`))
    }
    console.log()
  })

program.parse()
