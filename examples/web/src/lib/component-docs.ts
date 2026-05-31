export interface PropRow {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface ComponentDoc {
  slug: string
  props: PropRow[]
  /** Code shown in the usage example */
  usage: string
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    slug: 'button',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'primary'", description: 'Visual style of the button' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: 'Size of the button' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is disabled' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
    ],
    usage: `import { Button } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`,
  },
  badge: {
    slug: 'badge',
    props: [
      { name: 'variant', type: "'default' | 'secondary' | 'outline' | 'destructive'", default: "'default'", description: 'Visual style of the badge' },
    ],
    usage: `import { Badge } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  )
}`,
  },
  input: {
    slug: 'input',
    props: [
      { name: 'label', type: 'string', description: 'Label text above the input' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'error', type: 'string', description: 'Error message shown below the input' },
      { name: 'helperText', type: 'string', description: 'Helper text shown below the input' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
    ],
    usage: `import { Input } from '@mcp-elements/react'

export function Example() {
  return (
    <Input
      label="Email address"
      placeholder="you@example.com"
      helperText="We'll never share your email."
    />
  )
}`,
  },
  dialog: {
    slug: 'dialog',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is open' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when open state should change' },
      { name: 'modal', type: 'boolean', default: 'true', description: 'Whether to trap focus inside the dialog' },
    ],
    usage: `import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to proceed?</p>
        <DialogFooter>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Confirm</button>
        </DialogFooter>
      </Dialog>
    </>
  )
}`,
  },
  'mcp-tool-call': {
    slug: 'mcp-tool-call',
    props: [
      { name: 'state', type: 'ToolStateApi', required: true, description: 'ToolStateApi instance from createToolState()' },
      { name: 'toolName', type: 'string', description: 'Fallback tool name when state.tool is undefined' },
      { name: 'args', type: 'Record<string, unknown>', description: 'Fallback args when state.args is undefined' },
      { name: 'onRetry', type: '() => void', description: 'Callback for the Retry button shown on error' },
    ],
    usage: `import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
state.start('search', { query: 'MCP protocol' })

export function Example() {
  return <McpToolCall state={state} />
}`,
  },
  'mcp-server-status': {
    slug: 'mcp-server-status',
    props: [
      { name: 'status', type: "'connected' | 'connecting' | 'disconnected' | 'error'", required: true, description: 'Connection state to display' },
      { name: 'serverName', type: 'string', description: 'Optional server name shown before the status label' },
    ],
    usage: `import { McpServerStatus } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex gap-3 flex-wrap">
      <McpServerStatus status="connected" serverName="github-mcp" />
      <McpServerStatus status="connecting" />
      <McpServerStatus status="disconnected" />
      <McpServerStatus status="error" />
    </div>
  )
}`,
  },
  'mcp-consent-dialog': {
    slug: 'mcp-consent-dialog',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is visible' },
      { name: 'serverName', type: 'string', required: true, description: 'Name of the MCP server requesting access' },
      { name: 'serverIcon', type: 'string', description: 'URL of the server icon image' },
      { name: 'scopes', type: 'string[]', required: true, description: 'Array of OAuth scope strings to display' },
      { name: 'onApprove', type: '() => void', required: true, description: 'Called when user clicks Allow' },
      { name: 'onDeny', type: '() => void', required: true, description: 'Called when user clicks Deny or closes the dialog' },
    ],
    usage: `import { McpConsentDialog } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [open, setOpen] = useState(true)
  return (
    <McpConsentDialog
      open={open}
      serverName="GitHub MCP"
      scopes={['repo:read', 'user.email:read']}
      onApprove={() => setOpen(false)}
      onDeny={() => setOpen(false)}
    />
  )
}`,
  },
  card: {
    slug: 'card',
    props: [
      { name: 'className', type: 'string', description: 'Additional CSS classes to apply to the card' },
      { name: 'children', type: 'React.ReactNode', description: 'Card content (use CardHeader, CardContent, CardFooter)' },
    ],
    usage: `import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@mcp-elements/react'

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card body content goes here.</p>
      </CardContent>
      <CardFooter>
        <button>Action</button>
      </CardFooter>
    </Card>
  )
}`,
  },
  alert: {
    slug: 'alert',
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Semantic style of the alert' },
      { name: 'title', type: 'string', description: 'Bold heading text' },
      { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close button to dismiss the alert' },
      { name: 'onDismiss', type: '() => void', description: 'Called when the dismiss button is clicked' },
    ],
    usage: `import { Alert } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Alert variant="info" title="Info">This is an informational alert.</Alert>
      <Alert variant="success" title="Success">Your changes have been saved.</Alert>
      <Alert variant="warning" title="Warning">This action cannot be undone.</Alert>
      <Alert variant="error" title="Error">Something went wrong. Please try again.</Alert>
    </div>
  )
}`,
  },
  tabs: {
    slug: 'tabs',
    props: [
      { name: 'defaultValue', type: 'string', description: 'The value of the tab selected by default' },
      { name: 'value', type: 'string', description: 'Controlled selected tab value' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected tab changes' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction of the tab list' },
    ],
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcp-elements/react'

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="usage">Usage content</TabsContent>
      <TabsContent value="props">Props content</TabsContent>
    </Tabs>
  )
}`,
  },
  skeleton: {
    slug: 'skeleton',
    props: [
      { name: 'className', type: 'string', description: 'CSS classes to control size and shape of the skeleton block' },
      { name: 'animate', type: 'boolean', default: 'true', description: 'Whether to show the shimmer animation' },
    ],
    usage: `import { Skeleton } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex flex-col gap-3 w-64">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
  )
}`,
  },
  'mcp-tool-form': {
    slug: 'mcp-tool-form',
    props: [
      { name: 'schema', type: 'JSONSchema7', required: true, description: 'JSON Schema object that drives the form fields' },
      { name: 'onSubmit', type: '(values: Record<string, unknown>) => void', required: true, description: 'Called with validated form values on submit' },
      { name: 'submitLabel', type: 'string', default: "'Run'", description: 'Label text for the submit button' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Disables the form and shows a spinner on the button' },
    ],
    usage: `import { McpToolForm } from '@mcp-elements/react'

