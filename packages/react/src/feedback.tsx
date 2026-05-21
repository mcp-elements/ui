import { forwardRef } from 'react'
import { cn } from '@mcp-elements/core'

export const Feedback = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-feedback', className)} {...props} />
  )
)
Feedback.displayName = 'Feedback'

export interface FeedbackButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type: 'up' | 'down'
  selected?: boolean
}

export function FeedbackButton({ type, selected = false, className, ...props }: FeedbackButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'mcpe-feedback-btn',
        `mcpe-feedback-btn-${type}`,
        selected && 'mcpe-feedback-btn-selected',
        className
      )}
      {...props}
    >
      {type === 'up' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
      )}
    </button>
  )
}

export function FeedbackSeparator({ className }: { className?: string }) {
  return <span className={cn('mcpe-feedback-separator', className)} />
}

export const FeedbackForm = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mcpe-feedback-form', className)} {...props} />
  )
)
FeedbackForm.displayName = 'FeedbackForm'

export const FeedbackInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn('mcpe-feedback-input', className)} placeholder="Add a comment..." {...props} />
  )
)
FeedbackInput.displayName = 'FeedbackInput'

export const FeedbackSubmit = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children = 'Submit', ...props }, ref) => (
    <button ref={ref} className={cn('mcpe-feedback-submit', className)} {...props}>
      {children}
    </button>
  )
)
FeedbackSubmit.displayName = 'FeedbackSubmit'
