import { cn } from '@mcp-elements/core'
import { useToast } from './hooks/use-toast'

export interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

const TOAST_ICONS: Record<string, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
    </svg>
  ),
  destructive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  ),
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
          <span className="mcpe-toast-icon" aria-hidden="true">
            {TOAST_ICONS[t.variant ?? 'default'] ?? TOAST_ICONS.default}
          </span>
          <div className="mcpe-toast-body">
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
