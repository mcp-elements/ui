import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn('mcpe-alert', `mcpe-alert-${variant}`, className)}
      {...props}
    />
  )
)
Alert.displayName = 'Alert'

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mcpe-alert-title', className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('mcpe-alert-description', className)} {...props} />
}
