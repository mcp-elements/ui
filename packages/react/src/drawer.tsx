import { useEffect, useRef } from 'react'
import { cn, trapFocus, lockScroll } from '@mcp-elements/core'
import { useDrawer } from './hooks/use-drawer'

export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'left' | 'right' | 'top' | 'bottom'
  children: React.ReactNode
}

export function Drawer({ open: controlledOpen, onOpenChange, side = 'right', children }: DrawerProps) {
  const drawer = useDrawer({ side })
  const isOpen = controlledOpen ?? drawer.open
  const setOpen = onOpenChange ?? drawer.setOpen
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const unlock = lockScroll()
    return unlock
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !contentRef.current) return
    const el = contentRef.current
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return }
      trapFocus(el, e)
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="mcpe-drawer-overlay" onClick={() => setOpen(false)} />
      <div
        ref={contentRef}
        className={cn('mcpe-drawer-content', `mcpe-drawer-content-${side}`)}
        role="dialog"
        aria-modal={true}
      >
        {children}
        <button className="mcpe-drawer-close" aria-label="Close" onClick={() => setOpen(false)} type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  )
}

export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mcpe-drawer-header', className)} {...props} />
}
export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mcpe-drawer-footer', className)} {...props} />
}
export function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('mcpe-drawer-title', className)} {...props} />
}
export function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mcpe-drawer-description', className)} {...props} />
}
export function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mcpe-drawer-body', className)} {...props} />
}

export { useDrawer } from './hooks/use-drawer'
