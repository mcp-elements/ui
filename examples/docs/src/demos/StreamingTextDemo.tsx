import {
  StreamingText,
  StreamingTextLine,
  StreamingTextSkeleton,
  StreamingTextSkeletonLine,
} from '@mcp-elements/react'

export function StreamingTextDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Streaming with cursor</p>
        <StreamingText>
          <StreamingTextLine style={{ animationDelay: '0s' }}>
            CSS cascade layers give you more control over specificity.
          </StreamingTextLine>
          <StreamingTextLine style={{ animationDelay: '0.2s' }}>
            They allow you to define explicit layers of specificity.
          </StreamingTextLine>
        </StreamingText>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Loading skeleton</p>
        <StreamingTextSkeleton>
          <StreamingTextSkeletonLine />
          <StreamingTextSkeletonLine />
          <StreamingTextSkeletonLine />
        </StreamingTextSkeleton>
      </div>
    </div>
  )
}
