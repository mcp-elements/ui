import { Command } from 'commander'
import prompts from 'prompts'
import pc from 'picocolors'
import { detectFramework } from '../utils/detect.js'
import { writeFile, ensureDir, fileExists } from '../utils/fs.js'
import path from 'node:path'
import fs from 'node:fs'

export const initCommand = new Command('init')
  .description('Initialize mcp-elements in your project')
  .action(async () => {
    console.log(pc.bold('\n  mcp-elements init\n'))

    const cwd = process.cwd()

    // Check if already initialized
    if (await fileExists(path.join(cwd, 'mcp-elements.json'))) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'mcp-elements.json already exists. Overwrite?',
        initial: false,
      })
      if (!overwrite) {
        console.log(pc.yellow('  Cancelled.'))
        return
      }
    }

    // Detect framework
    let framework = detectFramework(cwd)

    if (!framework) {
      const response = await prompts({
        type: 'select',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: [
          { title: 'React', value: 'react' },
          { title: 'Angular', value: 'angular' },
        ],
      })
      framework = response.framework
    } else {
      console.log(pc.green(`  Detected framework: ${framework}`))
    }

    if (!framework) {
      console.log(pc.red('  No framework selected. Aborting.'))
      return
    }

    // Ask for component directory
    const defaultComponentDir = framework === 'react'
      ? 'src/components/ui'
      : 'src/app/components/ui'

    const { componentDir, cssPath, typescript } = await prompts([
      {
        type: 'text',
        name: 'componentDir',
        message: 'Where should components be installed?',
        initial: defaultComponentDir,
      },
      {
        type: 'text',
        name: 'cssPath',
        message: 'Where is your global CSS file?',
        initial: framework === 'react' ? 'src/index.css' : 'src/styles.css',
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        initial: true,
      },
    ])

    // Create config
    const config = {
      $schema: 'https://mcp-elements.dev/schema.json',
      framework,
      typescript,
      tailwind: {
        css: cssPath,
        baseColor: 'zinc',
      },
      aliases: {
        components: componentDir,
        utils: framework === 'react' ? 'src/lib/utils' : 'src/app/lib/utils',
      },
    }

    // Write config file
    await writeFile(
      path.join(cwd, 'mcp-elements.json'),
      JSON.stringify(config, null, 2)
    )
    console.log(pc.green('  Created mcp-elements.json'))

    // Ensure component directory exists
    await ensureDir(path.join(cwd, componentDir))
    console.log(pc.green(`  Created ${componentDir}/`))

    // Ensure utils directory and create cn utility
    const utilsDir = config.aliases.utils
    await ensureDir(path.join(cwd, utilsDir))

    const ext = typescript ? '.ts' : '.js'
    const cnContent = `export function cn(...inputs${typescript ? ': (string | undefined | null | false)[]' : ''})${typescript ? ': string' : ''} {
  return inputs.filter(Boolean).join(' ')
}
`
    await writeFile(path.join(cwd, utilsDir, `cn${ext}`), cnContent)
    console.log(pc.green(`  Created ${utilsDir}/cn${ext}`))

    // Copy base CSS tokens
    const baseCssContent = `/* mcp-elements design tokens */
@import 'tailwindcss';

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0.042 265.755);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0.001 286.375);
  --color-secondary-foreground: oklch(0.205 0.042 265.755);
  --color-accent: oklch(0.97 0.001 286.375);
  --color-accent-foreground: oklch(0.205 0.042 265.755);
  --color-muted: oklch(0.97 0.001 286.375);
  --color-muted-foreground: oklch(0.556 0.019 286);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: oklch(0.922 0.004 286.32);
  --color-input: oklch(0.922 0.004 286.32);
  --color-ring: oklch(0.708 0.028 256);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);

  --radius-sm: 0.25rem;
  --radius-md: calc(var(--radius-sm) + 0.125rem);
  --radius-lg: calc(var(--radius-sm) + 0.25rem);
  --radius-xl: calc(var(--radius-sm) + 0.5rem);
}

@layer base {
  [data-theme='dark'] {
    --color-background: oklch(0.145 0 0);
    --color-foreground: oklch(0.985 0 0);
    --color-primary: oklch(0.985 0 0);
    --color-primary-foreground: oklch(0.205 0.042 265.755);
    --color-secondary: oklch(0.269 0.007 286.033);
    --color-secondary-foreground: oklch(0.985 0 0);
    --color-muted: oklch(0.269 0.007 286.033);
    --color-muted-foreground: oklch(0.708 0.014 285.823);
    --color-accent: oklch(0.269 0.007 286.033);
    --color-accent-foreground: oklch(0.985 0 0);
    --color-destructive: oklch(0.704 0.191 22.216);
    --color-border: oklch(0.269 0.007 286.033);
    --color-input: oklch(0.269 0.007 286.033);
    --color-ring: oklch(0.442 0.017 285.786);
    --color-card: oklch(0.145 0 0);
    --color-card-foreground: oklch(0.985 0 0);
    --color-popover: oklch(0.145 0 0);
    --color-popover-foreground: oklch(0.985 0 0);
  }
}
`

    const cssFullPath = path.join(cwd, cssPath)
    if (await fileExists(cssFullPath)) {
      const existing = fs.readFileSync(cssFullPath, 'utf-8')
      if (!existing.includes('mcp-elements design tokens')) {
        fs.writeFileSync(cssFullPath, baseCssContent + '\n' + existing)
        console.log(pc.green(`  Added design tokens to ${cssPath}`))
      } else {
        console.log(pc.yellow(`  Design tokens already exist in ${cssPath}`))
      }
    } else {
      await writeFile(cssFullPath, baseCssContent)
      console.log(pc.green(`  Created ${cssPath} with design tokens`))
    }

    console.log(pc.bold(pc.green('\n  mcp-elements initialized successfully!\n')))
    console.log(`  Run ${pc.cyan('npx mcp-elements add button')} to add your first component.\n`)
  })