const schema = {
  type: 'object',
  properties: {
    query: { type: 'string', description: 'Search query' },
    limit: { type: 'number', default: 10, description: 'Max results' },
  },
  required: ['query'],
}

export function Example() {
  return (
    <McpToolForm
      schema={schema}
      onSubmit={(values) => console.log(values)}
      submitLabel="Search"
    />
  )
}`,
  },
  'mcp-scope-inspector': {
    slug: 'mcp-scope-inspector',
    props: [
      { name: 'scopes', type: 'ScopeDescriptor[]', required: true, description: 'Array of scope descriptor objects to display' },
      { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Whether all scope groups are expanded by default' },
    ],
    usage: `import { McpScopeInspector } from '@mcp-elements/react'

const scopes = [
  { id: 'repo:read', label: 'Read repositories', description: 'List and read repository contents', risk: 'low' },
  { id: 'repo:write', label: 'Write repositories', description: 'Create and modify files', risk: 'high' },
]

export function Example() {
  return <McpScopeInspector scopes={scopes} defaultExpanded />
}`,
  },
  'mcp-resource-browser': {
    slug: 'mcp-resource-browser',
    props: [
      { name: 'resources', type: 'McpResource[]', required: true, description: 'List of MCP resource objects to display' },
      { name: 'onSelect', type: '(resource: McpResource) => void', description: 'Called when user clicks a resource row' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows skeleton loading rows' },
    ],
    usage: `import { McpResourceBrowser } from '@mcp-elements/react'

const resources = [
  { uri: 'file:///src/index.ts', name: 'index.ts', mimeType: 'text/typescript' },
  { uri: 'file:///README.md', name: 'README.md', mimeType: 'text/markdown' },
]

export function Example() {
  return (
    <McpResourceBrowser
      resources={resources}
      onSelect={(r) => console.log('selected', r.uri)}
    />
  )
}`,
  },
  'mcp-app-frame': {
    slug: 'mcp-app-frame',
    props: [
      { name: 'src', type: 'string', required: true, description: 'URL of the MCP App to load in the sandboxed iframe' },
      { name: 'onMessage', type: '(event: MessageEvent) => void', description: 'Called when the embedded app sends a postMessage' },
      { name: 'height', type: 'string | number', default: '480', description: 'Height of the iframe in pixels or CSS value' },
      { name: 'title', type: 'string', required: true, description: 'Accessible title for the iframe element' },
    ],
    usage: `import { McpAppFrame } from '@mcp-elements/react'

