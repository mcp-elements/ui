import { useState, useEffect } from 'react'
import { Card, CardContent } from '@mcp-elements/react'
import { SectionHeader } from './SectionHeader'
import { useInView } from '../hooks/useInView'

interface TerminalLine {
  command: string
  response: string
  visible: boolean
}

const initialLines: TerminalLine[] = [
  { command: 'npx snuxt-ui init', response: ' \u2713 Detected: React + Tailwind v4', visible: false },
  { command: 'npx snuxt-ui add button dialog tabs', response: ' \u2713 3 components added to ./src/components', visible: false },
  { command: 'npx snuxt-ui theme glass', response: ' \u2713 Glass theme applied', visible: false },
]

const features = [
  {
    title: 'Zero Runtime',
    description: 'Pure CSS components with no JavaScript overhead',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: 'Tree-shakeable',
    description: 'Import only what you need, bundle only what you use',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
        <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
      </svg>
    ),
  },
  {
    title: 'Full TypeScript',
    description: 'Complete type safety across all components',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
]

export function CliDemo() {
  const { ref: termRef, inView: termInView } = useInView()
  const { ref: featRef, inView: featInView } = useInView()
  const [lines, setLines] = useState<TerminalLine[]>(initialLines)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!termInView || hasAnimated) return
    setHasAnimated(true)

    const timers: ReturnType<typeof setTimeout>[] = []

    lines.forEach((_, index) => {
      const timer = setTimeout(() => {
        setLines(prev =>
          prev.map((line, i) =>
            i === index ? { ...line, visible: true } : line
          )
        )
      }, (index + 1) * 800)
      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [termInView, hasAnimated])

  return (
    <section id="cli" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="One command. Full control."
          subtitle="Install components directly into your project. You own the code."
        />

        {/* Terminal mockup */}
        <div
          ref={termRef}
          style={{
            opacity: termInView ? 1 : 0,
            transform: termInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          }}
        >
          <Card className="bg-[oklch(0.15_0.02_280)] text-white rounded-xl overflow-hidden border-0">
            {/* Terminal header */}
            <div className="flex items-center px-4 py-3 bg-[oklch(0.12_0.02_280)]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-center text-sm text-white/50 font-medium">Terminal</span>
              <div className="w-[52px]" />
            </div>

            {/* Terminal body */}
            <CardContent className="p-6 font-mono text-sm leading-relaxed">
              {lines.map((line, index) => (
                <div
                  key={index}
                  style={{
                    opacity: line.visible ? 1 : 0,
                    transform: line.visible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                  }}
                >
                  <div className="mb-1">
                    <span className="text-[#28c840]">$ </span>
                    <span className="text-white">{line.command}</span>
                  </div>
                  <div className="text-[oklch(0.7_0.1_150)] mb-3">{line.response}</div>
                </div>
              ))}
              {/* Blinking cursor */}
              <span
                className="inline-block w-2 h-4 bg-white/70"
                style={{ animation: 'pulse 1.2s infinite' }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Feature cards */}
        <div
          ref={featRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          {features.map((feat, index) => (
            <div
              key={feat.title}
              style={{
                opacity: featInView ? 1 : 0,
                transform: featInView ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-muted-foreground">
                    {feat.icon}
                  </div>
                  <p className="font-medium text-sm">{feat.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feat.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
