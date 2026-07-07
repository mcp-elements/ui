'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Github } from 'lucide-react'

interface MobileMenuProps {
  links: { href: string; label: string }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 site-link"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-0 top-14 flex flex-col gap-1 px-4 py-3"
          style={{
            backgroundColor: 'var(--site-bg)',
            borderBottom: '1px solid var(--site-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="site-link rounded-md px-3 py-2.5 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/mcp-elements/ui"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="site-link flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
          </a>
        </nav>
      )}
    </div>
  )
}
