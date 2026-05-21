import { cn } from '@mcp-elements/core'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'outline' | 'destructive'
  onRemove?: () => void
}

export function Chip({ variant = 'default', onRemove, className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn('snx-chip', `snx-chip-${variant}`, onRemove && 'snx-chip-removable', className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className="snx-chip-remove"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export interface ChipsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Chips({ className, ...props }: ChipsProps) {
  return <div className={cn('snx-chips', className)} {...props} />
}
