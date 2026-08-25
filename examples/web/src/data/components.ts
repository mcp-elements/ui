export type ComponentCategory = 'Form' | 'Display' | 'Overlay' | 'Navigation' | 'Feedback' | 'AI' | 'MCP'
export type Framework = 'react' | 'angular' | 'vue'

export interface ComponentEntry {
  name: string
  slug: string
  category: ComponentCategory
  description: string
  frameworks: Framework[]
  isMcp?: boolean
  isNew?: boolean
}

export const COMPONENTS: ComponentEntry[] = [
  // Form
  { name: 'Button', slug: 'button', category: 'Form', description: 'Clickable action element with 6 variants and 4 sizes.', frameworks: ['react', 'angular'] },
  { name: 'Input', slug: 'input', category: 'Form', description: 'Text input with label, error state, and helper text.', frameworks: ['react', 'angular'] },
  { name: 'Textarea', slug: 'textarea', category: 'Form', description: 'Multi-line text input with auto-resize option.', frameworks: ['react', 'angular'] },
  { name: 'PasswordInput', slug: 'password-input', category: 'Form', description: 'Secure text input with show/hide toggle.', frameworks: ['react', 'angular'] },
  { name: 'Select', slug: 'select', category: 'Form', description: 'Dropdown select with search and custom options.', frameworks: ['react', 'angular'] },
  { name: 'Switch', slug: 'switch', category: 'Form', description: 'Toggle switch for boolean settings.', frameworks: ['react', 'angular'] },
  { name: 'Counter', slug: 'counter', category: 'Form', description: 'Numeric input with increment/decrement controls.', frameworks: ['react', 'angular'] },
  // Display
  { name: 'Badge', slug: 'badge', category: 'Display', description: 'Small label for status, counts, or categories.', frameworks: ['react', 'angular'] },
  { name: 'Card', slug: 'card', category: 'Display', description: 'Container with header, content, and footer slots.', frameworks: ['react', 'angular'] },
  { name: 'Avatar', slug: 'avatar', category: 'Display', description: 'User avatar with image, initials, or icon fallback.', frameworks: ['react', 'angular'] },
  { name: 'Separator', slug: 'separator', category: 'Display', description: 'Visual divider — horizontal or vertical.', frameworks: ['react', 'angular'] },
  { name: 'Skeleton', slug: 'skeleton', category: 'Display', description: 'Loading placeholder with shimmer animation.', frameworks: ['react', 'angular'] },
  { name: 'Progress', slug: 'progress', category: 'Display', description: 'Linear progress bar with animated fill.', frameworks: ['react', 'angular'] },
  { name: 'Loader', slug: 'loader', category: 'Display', description: 'Spinning loader indicator.', frameworks: ['react', 'angular'] },
  // Overlay
  { name: 'Dialog', slug: 'dialog', category: 'Overlay', description: 'Modal dialog with accessible focus trap.', frameworks: ['react', 'angular'] },
  { name: 'Tooltip', slug: 'tooltip', category: 'Overlay', description: 'Floating label on hover or focus.', frameworks: ['react', 'angular'] },
  { name: 'Popover', slug: 'popover', category: 'Overlay', description: 'Floating content panel anchored to a trigger.', frameworks: ['react', 'angular'] },
  { name: 'Toast', slug: 'toast', category: 'Overlay', description: 'Transient notification stack.', frameworks: ['react', 'angular'] },
  { name: 'Drawer', slug: 'drawer', category: 'Overlay', description: 'Side panel that slides in from the edge.', frameworks: ['react', 'angular'] },
  // Navigation
  { name: 'Tabs', slug: 'tabs', category: 'Navigation', description: 'Tabbed content switcher with keyboard navigation.', frameworks: ['react', 'angular'] },
  { name: 'Accordion', slug: 'accordion', category: 'Navigation', description: 'Collapsible content sections.', frameworks: ['react', 'angular'] },
  { name: 'DropdownMenu', slug: 'dropdown-menu', category: 'Navigation', description: 'Context menu with keyboard support.', frameworks: ['react', 'angular'] },
  // Feedback
  { name: 'Alert', slug: 'alert', category: 'Feedback', description: 'Inline message for info, success, warning, or error.', frameworks: ['react', 'angular'] },
  { name: 'Chips', slug: 'chips', category: 'Feedback', description: 'Compact tag/filter chips with close button.', frameworks: ['react', 'angular'] },
  // AI
  { name: 'PromptInput', slug: 'prompt-input', category: 'AI', description: 'Multi-line input with send button for AI chat.', frameworks: ['react', 'angular'] },
  { name: 'ChatBubble', slug: 'chat-bubble', category: 'AI', description: 'Message bubble for user and assistant turns.', frameworks: ['react', 'angular'] },
  { name: 'AiBadge', slug: 'ai-badge', category: 'AI', description: 'Animated AI-powered indicator badge.', frameworks: ['react', 'angular'] },
  { name: 'SuggestionChips', slug: 'suggestion-chips', category: 'AI', description: 'Row of clickable prompt suggestions.', frameworks: ['react', 'angular'] },
  { name: 'SourceCard', slug: 'source-card', category: 'AI', description: 'Citation card with title, URL, and snippet.', frameworks: ['react', 'angular'] },
  { name: 'StreamingText', slug: 'streaming-text', category: 'AI', description: 'Typewriter text for streaming AI responses.', frameworks: ['react', 'angular'] },
  { name: 'Feedback', slug: 'feedback', category: 'AI', description: 'Thumbs up/down rating for AI responses.', frameworks: ['react', 'angular'] },
  // MCP
  { name: 'McpToolCall', slug: 'mcp-tool-call', category: 'MCP', description: 'Tool execution card: idle → running → done/error with retry.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpToolForm', slug: 'mcp-tool-form', category: 'MCP', description: 'JSON Schema → dynamic form with validation.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpConsentDialog', slug: 'mcp-consent-dialog', category: 'MCP', description: 'OAuth consent UI: scope list, approve/deny.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpScopeInspector', slug: 'mcp-scope-inspector', category: 'MCP', description: 'Expandable scope tree with human-readable descriptions.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpResourceBrowser', slug: 'mcp-resource-browser', category: 'MCP', description: 'Browse MCP resources with type icons and preview.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpServerStatus', slug: 'mcp-server-status', category: 'MCP', description: 'Connection badge: connected/disconnected/error/reconnecting.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
  { name: 'McpAppFrame', slug: 'mcp-app-frame', category: 'MCP', description: 'MCP Apps (SEP-1865) host renderer: sandboxed iframe + JSON-RPC bridge.', frameworks: ['react', 'angular', 'vue'], isMcp: true, isNew: true },
]

export const CATEGORIES: ComponentCategory[] = ['MCP', 'AI', 'Form', 'Display', 'Overlay', 'Navigation', 'Feedback']

/** Base ("extras") categories — everything that isn't MCP or AI. */
export const EXTRA_CATEGORIES: ComponentCategory[] = ['Form', 'Display', 'Overlay', 'Navigation', 'Feedback']
export const FEATURED_CATEGORIES: ComponentCategory[] = ['MCP', 'AI']

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug)
}

export function getComponentsByCategory(category: ComponentCategory): ComponentEntry[] {
  return COMPONENTS.filter((c) => c.category === category)
}
