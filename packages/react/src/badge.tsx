import { cn } from '@mcp-elements/core'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return <div className={cn('mcpe-badge', `mcpe-badge-${variant}`, className)} {...props} />
}
