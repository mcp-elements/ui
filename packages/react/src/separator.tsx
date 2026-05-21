import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn('snx-separator', `snx-separator-${orientation}`, className)}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'
