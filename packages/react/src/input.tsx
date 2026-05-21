import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn('mcpe-input', className)} {...props} />
  )
)
Input.displayName = 'Input'
