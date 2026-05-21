import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface SuggestionChipsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SuggestionChips = forwardRef<HTMLDivElement, SuggestionChipsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-suggestion-chips', className)} {...props} />
  )
)
SuggestionChips.displayName = 'SuggestionChips'

export interface SuggestionChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline'
}

export const SuggestionChip = forwardRef<HTMLButtonElement, SuggestionChipProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn('mcpe-suggestion-chip', `mcpe-suggestion-chip-${variant}`, className)}
      {...props}
    />
  )
)
SuggestionChip.displayName = 'SuggestionChip'
