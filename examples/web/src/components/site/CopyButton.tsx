'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
  /** Larger touch target for floating overlays. */
  size?: 'sm' | 'md'
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard API unavailable
    }
  }

  const dimension = size === 'md' ? 'h-7 w-7' : 'h-6 w-6'
  const iconSize = size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group/copy inline-flex shrink-0 items-center justify-center rounded-md ${dimension} ${className ?? ''}`}
      style={{
        color: copied ? 'var(--site-success)' : 'var(--site-text-subtle)',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        transition:
          'color var(--duration-fast) var(--ease-out-soft), background-color var(--duration-fast) var(--ease-out-soft), border-color var(--duration-fast) var(--ease-out-soft)',
      }}
      onMouseEnter={(e) => {
        if (copied) return
        e.currentTarget.style.color = 'var(--site-text)'
        e.currentTarget.style.backgroundColor = 'var(--site-bg)'
        e.currentTarget.style.borderColor = 'var(--site-border)'
      }}
      onMouseLeave={(e) => {
        if (copied) return
        e.currentTarget.style.color = 'var(--site-text-subtle)'
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.borderColor = 'transparent'
      }}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
    </button>
  )
}
