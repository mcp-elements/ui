import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export const PromptInput = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-prompt-input', className)} {...props} />
  )
)
PromptInput.displayName = 'PromptInput'

export interface PromptInputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const PromptInputTextarea = forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('snx-prompt-input-textarea', className)} rows={3} {...props} />
  )
)
PromptInputTextarea.displayName = 'PromptInputTextarea'

export const PromptInputFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-prompt-input-footer', className)} {...props} />
  )
)
PromptInputFooter.displayName = 'PromptInputFooter'

export const PromptInputActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-prompt-input-actions', className)} {...props} />
  )
)
PromptInputActions.displayName = 'PromptInputActions'

export interface PromptInputCharCountProps {
  count: number
  max?: number
  className?: string
}

export function PromptInputCharCount({ count, max, className }: PromptInputCharCountProps) {
  return (
    <span className={cn('snx-prompt-input-char-count', className)}>
      {count}{max != null && `/${max}`}
    </span>
  )
}

export const PromptInputAttachments = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('snx-prompt-input-attachments', className)} {...props} />
  )
)
PromptInputAttachments.displayName = 'PromptInputAttachments'

export interface PromptInputAttachmentProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
}

export function PromptInputAttachment({ onRemove, className, children, ...props }: PromptInputAttachmentProps) {
  return (
    <span className={cn('snx-prompt-input-attachment', className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="snx-prompt-input-attachment-remove"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