export function Example() {
  return (
    <McpAppFrame
      src="https://my-mcp-app.example.com"
      title="My MCP App"
      height={600}
      onMessage={(e) => console.log('app message', e.data)}
    />
  )
}`,
  },
  'ai-badge': {
    slug: 'ai-badge',
    props: [
      { name: 'variant', type: "'default' | 'prominent' | 'subtle'", default: "'default'", description: 'Visual style of the badge' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Whether to show the sparkle icon' },
      { name: 'children', type: 'React.ReactNode', description: 'Label text displayed inside the badge' },
    ],
    usage: `import { AiBadge } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <AiBadge>AI</AiBadge>
      <AiBadge variant="prominent">AI Generated</AiBadge>
      <AiBadge variant="subtle" showIcon={false}>Beta</AiBadge>
    </div>
  )
}`,
  },
  'chat-bubble': {
    slug: 'chat-bubble',
    props: [
      { name: 'variant', type: "'user' | 'ai'", default: "'ai'", description: 'Which side and style the bubble renders on' },
      { name: 'children', type: 'React.ReactNode', description: 'Use ChatBubbleContent, ChatBubbleTimestamp, ChatBubbleAvatar as children' },
      { name: 'src (ChatBubbleAvatar)', type: 'string', required: true, description: 'Image URL for the avatar' },
      { name: 'alt (ChatBubbleAvatar)', type: 'string', required: true, description: 'Alt text for the avatar image' },
    ],
    usage: `import { ChatBubble, ChatBubbleAvatar, ChatBubbleContent, ChatBubbleTimestamp } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ChatBubble variant="user">
        <ChatBubbleContent>How do I add a component?</ChatBubbleContent>
        <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
      </ChatBubble>
      <ChatBubble variant="ai">
        <ChatBubbleAvatar src="/avatar.png" alt="Assistant" />
        <ChatBubbleContent>Run \`npx mcp-elements add button\`.</ChatBubbleContent>
        <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
      </ChatBubble>
    </div>
  )
}`,
  },
  'suggestion-chips': {
    slug: 'suggestion-chips',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'SuggestionChip elements to render' },
      { name: 'variant (SuggestionChip)', type: "'default' | 'primary' | 'outline'", default: "'default'", description: 'Visual style of an individual chip' },
    ],
    usage: `import { SuggestionChips, SuggestionChip } from '@mcp-elements/react'

export function Example() {
  return (
    <SuggestionChips>
      <SuggestionChip>Summarize this</SuggestionChip>
      <SuggestionChip variant="primary">Write tests</SuggestionChip>
      <SuggestionChip variant="outline">Explain the error</SuggestionChip>
    </SuggestionChips>
  )
}`,
  },
  'source-card': {
    slug: 'source-card',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Title of the source document or page' },
      { name: 'domain', type: 'string', required: true, description: 'Domain name shown below the title' },
      { name: 'href', type: 'string', description: 'URL the card links to (opens in new tab)' },
      { name: 'favicon', type: 'string', description: 'URL of the site favicon image' },
      { name: 'index', type: 'number', description: 'Numeric citation index shown on the card' },
    ],
    usage: `import { SourceCards, SourceCard } from '@mcp-elements/react'

export function Example() {
  return (
    <SourceCards>
      <SourceCard
        index={1}
        title="Model Context Protocol"
        domain="modelcontextprotocol.io"
        href="https://modelcontextprotocol.io"
      />
      <SourceCard
        index={2}
        title="mcp-elements docs"
        domain="mcp-elements.dev"
        href="https://mcp-elements.dev"
      />
    </SourceCards>
  )
}`,
  },
  'streaming-text': {
    slug: 'streaming-text',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'Text or elements to display with the streaming cursor effect' },
      { name: 'className', type: 'string', description: 'Additional CSS classes for the container div' },
    ],
    usage: `import { StreamingText } from '@mcp-elements/react'

export function Example() {
  return (
    <StreamingText>
      Streaming a response token by token, just like an LLM would render it in real time.
    </StreamingText>
  )
}`,
  },
  feedback: {
    slug: 'feedback',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'FeedbackButton elements and optional separators' },
      { name: 'type (FeedbackButton)', type: "'up' | 'down'", required: true, description: 'Whether the button is a thumbs-up or thumbs-down' },
      { name: 'selected (FeedbackButton)', type: 'boolean', default: 'false', description: 'Whether the button is in the selected/active state' },
    ],
    usage: `import { Feedback, FeedbackButton } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [sel, setSel] = useState<'up' | 'down' | null>(null)
  return (
    <Feedback>
      <FeedbackButton type="up" selected={sel === 'up'} onClick={() => setSel('up')} aria-label="Thumbs up" />
      <FeedbackButton type="down" selected={sel === 'down'} onClick={() => setSel('down')} aria-label="Thumbs down" />
    </Feedback>
  )
}`,
  },
  'prompt-input': {
    slug: 'prompt-input',
    props: [
      { name: 'children', type: 'React.ReactNode', description: 'Use PromptInputTextarea, PromptInputFooter, PromptInputActions as children' },
      { name: 'placeholder (PromptInputTextarea)', type: 'string', description: 'Placeholder text for the textarea' },
      { name: 'value (PromptInputTextarea)', type: 'string', description: 'Controlled value of the textarea' },
      { name: 'onChange (PromptInputTextarea)', type: 'React.ChangeEventHandler<HTMLTextAreaElement>', description: 'Change handler for the textarea' },
      { name: 'count (PromptInputCharCount)', type: 'number', required: true, description: 'Current character count to display' },
      { name: 'max (PromptInputCharCount)', type: 'number', description: 'Maximum allowed characters; renders count/max when provided' },
    ],
    usage: `import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputActions, PromptInputCharCount } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [value, setValue] = useState('')
  return (
    <PromptInput>
      <PromptInputTextarea
        placeholder="Ask anything…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
      />
      <PromptInputFooter>
        <PromptInputCharCount count={value.length} max={2000} />
        <PromptInputActions>
          <button disabled={!value.trim()}>Send</button>
        </PromptInputActions>
      </PromptInputFooter>
    </PromptInput>
  )
}`,
  },
}

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS[slug]
}
