import { forwardRef, useState } from 'react'
import { cn } from '@mcp-elements/core'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, className, ...props }, ref) => {
    const [hasError, setHasError] = useState(false)

    return (
      <div ref={ref} className={cn('mcpe-avatar', className)} {...props}>
        {src && !hasError ? (
          <img src={src} alt={alt} className="mcpe-avatar-image" onError={() => setHasError(true)} />
        ) : (
          <span className="mcpe-avatar-fallback">{fallback}</span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
