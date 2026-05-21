import { useState } from 'react'
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Avatar,
  Separator,
  Skeleton,
  Select,
  Switch,
  Counter,
  Progress,
  Loader,
  Chip,
  Chips,
  PasswordInput,
  Alert,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  AiBadge,
  SuggestionChips,
  SuggestionChip,
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  SourceCards,
  SourceCard,
  StreamingText,
  StreamingTextLine,
  Feedback,
  FeedbackButton,
} from '@mcp-elements/react'

/* ── Category definitions ─────────────────────────── */

type ComponentDef = {
  name: string
  slug: string
  render: () => React.ReactNode
}

const categories: Record<string, ComponentDef[]> = {
  form: [
    {
      name: 'Button',
      slug: 'button',
      render: () => (
        <div className="flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      ),
    },
    {
      name: 'Input',
      slug: 'input',
      render: () => (
        <div className="w-full max-w-[200px]">
          <Input placeholder="Enter email..." type="email" />
        </div>
      ),
    },
    {
      name: 'Textarea',
      slug: 'textarea',
      render: () => (
        <div className="w-full max-w-[200px]">
          <Textarea placeholder="Write a message..." rows={3} />
        </div>
      ),
    },
    {
      name: 'Password Input',
      slug: 'password-input',
      render: () => (
        <div className="w-full max-w-[200px]">
          <PasswordInput placeholder="Password" />
        </div>
      ),
    },
    {
      name: 'Select',
      slug: 'select',
      render: () => (
        <div className="w-full max-w-[200px]">
          <Select
            options={[
              { value: 'react', label: 'React' },
              { value: 'angular', label: 'Angular' },
              { value: 'vue', label: 'Vue' },
            ]}
            placeholder="Framework..."
          />
        </div>
      ),
    },
    {
      name: 'Switch',
      slug: 'switch',
      render: () => <SwitchMini />,
    },
    {
      name: 'Counter',
      slug: 'counter',
      render: () => <CounterMini />,
    },
  ],
  display: [
    {
      name: 'Badge',
      slug: 'badge',
      render: () => (
        <div className="flex gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      ),
    },
    {
      name: 'Card',
      slug: 'card',
      render: () => (
        <Card className="w-full max-w-[200px]">
          <CardHeader>
            <CardTitle style={{ fontSize: '0.875rem' }}>Card Title</CardTitle>
            <CardDescription>Brief description</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: '0.75rem', color: 'var(--sl-color-gray-3)', margin: 0 }}>
              Card content area.
            </p>
          </CardContent>
        </Card>
      ),
    },
    {
      name: 'Avatar',
      slug: 'avatar',
      render: () => (
        <div className="flex items-center -space-x-2">
          <Avatar fallback="SN" />
          <Avatar fallback="UI" />
          <Avatar fallback="TS" />
        </div>
      ),
    },
    {
      name: 'Separator',
      slug: 'separator',
      render: () => (
        <div className="w-full max-w-[200px] flex flex-col gap-2">
          <span style={{ fontSize: '0.75rem', color: 'var(--sl-color-gray-2)' }}>Above</span>
          <Separator />
          <span style={{ fontSize: '0.75rem', color: 'var(--sl-color-gray-2)' }}>Below</span>
        </div>
      ),
    },
    {
      name: 'Skeleton',
      slug: 'skeleton',
      render: () => (
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ),
    },
    {
      name: 'Progress',
      slug: 'progress',
      render: () => (
        <div className="w-full max-w-[200px]">
          <Progress value={65} />
        </div>
      ),
    },
    {
      name: 'Loader',
      slug: 'loader',
      render: () => (
        <div className="flex gap-3 items-center">
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </div>
      ),
    },
  ],
  overlay: [
    {
      name: 'Dialog',
      slug: 'dialog',
      render: () => <Button variant="outline">Open Dialog</Button>,
    },
    {
      name: 'Tooltip',
      slug: 'tooltip',
      render: () => (
        <Tooltip content="Helpful tooltip text">
          <Button variant="outline">Hover me</Button>
        </Tooltip>
      ),
    },
    {
      name: 'Popover',
      slug: 'popover',
      render: () => <Button variant="outline">Open Popover</Button>,
    },
    {
      name: 'Toast',
      slug: 'toast',
      render: () => <Button variant="outline">Show Toast</Button>,
    },
    {
      name: 'Drawer',
      slug: 'drawer',
      render: () => <Button variant="outline">Open Drawer</Button>,
    },
  ],
  navigation: [
    {
      name: 'Tabs',
      slug: 'tabs',
      render: () => <TabsMini />,
    },
    {
      name: 'Accordion',
      slug: 'accordion',
      render: () => <Button variant="outline">View Accordion</Button>,
    },
    {
      name: 'Dropdown Menu',
      slug: 'dropdown-menu',
      render: () => <Button variant="outline">Open Menu</Button>,
    },
  ],
  feedback: [
    {
      name: 'Alert',
      slug: 'alert',
      render: () => (
        <div className="w-full max-w-[220px]">
          <Alert variant="default">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>Components copy into your project.</AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      name: 'Chips',
      slug: 'chips',
      render: () => (
        <Chips>
          <Chip>React</Chip>
          <Chip>Angular</Chip>
          <Chip>CSS</Chip>
        </Chips>
      ),
    },
  ],
  ai: [
    {
      name: 'Prompt Input',
      slug: 'prompt-input',
      render: () => <Button variant="outline">Try Prompt Input</Button>,
    },
    {
      name: 'Chat Bubble',
      slug: 'chat-bubble',
      render: () => (
        <div className="w-full max-w-[240px]">
          <ChatBubble variant="ai">
            <ChatBubbleAvatar
              src="https://api.dicebear.com/9.x/bottts/svg?seed=Aneka"
              alt="AI"
            />
            <div>
              <ChatBubbleContent>Here's a helpful response!</ChatBubbleContent>
            </div>
          </ChatBubble>
        </div>
      ),
    },
    {
      name: 'AI Badge',
      slug: 'ai-badge',
      render: () => (
        <div className="flex gap-2">
          <AiBadge variant="default">AI</AiBadge>
          <AiBadge variant="prominent">AI Generated</AiBadge>
        </div>
      ),
    },
    {
      name: 'Suggestion Chips',
      slug: 'suggestion-chips',
      render: () => (
        <SuggestionChips>
          <SuggestionChip variant="default">Tell me more</SuggestionChip>
          <SuggestionChip variant="outline">Show code</SuggestionChip>
        </SuggestionChips>
      ),
    },
    {
      name: 'Source Card',
      slug: 'source-card',
      render: () => (
        <SourceCards className="w-full max-w-[240px]">
          <SourceCard href="#" title="CSS Layers — MDN" domain="developer.mozilla.org" index={1} />
        </SourceCards>
      ),
    },
    {
      name: 'Streaming Text',
      slug: 'streaming-text',
      render: () => (
        <div className="w-full max-w-[220px]">
          <StreamingText>
            <StreamingTextLine style={{ animationDelay: '0s' }}>
              Framework-agnostic components
            </StreamingTextLine>
            <StreamingTextLine style={{ animationDelay: '0.15s' }}>
              built for accessibility.
            </StreamingTextLine>
          </StreamingText>
        </div>
      ),
    },
    {
      name: 'Feedback',
      slug: 'feedback',
      render: () => <FeedbackMini />,
    },
  ],
}

/* ── Stateful mini demos ──────────────────────────── */

function SwitchMini() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} />
      <span style={{ fontSize: '0.8125rem', color: 'var(--sl-color-gray-2)' }}>
        {on ? 'On' : 'Off'}
      </span>
    </div>
  )
}

