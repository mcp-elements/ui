export interface DialogConfig {
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}

let dialogCounter = 0

export function createDialog(config: DialogConfig = {}) {
  const { modal = true, onOpenChange } = config
  const id = `mcpe-dialog-${++dialogCounter}`

  return {
    id,
    getTriggerProps: (isOpen: boolean) => ({
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': isOpen,
      onClick: () => onOpenChange?.(!isOpen),
    }),
    getContentProps: (isOpen: boolean) => ({
      role: 'dialog' as const,
      'aria-modal': modal,
      'aria-labelledby': `${id}-title`,
      'aria-describedby': `${id}-description`,
      hidden: !isOpen ? true : undefined,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange?.(false)
      },
    }),
    getOverlayProps: () => ({
      'aria-hidden': true as const,
      onClick: () => onOpenChange?.(false),
    }),
    getCloseProps: () => ({
      'aria-label': 'Close',
      onClick: () => onOpenChange?.(false),
    }),
  }
}
