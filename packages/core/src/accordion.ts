import { Keys } from './utils/keyboard'

export interface AccordionConfig {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  onValueChange?: (value: string[]) => void
}

export interface AccordionItemConfig {
  value: string
  disabled?: boolean
}

export function createAccordion(items: AccordionItemConfig[], config: AccordionConfig = {}) {
  const { type = 'single', collapsible = false, onValueChange } = config

  function toggle(value: string, expandedValues: string[]) {
    const isExpanded = expandedValues.includes(value)

    if (type === 'single') {
      if (isExpanded && collapsible) {
        onValueChange?.([])
      } else if (!isExpanded) {
        onValueChange?.([value])
      }
    } else {
      if (isExpanded) {
        onValueChange?.(expandedValues.filter(v => v !== value))
      } else {
        onValueChange?.([...expandedValues, value])
      }
    }
  }

  return {
    getItemProps: (value: string) => ({
      'data-value': value,
    }),
    getTriggerProps: (value: string, expandedValues: string[]) => {
      const isExpanded = expandedValues.includes(value)
      const item = items.find(i => i.value === value)

      return {
        'aria-expanded': isExpanded,
        'aria-controls': `accordion-content-${value}`,
        id: `accordion-trigger-${value}`,
        disabled: item?.disabled || false,
        onClick: () => {
          if (!item?.disabled) toggle(value, expandedValues)
        },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          const enabledItems = items.filter(i => !i.disabled)
          const currentEnabledIndex = enabledItems.findIndex(i => i.value === value)

          if (e.key === Keys.ArrowDown) {
            e.preventDefault()
            const next = currentEnabledIndex + 1
            if (next < enabledItems.length) {
              const el = document.getElementById(`accordion-trigger-${enabledItems[next].value}`)
              el?.focus()
            }
          } else if (e.key === Keys.ArrowUp) {
            e.preventDefault()
            const prev = currentEnabledIndex - 1
            if (prev >= 0) {
              const el = document.getElementById(`accordion-trigger-${enabledItems[prev].value}`)
              el?.focus()
            }
          } else if (e.key === Keys.Home) {
            e.preventDefault()
            const el = document.getElementById(`accordion-trigger-${enabledItems[0].value}`)
            el?.focus()
          } else if (e.key === Keys.End) {
            e.preventDefault()
            const el = document.getElementById(`accordion-trigger-${enabledItems[enabledItems.length - 1].value}`)
            el?.focus()
          }
        },
      }
    },
    getContentProps: (value: string, expandedValues: string[]) => {
      const isExpanded = expandedValues.includes(value)
      return {
        role: 'region' as const,
        id: `accordion-content-${value}`,
        'aria-labelledby': `accordion-trigger-${value}`,
        hidden: !isExpanded ? true : undefined,
      }
    },
  }
}
