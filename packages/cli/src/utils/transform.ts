import type { SnxConfig } from './detect.js'

// Maps each exported symbol to its source file (relative to utils dir)
const SYMBOL_TO_FILE: Record<string, string> = {
  // utils/cn.ts
  cn: 'cn',
  // utils/dom.ts
  trapFocus: 'dom',
  lockScroll: 'dom',
  createClickOutsideHandler: 'dom',
  getFocusableElements: 'dom',
  // utils/keyboard.ts
  Keys: 'keyboard',
  getNextIndex: 'keyboard',
  handleArrowNavigation: 'keyboard',
  KeyboardDirection: 'keyboard',
  // dialog
  createDialog: 'dialog',
  DialogConfig: 'dialog',
  // tabs
  createTabs: 'tabs',
  TabsConfig: 'tabs',
  TabItem: 'tabs',
  // accordion
  createAccordion: 'accordion',
  AccordionConfig: 'accordion',
  AccordionItemConfig: 'accordion',
  // select
  createSelect: 'select',
  SelectConfig: 'select',
  SelectOption: 'select',
  // tooltip
  createTooltip: 'tooltip',
  TooltipConfig: 'tooltip',
  // popover
  createPopover: 'popover',
  PopoverConfig: 'popover',
  // toast
  toast: 'toast',
  createToastManager: 'toast',
  Toast: 'toast',
  ToastConfig: 'toast',
  ToastState: 'toast',
  // drawer
  createDrawer: 'drawer',
  DrawerConfig: 'drawer',
  // dropdown-menu
  createDropdownMenu: 'dropdown-menu',
  DropdownMenuConfig: 'dropdown-menu',
  DropdownMenuItem: 'dropdown-menu',
  // switch
  createSwitch: 'switch',
  SwitchConfig: 'switch',
  // mcp/types.ts
  BaseMetadata: 'types',
  Icons: 'types',
  Implementation: 'types',
  ServerCapabilities: 'types',
  JsonSchema: 'types',
  Tool: 'types',
  Resource: 'types',
  Prompt: 'types',
  ContentBlock: 'types',
  CallToolResult: 'types',
  UiResource: 'types',
  ToolCallStatus: 'types',
  ScopeDescriptor: 'types',
  // mcp/tool-state.ts
  createToolState: 'tool-state',
  ToolStateSnapshot: 'tool-state',
  ToolStateApi: 'tool-state',
  // mcp/scope.ts
  parseScope: 'scope',
  parseScopes: 'scope',
  // mcp/schema-form.ts
  schemaToFields: 'schema-form',
  FieldKind: 'schema-form',
  FieldDescriptor: 'schema-form',
  // mcp/app-bridge.ts
  createAppBridge: 'app-bridge',
  encodeEnvelope: 'app-bridge',
  decodeEnvelope: 'app-bridge',
  AppBridge: 'app-bridge',
  AppBridgeConfig: 'app-bridge',
  AppMessageEnvelope: 'app-bridge',
  // mcp/oauth.ts
  createOAuthFlow: 'oauth',
  buildAuthUrl: 'oauth',
  buildTokenExchangeBody: 'oauth',
  buildTokenRefreshBody: 'oauth',
  OAuthFlowApi: 'oauth',
  OAuthFlowSnapshot: 'oauth',
  OAuthStatus: 'oauth',
  OAuthTokens: 'oauth',
  PkcePair: 'oauth',
  AuthUrlInput: 'oauth',
  TokenExchangeInput: 'oauth',
  TokenRefreshInput: 'oauth',
}

// Regex to match import statements from @mcp-elements/core
const CORE_IMPORT_RE = /import\s+(type\s+)?{([^}]+)}\s+from\s+['"]@mcp-elements\/core['"]/g

export function transformImports(content: string, config: SnxConfig): string {
  let result = content
  const utilsPath = config.aliases.utils

  // Collect all @mcp-elements/core imports and replace them
  result = result.replace(CORE_IMPORT_RE, (match, typeKeyword, symbolsStr) => {
    const isTypeOnly = !!typeKeyword
    const symbols = symbolsStr
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)

    // Group symbols by target file
    const groups: Record<string, { symbols: string[]; hasType: boolean }> = {}

    for (const sym of symbols) {
      // Handle "type Foo" within a value import
      const isInlineType = sym.startsWith('type ')
      const cleanSym = isInlineType ? sym.replace('type ', '') : sym
      const targetFile = SYMBOL_TO_FILE[cleanSym]

      if (!targetFile) {
        // Unknown symbol — keep it pointing to cn as fallback
        const file = 'cn'
        if (!groups[file]) groups[file] = { symbols: [], hasType: false }
        groups[file].symbols.push(sym)
        continue
      }

      if (!groups[targetFile]) groups[targetFile] = { symbols: [], hasType: false }
      if (isTypeOnly || isInlineType) {
        groups[targetFile].hasType = true
      }
      groups[targetFile].symbols.push(sym)
    }

    // Build replacement import statements
    const imports: string[] = []
    for (const [file, group] of Object.entries(groups)) {
      const allType = isTypeOnly || group.symbols.every(s => s.startsWith('type '))
      const keyword = allType ? 'import type' : 'import'
      imports.push(`${keyword} { ${group.symbols.join(', ')} } from '${utilsPath}/${file}'`)
    }

    return imports.join('\n')
  })

  // Transform relative hook imports to match component directory
  result = result.replace(
    /from ['"]\.\/hooks\//g,
    `from './`
  )

  // Collapse parent-directory component imports. MCP components live in a
  // `mcp/` subdir and import their base-component deps via `../button` etc.,
  // but the CLI copies every component flat into the same directory.
  result = result.replace(/from ['"]\.\.\//g, `from './`)

  return result
}
