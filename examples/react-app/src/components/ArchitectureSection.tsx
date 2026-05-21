import { Card, CardContent } from '@snuxt-ui/react'
import { SectionHeader } from './SectionHeader'
import { useInView } from '../hooks/useInView'

interface LayerInfo {
  number: number
  name: string
  description: string
  color: string
  icon: React.ReactNode
}

const layers: LayerInfo[] = [
  {
    number: 0,
    name: '@mcp-elements/css',
    description: 'Tokens, styles, themes',
    color: 'oklch(0.65 0.2 280)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
        <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
        <path d="M14.5 17.5 4.5 15" />
      </svg>
    ),
  },
  {
    number: 1,
    name: '@mcp-elements/core',
    description: 'TS functions, state, ARIA',
    color: 'oklch(0.65 0.2 200)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    number: 2,
    name: '@snuxt-ui/react',
    description: 'Hooks, components',
    color: 'oklch(0.65 0.2 150)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
      </svg>
    ),
  },
  {
    number: 3,
    name: 'snuxt-ui',
    description: 'Copies code into your project',
    color: 'oklch(0.65 0.2 340)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    ),
  },
]

function ArrowRight() {
  return (
    <div className="hidden lg:flex items-center px-2 text-muted-foreground">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
  )
}

function ArrowDown() {
  return (
    <div className="lg:hidden text-muted-foreground flex justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14" />
        <path d="m5 12 7 7 7-7" />
      </svg>
    </div>
  )
}

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Architecture" subtitle="Four clean layers. No magic." />

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
          {layers.map((layer, index) => (
            <LayerCard key={layer.number} layer={layer} index={index} isLast={index === layers.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LayerCard({ layer, index, isLast }: { layer: LayerInfo; index: number; isLast: boolean }) {
  const { ref, inView } = useInView()

  return (
    <>
      <div
        ref={ref}
        className="flex-1 min-w-[200px] w-full lg:w-auto"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
          transitionDelay: `${index * 120}ms`,
        }}
      >
        <Card className="overflow-hidden" style={{ borderLeft: `4px solid ${layer.color}` }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: layer.color, color: 'white' }}
              >
                L{layer.number}
              </span>
              <span style={{ color: layer.color }}>{layer.icon}</span>
            </div>
            <p className="font-mono text-sm font-medium">{layer.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{layer.description}</p>
          </CardContent>
        </Card>
      </div>
      {!isLast && (
        <>
          <ArrowRight />
          <ArrowDown />
        </>
      )}
    </>
  )
}
