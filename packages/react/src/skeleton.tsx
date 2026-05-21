import { cn } from '@mcp-elements/core'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('mcpe-skeleton', className)} {...props} />
}
