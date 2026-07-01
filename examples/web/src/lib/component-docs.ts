export interface PropRow {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export type DocFramework = 'react' | 'angular' | 'vue'

/** A plain string is a React-only example; an object renders per-framework tabs. */
export type UsageExamples = string | Partial<Record<DocFramework, string>>

export interface ComponentDoc {
  slug: string
  props: PropRow[]
  /** Code shown in the usage example */
  usage: UsageExamples
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
      { name: 'type', type: 'string', default: "'text'", description: 'HTML input type (text, email, password, number, etc.)' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'value', type: 'string', description: 'Controlled value of the input' },
      { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled' },
      { name: 'onChange', type: '(e: React.ChangeEvent<HTMLInputElement>) => void', description: 'Called when the value changes' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
      { name: 'className', type: 'string', description: 'Additional classes merged onto the input' },
    ],
    usage: `import { Input } from '@mcp-elements/react'

export function Example() {
  return (
    <Input type="email" placeholder="you@example.com" />
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
    usage: {
      react: `import { McpToolCall } from '@mcp-elements/react'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
state.start({ tool: 'search', args: { query: 'MCP protocol' } })

export function Example() {
  return <McpToolCall state={state} onRetry={() => state.reset()} />
}`,
      angular: `import { Component } from '@angular/core'
import { McpeMcpToolCallComponent } from '@mcp-elements/angular'
import { createToolState } from '@mcp-elements/core'

@Component({
  selector: 'app-tool-call-example',
  standalone: true,
  imports: [McpeMcpToolCallComponent],
  template: \`<mcpe-mcp-tool-call [state]="state" (onRetry)="onRetry()" />\`,
})
export class ToolCallExampleComponent {
  state = createToolState()
  constructor() {
    this.state.start({ tool: 'search', args: { query: 'MCP protocol' } })
  }
  onRetry() {
    this.state.reset()
    this.state.start({ tool: 'search', args: { query: 'MCP protocol' } })
  }
}`,
      vue: `<script setup lang="ts">
import { McpeMcpToolCall } from '@mcp-elements/vue'
import { createToolState } from '@mcp-elements/core'

const state = createToolState()
state.start({ tool: 'search', args: { query: 'MCP protocol' } })

function onRetry() {
  state.reset()
  state.start({ tool: 'search', args: { query: 'MCP protocol' } })
}
</script>

<template>
  <McpeMcpToolCall :state="state" @retry="onRetry" />
</template>`,
    },
  },
  'mcp-server-status': {
    slug: 'mcp-server-status',
    props: [
      { name: 'status', type: "'connected' | 'connecting' | 'disconnected' | 'error'", required: true, description: 'Connection state to display' },
      { name: 'serverName', type: 'string', description: 'Optional server name shown before the status label' },
    ],
    usage: {
      react: `import { McpServerStatus } from '@mcp-elements/react'

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
      angular: `import { Component } from '@angular/core'
import { McpeMcpServerStatusComponent } from '@mcp-elements/angular'

@Component({
  selector: 'app-server-status-example',
  standalone: true,
  imports: [McpeMcpServerStatusComponent],
  template: \`
    <div class="flex gap-3 flex-wrap">
      <mcpe-mcp-server-status status="connected" serverName="github-mcp" />
      <mcpe-mcp-server-status status="connecting" />
      <mcpe-mcp-server-status status="disconnected" />
      <mcpe-mcp-server-status status="error" />
    </div>
  \`,
})
export class ServerStatusExampleComponent {}`,
      vue: `<script setup lang="ts">
import { McpeMcpServerStatus } from '@mcp-elements/vue'
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <McpeMcpServerStatus status="connected" server-name="github-mcp" />
    <McpeMcpServerStatus status="connecting" />
    <McpeMcpServerStatus status="disconnected" />
    <McpeMcpServerStatus status="error" />
  </div>
</template>`,
    },
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
    usage: {
      react: `import { McpConsentDialog } from '@mcp-elements/react'
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
      angular: `import { Component, signal } from '@angular/core'
import { McpeMcpConsentDialogComponent } from '@mcp-elements/angular'

@Component({
  selector: 'app-consent-dialog-example',
  standalone: true,
  imports: [McpeMcpConsentDialogComponent],
  template: \`
    <mcpe-mcp-consent-dialog
      [open]="open()"
      serverName="GitHub MCP"
      [scopes]="['repo:read', 'user.email:read']"
      (onApprove)="open.set(false)"
      (onDeny)="open.set(false)"
    />
  \`,
})
export class ConsentDialogExampleComponent {
  open = signal(true)
}`,
      vue: `<script setup lang="ts">
import { ref } from 'vue'
import { McpeMcpConsentDialog } from '@mcp-elements/vue'

const open = ref(true)
</script>

<template>
  <McpeMcpConsentDialog
    :open="open"
    server-name="GitHub MCP"
    :scopes="['repo:read', 'user.email:read']"
    @approve="open = false"
    @deny="open = false"
  />
</template>`,
    },
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
      { name: 'schema', type: 'JsonSchema', required: true, description: 'JSON Schema object that drives the form fields' },
      { name: 'onSubmit', type: '(values: Record<string, unknown>) => void', required: true, description: 'Called with validated form values on submit' },
      { name: 'submitLabel', type: 'string', default: "'Run'", description: 'Label text for the submit button' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Disables the form and shows a spinner on the button' },
    ],
    usage: {
      react: `import { McpToolForm } from '@mcp-elements/react'

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
      angular: `import { Component } from '@angular/core'
import { McpeMcpToolFormComponent } from '@mcp-elements/angular'
import type { JsonSchema } from '@mcp-elements/core'

@Component({
  selector: 'app-tool-form-example',
  standalone: true,
  imports: [McpeMcpToolFormComponent],
  template: \`<mcpe-mcp-tool-form [schema]="schema" submitLabel="Search" (onSubmit)="run($event)" />\`,
})
export class ToolFormExampleComponent {
  schema: JsonSchema = {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'number', default: 10, description: 'Max results' },
    },
    required: ['query'],
  }
  run(values: Record<string, unknown>) {
    console.log(values)
  }
}`,
      vue: `<script setup lang="ts">
import { McpeMcpToolForm } from '@mcp-elements/vue'
import type { JsonSchema } from '@mcp-elements/core'

const schema: JsonSchema = {
  type: 'object',
  properties: {
    query: { type: 'string', description: 'Search query' },
    limit: { type: 'number', default: 10, description: 'Max results' },
  },
  required: ['query'],
}

function run(values: Record<string, unknown>) {
  console.log(values)
}
</script>

<template>
  <McpeMcpToolForm :schema="schema" submit-label="Search" @submit="run" />
</template>`,
    },
  },
  'mcp-scope-inspector': {
    slug: 'mcp-scope-inspector',
    props: [
      { name: 'scopes', type: 'string | ScopeDescriptor[]', required: true, description: 'Space-separated scope string (e.g. "repo:read repo:write") or pre-parsed ScopeDescriptor[]' },
      { name: 'descriptions', type: 'Record<string, string>', description: 'Human-readable descriptions keyed by raw scope or resource' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
    usage: {
      react: `import { McpScopeInspector } from '@mcp-elements/react'

const descriptions = {
  'repo:read': 'List and read repository contents',
  'repo:write': 'Create and modify files',
}

export function Example() {
  return <McpScopeInspector scopes="repo:read repo:write" descriptions={descriptions} />
}`,
      angular: `import { Component } from '@angular/core'
import { McpeMcpScopeInspectorComponent } from '@mcp-elements/angular'

@Component({
  selector: 'app-scope-inspector-example',
  standalone: true,
  imports: [McpeMcpScopeInspectorComponent],
  template: \`<mcpe-mcp-scope-inspector scopes="repo:read repo:write" [descriptions]="descriptions" />\`,
})
export class ScopeInspectorExampleComponent {
  descriptions: Record<string, string> = {
    'repo:read': 'List and read repository contents',
    'repo:write': 'Create and modify files',
  }
}`,
      vue: `<script setup lang="ts">
import { McpeMcpScopeInspector } from '@mcp-elements/vue'

const descriptions: Record<string, string> = {
  'repo:read': 'List and read repository contents',
  'repo:write': 'Create and modify files',
}
</script>

<template>
  <McpeMcpScopeInspector scopes="repo:read repo:write" :descriptions="descriptions" />
</template>`,
    },
  },
  'mcp-resource-browser': {
    slug: 'mcp-resource-browser',
    props: [
      { name: 'resources', type: 'McpResource[]', required: true, description: 'List of MCP resource objects to display' },
      { name: 'onSelect', type: '(resource: McpResource) => void', description: 'Called when user clicks a resource row' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows skeleton loading rows' },
    ],
    usage: {
      react: `import { McpResourceBrowser } from '@mcp-elements/react'

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
      angular: `import { Component } from '@angular/core'
import { McpeMcpResourceBrowserComponent, type McpResource } from '@mcp-elements/angular'

@Component({
  selector: 'app-resource-browser-example',
  standalone: true,
  imports: [McpeMcpResourceBrowserComponent],
  template: \`<mcpe-mcp-resource-browser [resources]="resources" (onSelect)="select($event)" />\`,
})
export class ResourceBrowserExampleComponent {
  resources: McpResource[] = [
    { uri: 'file:///src/index.ts', name: 'index.ts', mimeType: 'text/typescript' },
    { uri: 'file:///README.md', name: 'README.md', mimeType: 'text/markdown' },
  ]
  select(r: McpResource) {
    console.log('selected', r.uri)
  }
}`,
      vue: `<script setup lang="ts">
import { McpeMcpResourceBrowser, type McpResource } from '@mcp-elements/vue'

const resources: McpResource[] = [
  { uri: 'file:///src/index.ts', name: 'index.ts', mimeType: 'text/typescript' },
  { uri: 'file:///README.md', name: 'README.md', mimeType: 'text/markdown' },
]

function select(r: McpResource) {
  console.log('selected', r.uri)
}
</script>

<template>
  <McpeMcpResourceBrowser :resources="resources" @select="select" />
</template>`,
    },
  },
  'mcp-app-frame': {
    slug: 'mcp-app-frame',
    props: [
      { name: 'src', type: 'string', required: true, description: 'URL of the MCP App to load in the sandboxed iframe' },
      { name: 'onMessage', type: '(envelope: AppMessageEnvelope) => void', description: 'Called with a decoded envelope when the embedded app sends a message' },
      { name: 'height', type: 'number', default: '480', description: 'Height of the iframe in pixels' },
      { name: 'sandbox', type: 'string', default: "'allow-scripts allow-same-origin'", description: 'iframe sandbox flags' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
    usage: {
      react: `import { McpAppFrame } from '@mcp-elements/react'
import type { AppMessageEnvelope } from '@mcp-elements/core'

export function Example() {
  return (
    <McpAppFrame
      src="https://my-mcp-app.example.com"
      height={600}
      onMessage={(env: AppMessageEnvelope) => console.log('app message', env)}
    />
  )
}`,
      angular: `import { Component } from '@angular/core'
import { McpeMcpAppFrameComponent } from '@mcp-elements/angular'
import type { AppMessageEnvelope } from '@mcp-elements/core'

@Component({
  selector: 'app-app-frame-example',
  standalone: true,
  imports: [McpeMcpAppFrameComponent],
  template: \`<mcpe-mcp-app-frame src="https://my-mcp-app.example.com" [height]="600" (onMessage)="onMessage($event)" />\`,
})
export class AppFrameExampleComponent {
  onMessage(env: AppMessageEnvelope) {
    console.log('app message', env)
  }
}`,
      vue: `<script setup lang="ts">
import { McpeMcpAppFrame } from '@mcp-elements/vue'
import type { AppMessageEnvelope } from '@mcp-elements/core'

function onMessage(env: AppMessageEnvelope) {
  console.log('app message', env)
}
</script>

<template>
  <McpeMcpAppFrame src="https://my-mcp-app.example.com" :height="600" @message="onMessage" />
</template>`,
    },
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
        domain="mcp-elements.wearesnx.studio"
        href="https://mcp-elements.wearesnx.studio"
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
  accordion: {
    slug: 'accordion',
    props: [
      { name: 'items', type: 'AccordionItemConfig[]', required: true, description: 'Item configs, each with a unique `value` and optional `disabled` flag' },
      { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Whether one or multiple items can be expanded at once' },
      { name: 'collapsible', type: 'boolean', default: 'false', description: 'In single mode, allow collapsing the open item by clicking it again' },
      { name: 'children', type: '(api: ReturnType<typeof useAccordion>) => React.ReactNode', required: true, description: 'Render prop receiving the accordion API (expandedValues, getTriggerProps, getContentProps, etc.)' },
      { name: 'className', type: 'string', description: 'Additional CSS classes for the wrapper' },
    ],
    usage: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@mcp-elements/react'

const items = [
  { value: 'transport' },
  { value: 'auth' },
  { value: 'tools' },
]

export function Example() {
  return (
    <Accordion items={items} collapsible className="w-full max-w-md">
      {({ expandedValues, getTriggerProps, getContentProps }) => (
        <>
          {items.map((item) => (
            <AccordionItem key={item.value}>
              <AccordionTrigger
                {...getTriggerProps(item.value, expandedValues)}
                isExpanded={expandedValues.includes(item.value)}
              >
                {item.value}
              </AccordionTrigger>
              <AccordionContent {...getContentProps(item.value, expandedValues)}>
                Configuration details for {item.value}.
              </AccordionContent>
            </AccordionItem>
          ))}
        </>
      )}
    </Accordion>
  )
}`,
  },
  avatar: {
    slug: 'avatar',
    props: [
      { name: 'src', type: 'string', description: 'Image URL; falls back to `fallback` text if it fails to load' },
      { name: 'alt', type: 'string', description: 'Alt text for the avatar image' },
      { name: 'fallback', type: 'string', description: 'Text (usually initials) shown when there is no image or it fails to load' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
    usage: `import { Avatar } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="https://github.com/anthropics.png" alt="Anthropic" fallback="AN" />
      <Avatar fallback="MB" />
    </div>
  )
}`,
  },
  chips: {
    slug: 'chips',
    props: [
      { name: 'variant', type: "'default' | 'primary' | 'outline' | 'destructive'", default: "'default'", description: 'Visual style of the chip (Chip prop)' },
      { name: 'onRemove', type: '() => void', description: 'When provided, renders a remove button; called when it is clicked (Chip prop)' },
      { name: 'className', type: 'string', description: 'Additional CSS classes (Chip and Chips)' },
    ],
    usage: `import { Chip, Chips } from '@mcp-elements/react'

export function Example() {
  return (
    <Chips>
      <Chip>read</Chip>
      <Chip variant="primary">write</Chip>
      <Chip variant="outline" onRemove={() => {}}>tools:list</Chip>
      <Chip variant="destructive">admin</Chip>
    </Chips>
  )
}`,
  },
  counter: {
    slug: 'counter',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Current numeric value (controlled)' },
      { name: 'onChange', type: '(value: number) => void', required: true, description: 'Called with the next value when incremented, decremented, or typed' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value' },
      { name: 'max', type: 'number', default: '99', description: 'Maximum allowed value' },
      { name: 'step', type: 'number', default: '1', description: 'Amount added or removed per increment/decrement' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the counter is disabled' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' },
    ],
    usage: `import { useState } from 'react'
import { Counter } from '@mcp-elements/react'

export function Example() {
  const [value, setValue] = useState(4)
  return <Counter value={value} onChange={setValue} min={1} max={20} />
}`,
  },
  drawer: {
    slug: 'drawer',
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state. Omit to use the internal useDrawer state' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state should change (overlay click, Escape, close button)' },
      { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Edge the drawer slides in from' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Drawer content, typically DrawerHeader / DrawerBody / DrawerFooter' },
    ],
    usage: `import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter, Button } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Configure server</Button>
      <Drawer open={open} onOpenChange={setOpen} side="right">
        <DrawerHeader>
          <DrawerTitle>Server settings</DrawerTitle>
          <DrawerDescription>Edit connection details for filesystem-mcp.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>Endpoint, scopes, and environment variables go here.</DrawerBody>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}`,
  },
  'dropdown-menu': {
    slug: 'dropdown-menu',
    props: [
      { name: 'trigger', type: 'React.ReactNode', required: true, description: 'Element that toggles the menu when clicked' },
      { name: 'items', type: 'DropdownMenuItem[]', required: true, description: 'Menu entries. Each item has an id and label, plus optional type ("item" | "separator" | "label"), shortcut, disabled, and onSelect' },
      { name: 'align', type: "'start' | 'end'", default: "'end'", description: 'Horizontal alignment of the menu relative to the trigger' },
      { name: 'className', type: 'string', description: 'Extra classes applied to the menu content container' },
    ],
    usage: `import { DropdownMenu, Button } from '@mcp-elements/react'

export function Example() {
  return (
    <DropdownMenu
      trigger={<Button variant="outline">Actions</Button>}
      align="start"
      items={[
        { id: 'label', type: 'label', label: 'filesystem-mcp' },
        { id: 'restart', label: 'Restart server', shortcut: '⌘R', onSelect: () => {} },
        { id: 'logs', label: 'View logs', onSelect: () => {} },
        { id: 'sep', type: 'separator', label: '' },
        { id: 'remove', label: 'Remove', onSelect: () => {} },
      ]}
    />
  )
}`,
  },
  loader: {
    slug: 'loader',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter of the spinner' },
      { name: 'variant', type: "'primary' | 'muted'", default: "'primary'", description: 'Color treatment of the spinner' },
    ],
    usage: `import { Loader } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" variant="muted" />
    </div>
  )
}`,
  },
  'password-input': {
    slug: 'password-input',
    props: [
      { name: 'placeholder', type: 'string', description: 'Placeholder text shown in the field' },
      { name: 'value', type: 'string', description: 'Controlled value of the input' },
      { name: 'defaultValue', type: 'string', description: 'Initial value for an uncontrolled input' },
      { name: 'onChange', type: '(e: React.ChangeEvent<HTMLInputElement>) => void', description: 'Change handler for the underlying input' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
    ],
    usage: `import { PasswordInput } from '@mcp-elements/react'

export function Example() {
  return <PasswordInput placeholder="Enter API key" />
}`,
  },
  popover: {
    slug: 'popover',
    props: [
      { name: 'trigger', type: 'React.ReactNode', required: true, description: 'Element that toggles the popover open when clicked' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Content rendered inside the popover panel' },
      { name: 'className', type: 'string', description: 'Additional classes for the popover content panel' },
    ],
    usage: `import { Popover, Button } from '@mcp-elements/react'

export function Example() {
  return (
    <Popover trigger={<Button variant="outline">Connection info</Button>}>
      <div className="space-y-1">
        <p className="text-sm font-medium">github-mcp</p>
        <p className="text-xs text-muted-foreground">
          Connected over stdio · 14 tools exposed
        </p>
      </div>
    </Popover>
  )
}`,
  },
  progress: {
    slug: 'progress',
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Current progress value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value representing 100% complete' },
      { name: 'className', type: 'string', description: 'Additional classes for the progress track' },
    ],
    usage: `import { Progress } from '@mcp-elements/react'

export function Example() {
  return (
    <Progress value={64} max={100} className="w-full" />
  )
}`,
  },
  select: {
    slug: 'select',
    props: [
      { name: 'options', type: 'SelectOption[]', required: true, description: 'List of selectable options ({ value, label, disabled? })' },
      { name: 'placeholder', type: 'string', default: "'Select...'", description: 'Text shown when no option is selected' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with the value when a selection is made' },
      { name: 'className', type: 'string', description: 'Additional classes for the select container' },
    ],
    usage: `import { Select } from '@mcp-elements/react'

export function Example() {
  return (
    <Select
      placeholder="Choose a tool"
      options={[
        { value: 'search_code', label: 'search_code' },
        { value: 'create_issue', label: 'create_issue' },
        { value: 'run_query', label: 'run_query', disabled: true },
      ]}
      onChange={(value) => console.log(value)}
    />
  )
}`,
  },
  separator: {
    slug: 'separator',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Axis the separator is drawn along' },
      { name: 'className', type: 'string', description: 'Additional classes for the separator element' },
    ],
    usage: `import { Separator } from '@mcp-elements/react'

export function Example() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Server settings</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Configure transport and scopes.</p>
    </div>
  )
}`,
  },
  switch: {
    slug: 'switch',
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the switch is on' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the checked state should change' },
      { name: 'disabled', type: 'boolean', description: 'Whether the switch is disabled' },
      { name: 'id', type: 'string', description: 'HTML id applied to the switch button' },
      { name: 'name', type: 'string', description: 'Name for a hidden input, useful inside forms' },
    ],
    usage: `import { Switch } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [checked, setChecked] = useState(true)
  return (
    <label className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={setChecked} />
      Auto-approve safe tool calls
    </label>
  )
}`,
  },
  textarea: {
    slug: 'textarea',
    props: [
      { name: 'value', type: 'string', description: 'Controlled value of the textarea' },
      { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled' },
      { name: 'onChange', type: '(e: React.ChangeEvent<HTMLTextAreaElement>) => void', description: 'Called when the value changes' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'rows', type: 'number', description: 'Number of visible text rows' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the textarea is disabled' },
      { name: 'className', type: 'string', description: 'Additional classes merged onto the textarea' },
    ],
    usage: `import { Textarea } from '@mcp-elements/react'
import { useState } from 'react'

export function Example() {
  const [value, setValue] = useState('')
  return (
    <Textarea
      placeholder="Describe the tool you want to call…"
      rows={4}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}`,
  },
  toast: {
    slug: 'toast',
    props: [
      { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'bottom-right'", description: 'Where the toast stack is anchored on screen' },
      { name: 'className', type: 'string', description: 'Additional classes merged onto the toaster container' },
    ],
    usage: `import { Toaster, useToast } from '@mcp-elements/react'

export function Example() {
  const { toast } = useToast()
  return (
    <>
      <button
        onClick={() =>
          toast.success('Tool call complete', 'search_files returned 47 results')
        }
      >
        Run tool
      </button>
      <Toaster position="bottom-right" />
    </>
  )
}`,
  },
  tooltip: {
    slug: 'tooltip',
    props: [
      { name: 'content', type: 'React.ReactNode', required: true, description: 'Content shown inside the tooltip' },
      { name: 'children', type: 'React.ReactElement', required: true, description: 'The trigger element the tooltip is attached to' },
      { name: 'side', type: "'top' | 'bottom'", default: "'top'", description: 'Which side of the trigger the tooltip appears on' },
      { name: 'delay', type: 'number', description: 'Delay in milliseconds before the tooltip opens' },
      { name: 'className', type: 'string', description: 'Additional classes merged onto the tooltip content' },
    ],
    usage: `import { Tooltip } from '@mcp-elements/react'

export function Example() {
  return (
    <Tooltip content="Auto-approve read-only tool calls" side="top">
      <button>Auto-approve</button>
    </Tooltip>
  )
}`,
  },
}

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS[slug]
}
