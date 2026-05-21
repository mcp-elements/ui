import { cn } from '@mcp-elements/core'
import { useToast } from './hooks/use-toast'

export interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

export function Toaster({ position = 'bottom-right', className }: ToasterProps) {
  const { toasts, dismiss } = useToast()

  return (
    <div className={cn('mcpe-toaster', `mcpe-toaster-${position}`, className)}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'mcpe-toast group',
            t.variant === 'destructive' && 'mcpe-toast-destructive',
            t.variant === 'success' && 'mcpe-toast-success'
          )}
        >
          <div className="flex-1">
            {t.title && <div className="mcpe-toast-title">{t.title}</div>}
            {t.description && <div className="mcpe-toast-description">{t.description}</div>}
          </div>
          {t.action && (
            <button className="mcpe-toast-action" onClick={t.action.onClick} type="button">
              {t.action.label}
            </button>
          )}
          <button
            className="mcpe-toast-close"
            onClick={() => dismiss(t.id)}
            type="button"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export { useToast } from './hooks/use-toast'
