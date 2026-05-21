import { useRef, useEffect } from 'react'
import { cn, createClickOutsideHandler } from '@mcp-elements/core'
import { useDropdownMenu } from './hooks/use-dropdown-menu'
import type { DropdownMenuItem } from '@mcp-elements/core'

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  className?: string
  align?: 'start' | 'end'
}

export function DropdownMenu({ trigger, items, className, align = 'end' }: DropdownMenuProps) {
  const menu = useDropdownMenu(items)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu.isOpen || !containerRef.current) return
    return createClickOutsideHandler(containerRef.current, () => menu.setIsOpen(false))
  }, [menu.isOpen])

  const actionItems = items.filter(i => i.type !== 'separator' && i.type !== 'label' && !i.disabled)

  return (
    <div ref={containerRef} className="relative inline-block" onKeyDown={menu.handleKeyDown}>
      <div
        onClick={() => menu.setIsOpen(!menu.isOpen)}
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
      >
        {trigger}
      </div>
      {menu.isOpen && (
        <div
          className={cn(
            'mcpe-dropdown-menu-content absolute top-full mt-1',
            align === 'end' ? 'right-0' : 'left-0',
            className
          )}
          role="menu"
        >
          {items.map((item) => {
            if (item.type === 'separator') {
              return <div key={item.id} className="mcpe-dropdown-menu-separator" role="separator" />
            }
            if (item.type === 'label') {
              return <div key={item.id} className="mcpe-dropdown-menu-label">{item.label}</div>
            }
            const actionIndex = actionItems.findIndex(ai => ai.id === item.id)
            return (
              <div
                key={item.id}
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                className={cn(
                  'mcpe-dropdown-menu-item',
                  actionIndex === menu.highlightedIndex && !item.disabled && 'mcpe-dropdown-menu-item-active',
                  item.disabled && 'opacity-50 pointer-events-none'
                )}
                onClick={() => {
                  if (!item.disabled) {
                    item.onSelect?.()
                    menu.setIsOpen(false)
                  }
                }}
                onMouseEnter={() => {
                  if (!item.disabled) menu.setHighlightedIndex(actionIndex)
                }}
              >
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="mcpe-dropdown-menu-shortcut">{item.shortcut}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { useDropdownMenu } from './hooks/use-dropdown-menu'
