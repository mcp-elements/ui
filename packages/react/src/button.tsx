import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('mcpe-btn', `mcpe-btn-${variant}`, `mcpe-btn-${size}`, className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