function CounterMini() {
  const [count, setCount] = useState(3)
  return <Counter value={count} onChange={setCount} min={0} max={10} />
}

function TabsMini() {
  const items = [{ value: 'one' }, { value: 'two' }, { value: 'three' }]
  return (
    <div className="w-full max-w-[220px]">
      <Tabs items={items} defaultValue="one">
        {(api) => (
          <>
            <TabsList>
              {items.map((item) => (
                <TabsTrigger
                  key={item.value}
                  isActive={api.value === item.value}
                  onClick={() => api.setValue(item.value)}
                >
                  {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent>
              <div
                style={{
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--sl-color-gray-3)',
                }}
              >
                Tab {api.value} content
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

function FeedbackMini() {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)
  return (
    <Feedback>
      <FeedbackButton
        type="up"
        selected={selected === 'up'}
        onClick={() => setSelected(selected === 'up' ? null : 'up')}
      />
      <FeedbackButton
        type="down"
        selected={selected === 'down'}
        onClick={() => setSelected(selected === 'down' ? null : 'down')}
      />
    </Feedback>
  )
}

/* ── Coming soon components ────────────────────────── */

const comingSoon = [
  { name: 'Checkbox', icon: '☑' },
  { name: 'Radio Group', icon: '◉' },
  { name: 'Toggle', icon: '⊡' },
  { name: 'Slider', icon: '◈' },
  { name: 'Date Picker', icon: '📅' },
  { name: 'Breadcrumb', icon: '⟩' },
  { name: 'Pagination', icon: '…' },
  { name: 'Table', icon: '▦' },
  { name: 'Command', icon: '⌘' },
  { name: 'Sidebar', icon: '☰' },
  { name: 'Carousel', icon: '⟷' },
  { name: 'Calendar', icon: '◫' },
]

/* ── Grid components ──────────────────────────────── */

export function ComponentCategoryGrid({ category }: { category: string }) {
  const items = categories[category]
  if (!items) return null

  return (
    <div className="component-grid not-content">
      {items.map((comp) => (
        <a
          key={comp.slug}
          href={`/components/${comp.slug}/`}
          className="component-grid-card"
        >
          <div className="component-grid-card-preview">{comp.render()}</div>
          <div className="component-grid-card-label">{comp.name}</div>
        </a>
      ))}
    </div>
  )
}

export function ComingSoonGrid() {
  return (
    <div className="component-grid not-content">
      {comingSoon.map((comp) => (
        <div key={comp.name} className="component-grid-card coming-soon">
          <div className="component-grid-card-preview">
            <div className="coming-soon-content">
              <span className="coming-soon-icon">{comp.icon}</span>
            </div>
          </div>
          <div className="component-grid-card-label">
            {comp.name}
            <span className="coming-soon-badge">Soon</span>
          </div>
        </div>
      ))}
    </div>
  )
}
