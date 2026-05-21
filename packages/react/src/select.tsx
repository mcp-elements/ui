import { useRef, useEffect } from 'react'
import { cn, createClickOutsideHandler } from '@mcp-elements/core'
import { useSelect } from './hooks/use-select'
import type { SelectOption } from '@mcp-elements/core'

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
}

export function Select({ options, placeholder = 'Select...', className, onChange }: SelectProps) {
  const select = useSelect(options)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === select.selectedValue)?.label

  useEffect(() => {
    if (!select.isOpen || !containerRef.current) return
    return createClickOutsideHandler(containerRef.current, () => select.setIsOpen(false))
  }, [select.isOpen])

  useEffect(() => {
    if (select.selectedValue && onChange) {
      onChange(select.selectedValue)
    }
  }, [select.selectedValue])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        className="snx-select-trigger"
        aria-expanded={select.isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={select.isOpen && select.highlightedIndex >= 0 ? `select-option-${options[select.highlightedIndex]?.value}` : undefined}
        onClick={() => select.setIsOpen(!select.isOpen)}
        onKeyDown={select.handleKeyDown}
        type="button"
      >
        <span className={cn(!selectedLabel && 'text-muted-foreground')}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={cn('h-4 w-4 opacity-50 transition-transform', select.isOpen && 'rotate-180')}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {select.isOpen && (
        <div className="snx-select-content absolute top-full mt-1 w-full">
          <div className="snx-select-viewport" role="listbox">
            {options.map((option, index) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === select.selectedValue}
                aria-disabled={option.disabled || undefined}
                className={cn(
                  'snx-select-item',
                  index === select.highlightedIndex && !option.disabled && 'snx-select-item-active',
                  option.value === select.selectedValue && 'snx-select-item-selected',
                  option.disabled && 'opacity-50 pointer-events-none'
                )}
                onClick={() => {
                  if (!option.disabled) {
                    select.setSelectedValue(option.value)
                    select.setIsOpen(false)
                  }
                }}
                onMouseEnter={() => {
                  if (!option.disabled) select.setHighlightedIndex(index)
                }}
              >
                {option.value === select.selectedValue && (
                  <svg className="absolute right-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { useSelect } from './hooks/use-select'
