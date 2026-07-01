export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  return Array.from(elements)
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  const focusable = getFocusableElements(container)
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

export function createClickOutsideHandler(
  element: HTMLElement,
  callback: () => void
): () => void {
  const handler = (event: MouseEvent) => {
    if (!element.contains(event.target as Node)) {
      callback()
    }
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}

export function lockScroll(): () => void {
  const body = document.body
  // Compensate for the scrollbar disappearing so centered/fixed content
  // doesn't shift ("shake") the moment the overlay opens.
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  const prevOverflow = body.style.overflow
  const prevPaddingRight = body.style.paddingRight

  body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    const currentPad = parseFloat(getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${currentPad + scrollbarWidth}px`
  }

  return () => {
    body.style.overflow = prevOverflow
    body.style.paddingRight = prevPaddingRight
  }
}
