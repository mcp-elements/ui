import { cn } from '@mcp-elements/core'

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'muted'
}

export function Loader({ size = 'md', variant = 'primary', className, ...props }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('snx-loader', `snx-loader-${size}`, `snx-loader-${variant}`, className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
