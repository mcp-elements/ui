import { useState } from 'react'
import {
  Button,
  Badge,
  Input,
  Switch,
  Avatar,
  Loader,
  Progress,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Select,
  Counter,
  Alert,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AiBadge,
  SuggestionChips,
  SuggestionChip,
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleTimestamp,
  Feedback,
  FeedbackButton,
  SourceCards,
  SourceCard,
  StreamingText,
  StreamingTextLine,
  Tooltip,
  Separator,
} from '@mcp-elements/react'

function BentoCard({
  label,
  tall,
  children,
  className = '',
}: {
  label?: string
  tall?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bento-card ${tall ? 'bento-card-tall' : ''} ${className}`}>
      {label && <span className="bento-card-label">{label}</span>}
      {children}
    </div>
  )
}

/* ── Mini demos ────────────────────────────────────── */

function SwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-2">
      <Switch checked={on} onCheckedChange={setOn} />
      <span style={{ fontSize: '0.75rem', color: 'var(--sl-color-gray-2)' }}>
        {on ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}

function CounterDemo() {
  const [count, setCount] = useState(3)
  return <Counter value={count} onChange={setCount} min={0} max={10} />
}

function SelectDemo() {
  return (
    <div className="w-full max-w-[180px]">
      <Select
        options={[
          { value: 'react', label: 'React' },
          { value: 'angular', label: 'Angular' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        placeholder="Framework..."
      />
    </div>
  )
}

function TabsDemo() {
  const items = [{ value: 'design' }, { value: 'code' }, { value: 'preview' }]
  return (
    <div className="w-full max-w-[220px]">
      <Tabs items={items} defaultValue="design">
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
                  fontSize: '0.6875rem',
                  color: 'var(--sl-color-gray-2)',
                }}
              >
                {api.value === 'design' && 'Visual design tokens and styles.'}
                {api.value === 'code' && 'Source code and implementations.'}
                {api.value === 'preview' && 'Live interactive preview.'}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

function FeedbackDemo() {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)
  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontSize: '0.6875rem', color: 'var(--sl-color-gray-3)' }}>
        Was this helpful?
      </span>
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
    </div>
  )
}

function LoginCardDemo() {
  return (
    <Card className="w-full max-w-[240px]">
      <CardHeader>
        <CardTitle style={{ fontSize: '0.875rem' }}>Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1.5">
        <Button variant="primary" className="w-full">
          Continue
        </Button>
        <Button variant="ghost" className="w-full">
          Forgot password?
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ── Main grid ─────────────────────────────────────── */

export function ComponentShowcase() {
  return (
    <div className="bento-grid">
      {/* ── Column 1 ── */}
      <div className="bento-col">
        <BentoCard label="Input">
          <div className="w-full max-w-[180px]">
            <Input placeholder="Enter your email..." type="email" />
          </div>
        </BentoCard>

        <BentoCard label="Select">
          <SelectDemo />
        </BentoCard>

        <BentoCard label="Progress">
          <div className="w-full max-w-[180px] flex flex-col gap-2">
            <Progress value={72} />
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '0.6875rem', color: 'var(--sl-color-gray-3)' }}>
                Storage
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--sl-color-gray-2)' }}>72%</span>
            </div>
          </div>
        </BentoCard>

        <BentoCard label="Chat">
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            <ChatBubble variant="user">
              <ChatBubbleAvatar
                src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
                alt="U"
              />
              <div>
                <ChatBubbleContent>How do CSS layers work?</ChatBubbleContent>
                <ChatBubbleTimestamp>2:30 PM</ChatBubbleTimestamp>
              </div>
            </ChatBubble>
            <ChatBubble variant="ai">
              <ChatBubbleAvatar
                src="https://api.dicebear.com/9.x/bottts/svg?seed=Aneka"
                alt="AI"
              />
              <div>
                <ChatBubbleContent>
                  CSS cascade layers let you control specificity ordering explicitly.
                </ChatBubbleContent>
                <ChatBubbleTimestamp>2:30 PM</ChatBubbleTimestamp>
              </div>
            </ChatBubble>
          </div>
        </BentoCard>

        <BentoCard label="Streaming">
          <div className="w-full max-w-[220px]">
            <StreamingText>
              <StreamingTextLine style={{ animationDelay: '0s' }}>
                Framework-agnostic components
              </StreamingTextLine>
              <StreamingTextLine style={{ animationDelay: '0.15s' }}>
                built with accessibility in mind.
              </StreamingTextLine>
            </StreamingText>
          </div>
        </BentoCard>
      </div>

      {/* ── Column 2 ── */}
      <div className="bento-col">
        <BentoCard label="Avatars">
          <div className="flex items-center -space-x-2">
            <Avatar fallback="SN" />
            <Avatar fallback="UI" />
            <Avatar fallback="TS" />
            <Avatar fallback="+" />
          </div>
        </BentoCard>

        <BentoCard label="Buttons">
          <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
            <Button variant="primary" className="w-full">
              Get started
            </Button>
            <Button variant="outline" className="w-full">
              Documentation
            </Button>
            <Button variant="ghost" className="w-full">
              Learn more
            </Button>
          </div>
        </BentoCard>

        <BentoCard label="Tabs">
          <TabsDemo />
        </BentoCard>

        <BentoCard label="Alert">
          <div className="w-full max-w-[220px]">
            <Alert variant="default">
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>Components are copied into your project.</AlertDescription>
            </Alert>
          </div>
        </BentoCard>

        <BentoCard label="Switch">
          <SwitchDemo />
        </BentoCard>

        <BentoCard label="Feedback">
          <FeedbackDemo />
        </BentoCard>
      </div>

      {/* ── Column 3 ── */}
      <div className="bento-col">
        <BentoCard label="Sign in" tall>
          <LoginCardDemo />
        </BentoCard>

        <BentoCard label="AI">
          <div className="flex flex-col items-center gap-2">
            <AiBadge variant="prominent">AI Generated</AiBadge>
            <SuggestionChips>
              <SuggestionChip variant="default">Tell me more</SuggestionChip>
              <SuggestionChip variant="outline">Show code</SuggestionChip>
            </SuggestionChips>
          </div>
        </BentoCard>

        <BentoCard label="Badges">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </BentoCard>

        <BentoCard label="Counter">
          <CounterDemo />
        </BentoCard>

        <BentoCard label="Sources">
          <SourceCards className="w-full max-w-[220px]">
            <SourceCard
              href="#"
              title="CSS Cascade Layers — MDN"
              domain="developer.mozilla.org"
              index={1}
            />
            <SourceCard href="#" title="Learn CSS Layers" domain="web.dev" index={2} />
          </SourceCards>
        </BentoCard>
      </div>
    </div>
  )
}
