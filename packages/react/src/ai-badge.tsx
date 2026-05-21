import { cn } from '@mcp-elements/core'

export interface AiBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'prominent' | 'subtle'
  showIcon?: boolean
}

export function AiBadge({ variant = 'default', showIcon = true, className, children, ...props }: AiBadgeProps) {
  return (
    <span className={cn('mcpe-ai-badge', `mcpe-ai-badge-${variant}`, className)} {...props}>
      {showIcon && (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 1-1.275-1.275L3 12l5.813-1.912a2 2 0 0 1 1.275-1.275L12 3z" />
        </svg>
      )}
      {children}
    </span>
  )
}
