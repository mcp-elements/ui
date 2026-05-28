'use client'

import { useEffect } from 'react'

/**
 * Sets data-scrolled="true|false" on <html> when the user scrolls past 8px.
 * Used by .site-nav to gain a subtle border + shadow once the page moves.
 */
export function ScrollObserver() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        root.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false'
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
