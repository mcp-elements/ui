import { cn } from '@mcp-elements/core'
import { useTooltip } from './hooks/use-tooltip'

export interface TooltipProps {
  content: React.ReactNode
  delay?: number
  children: React.ReactElement
  className?: string
  side?: 'top' | 'bottom'
}

export function Tooltip({ content, delay, children, className, side = 'top' }: TooltipProps) {
  const tooltip = useTooltip({ delay })

  const positionClasses = side === 'top'
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2'

  const triggerProps = tooltip.getTriggerProps()
  const contentProps = tooltip.getContentProps(tooltip.open)

  return (
    <div className="relative inline-flex" {...triggerProps}>
      {children}
      {tooltip.open && (
        <div
          {...contentProps}
          className={cn('mcpe-tooltip-content absolute', positionClasses, className)}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { useTooltip } from './hooks/use-tooltip'
