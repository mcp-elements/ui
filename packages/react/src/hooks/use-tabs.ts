import { useState, useMemo } from 'react'
import { createTabs, type TabItem, type TabsConfig } from '@mcp-elements/core'

export function useTabs(items: TabItem[], config: Omit<TabsConfig, 'onValueChange'> = {}) {
  const [value, setValue] = useState(config.defaultValue ?? items[0]?.value ?? '')

  const api = useMemo(
    () => createTabs(items, { ...config, onValueChange: setValue }),
    [items, config.defaultValue]
  )

  return { value, setValue, ...api }
}
