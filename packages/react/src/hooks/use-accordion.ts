import { useState, useMemo } from 'react'
import { createAccordion, type AccordionItemConfig, type AccordionConfig } from '@mcp-elements/core'

export function useAccordion(items: AccordionItemConfig[], config: Omit<AccordionConfig, 'onValueChange'> = {}) {
  const [expandedValues, setExpandedValues] = useState<string[]>([])

  const api = useMemo(
    () => createAccordion(items, { ...config, onValueChange: setExpandedValues }),
    [items, config.type, config.collapsible]
  )

  return { expandedValues, setExpandedValues, ...api }
}
