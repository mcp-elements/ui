import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'user' | 'ai'
}

export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ variant = 'ai', className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-chat-bubble', `snx-chat-bubble-${variant}`, className)} {...props} />
  )
)
ChatBubble.displayName = 'ChatBubble'

export interface ChatBubbleAvatarProps {
  src: string
  alt: string
  className?: string
}

export function ChatBubbleAvatar({ src, alt, className }: ChatBubbleAvatarProps) {
  return <img src={src} alt={alt} className={cn('snx-chat-bubble-avatar', className)} />
}

export const ChatBubbleContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-chat-bubble-content', className)} {...props} />
  )
)
ChatBubbleContent.displayName = 'ChatBubbleContent'

export const ChatBubbleTimestamp = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('snx-chat-bubble-timestamp', className)} {...props} />
  )
)
ChatBubbleTimestamp.displayName = 'ChatBubbleTimestamp'

export function ChatBubbleTyping({ className }: { className?: string }) {
  return (
    <div className={cn('snx-chat-bubble-typing', className)}>
      <span className="snx-chat-bubble-typing-dot" />
      <span className="snx-chat-bubble-typing-dot" />
      <span className="snx-chat-bubble-typing-dot" />
    </div>
  )
}
