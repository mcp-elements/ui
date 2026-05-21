import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Switch } from '@mcp-elements/react'
import { SectionHeader } from './SectionHeader'
import { useInView } from '../hooks/useInView'
import { useState } from 'react'

interface ThemePanel {
  label: string
  dataTheme?: string
}

const themes: ThemePanel[] = [
  { label: 'Light' },
  { label: 'Dark', dataTheme: 'dark' },
  { label: 'Glass', dataTheme: 'glass' },
]

function ThemePanelContent({ id }: { id: string }) {
  const [checked, setChecked] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Search..." />
        <div className="flex gap-2">
          <Button variant="primary">Save</Button>
          <Button variant="outline">Cancel</Button>
        </div>
        <div className="flex gap-2">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={`switch-${id}`}
            checked={checked}
            onCheckedChange={setChecked}
          />
          <label htmlFor={`switch-${id}`} className="text-sm">
            Notifications
          </label>
        </div>
      </CardContent>
    </Card>
  )
}

export function ThemeShowcase() {
  return (
    <section id="themes" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Three themes. One system."
          subtitle="Switch themes with a single HTML attribute. No configuration needed."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <ThemePanelCard key={theme.label} theme={theme} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ThemePanelCard({ theme, index }: { theme: ThemePanel; index: number }) {
  const { ref, inView } = useInView()

  const panelId = theme.label.toLowerCase()
  const isGlass = theme.dataTheme === 'glass'

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 500ms ease-out, transform 500ms ease-out',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <p className="text-sm font-medium mb-2">{theme.label}</p>
      <div
        data-theme={theme.dataTheme}
        className="bg-background text-foreground rounded-xl border overflow-hidden"
      >
        {isGlass ? (
          <div className="glass-panel-bg p-4">
            <ThemePanelContent id={panelId} />
          </div>
        ) : (
          <div className="p-4">
            <ThemePanelContent id={panelId} />
          </div>
        )}
      </div>
    </div>
  )
}
