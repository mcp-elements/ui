export interface TooltipConfig {
  delay?: number
  onOpenChange?: (open: boolean) => void
}

let tooltipCounter = 0

export function createTooltip(config: TooltipConfig = {}) {
  const { delay = 700, onOpenChange } = config
  const id = `mcpe-tooltip-${++tooltipCounter}`
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function clearDelay() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function openWithDelay() {
    clearDelay()
    timeoutId = setTimeout(() => {
      onOpenChange?.(true)
    }, delay)
  }

  function close() {
    clearDelay()
    onOpenChange?.(false)
  }

  return {
    getTriggerProps: () => ({
      'aria-describedby': id,
      onMouseEnter: () => openWithDelay(),
      onMouseLeave: () => close(),
      onFocus: () => openWithDelay(),
      onBlur: () => close(),
    }),
    getContentProps: (isOpen: boolean) => ({
      id,
      role: 'tooltip' as const,
      hidden: !isOpen ? true : undefined,
    }),
    destroy: () => clearDelay(),
  }
}
