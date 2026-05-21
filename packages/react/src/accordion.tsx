import { cn } from '@mcp-elements/core'
import { useAccordion } from './hooks/use-accordion'
import type { AccordionItemConfig, AccordionConfig } from '@mcp-elements/core'

export interface AccordionProps {
  items: AccordionItemConfig[]
  type?: AccordionConfig['type']
  collapsible?: boolean
  children: (api: ReturnType<typeof useAccordion>) => React.ReactNode
  className?: string
}

export function Accordion({ items, type, collapsible, children, className }: AccordionProps) {
  const api = useAccordion(items, { type, collapsible })
  return <div className={className}>{children(api)}</div>
}

export function AccordionItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mcpe-accordion-item', className)} {...props} />
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isExpanded?: boolean
}

export function AccordionTrigger({ isExpanded, className, children, ...props }: AccordionTriggerProps) {
  return (
    <h3>
      <button
        aria-expanded={isExpanded}
        className={cn('mcpe-accordion-trigger', className)}
        {...props}
      >
        {children}
        <svg className="mcpe-accordion-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  )
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="region" className={cn('mcpe-accordion-content', className)} {...props} />
}

export { useAccordion } from './hooks/use-accordion'
