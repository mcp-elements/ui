import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface StreamingTextProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StreamingText = forwardRef<HTMLDivElement, StreamingTextProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-streaming-text-cursor', className)} {...props} />
  )
)
StreamingText.displayName = 'StreamingText'

export const StreamingTextFadeIn = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('mcpe-streaming-text-fade-in', className)} {...props} />
  )
)
StreamingTextFadeIn.displayName = 'StreamingTextFadeIn'

export const StreamingTextWord = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('mcpe-streaming-text-word', className)} {...props} />
  )
)
StreamingTextWord.displayName = 'StreamingTextWord'

export const StreamingTextLine = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-streaming-text-line', className)} {...props} />
  )
)
StreamingTextLine.displayName = 'StreamingTextLine'

export const StreamingTextSkeleton = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-streaming-text-skeleton', className)} {...props} />
  )
)
StreamingTextSkeleton.displayName = 'StreamingTextSkeleton'

export const StreamingTextSkeletonLine = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-streaming-text-skeleton-line', className)} {...props} />
  )
)
StreamingTextSkeletonLine.displayName = 'StreamingTextSkeletonLine'
