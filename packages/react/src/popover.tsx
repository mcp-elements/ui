import { useRef, useEffect } from 'react'
import { cn, createClickOutsideHandler } from '@mcp-elements/core'
import { usePopover } from './hooks/use-popover'

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Popover({ trigger, children, className }: PopoverProps) {
  const popover = usePopover()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!popover.open || !containerRef.current) return
    return createClickOutsideHandler(containerRef.current, () => popover.setOpen(false))
  }, [popover.open])

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => popover.setOpen(!popover.open)}>{trigger}</div>
      {popover.open && (
        <div
          className={cn('mcpe-popover-content absolute top-full mt-2', className)}
          role="dialog"
          onKeyDown={(e) => { if (e.key === 'Escape') popover.setOpen(false) }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { usePopover } from './hooks/use-popover'
