import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleTimestamp,
  ChatBubbleTyping,
} from '@mcp-elements/react'

export function ChatBubbleDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <ChatBubble variant="user">
        <ChatBubbleAvatar src="https://api.dicebear.com/9.x/avataaars/svg?seed=user" alt="User" />
        <div>
          <ChatBubbleContent>Can you explain how CSS layers work?</ChatBubbleContent>
          <ChatBubbleTimestamp>2:30 PM</ChatBubbleTimestamp>
        </div>
      </ChatBubble>

      <ChatBubble variant="ai">
        <ChatBubbleAvatar src="https://api.dicebear.com/9.x/bottts/svg?seed=ai" alt="AI" />
        <div>
          <ChatBubbleContent>
            CSS cascade layers let you control specificity by grouping styles into named layers
            using <code>@layer</code>. Styles in later layers take precedence over earlier ones,
            regardless of selector specificity.
          </ChatBubbleContent>
          <ChatBubbleTimestamp>2:30 PM</ChatBubbleTimestamp>
        </div>
      </ChatBubble>

      <ChatBubble variant="ai">
        <ChatBubbleAvatar src="https://api.dicebear.com/9.x/bottts/svg?seed=ai" alt="AI" />
        <ChatBubbleTyping />
      </ChatBubble>
    </div>
  )
}
